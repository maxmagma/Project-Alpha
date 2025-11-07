'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']
type CartItemRow = Database['public']['Tables']['cart_items']['Row']

interface CartItem extends CartItemRow {
  product: Product
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const isDemoMode = !supabase

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    try {
      // Demo mode - just set loading to false
      if (isDemoMode) {
        console.log('🎨 Running in demo mode - cart disabled')
        setIsLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase
        .from('cart_items')
        .select('*, product:products(*)')

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        const sessionId = getOrCreateSessionId()
        query = query.eq('session_id', sessionId)
      }

      const { data } = await query

      if (data) {
        setItems(data as CartItem[])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function addItem(product: Product) {
    if (isDemoMode) {
      console.log('🎨 Demo mode - cart actions disabled')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const item = {
        product_id: product.id,
        quantity: 1,
        price_snapshot: product.base_price,
        ...(user ? { user_id: user.id } : { session_id: getOrCreateSessionId() })
      }

      const { data, error } = await supabase
        .from('cart_items')
        .upsert(item, { onConflict: user ? 'user_id,product_id' : 'session_id,product_id' })
        .select('*, product:products(*)')
        .single()

      if (error) throw error

      if (data) {
        setItems(prev => {
          const existing = prev.find(i => i.product.id === product.id)
          if (existing) {
            return prev.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
          return [...prev, data as CartItem]
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  async function removeItem(itemId: string) {
    if (isDemoMode) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (isDemoMode) return

    if (quantity <= 0) {
      return removeItem(itemId)
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  async function clearCart() {
    if (isDemoMode) {
      setItems([])
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase.from('cart_items').delete().eq('user_id', user.id)
      } else {
        const sessionId = getOrCreateSessionId()
        await supabase.from('cart_items').delete().eq('session_id', sessionId)
      }

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.base_price) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = nanoid()
    localStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}
