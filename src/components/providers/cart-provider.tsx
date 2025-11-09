'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
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
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Cache user ID and listen for auth changes
  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Load cart on mount and when user changes
  useEffect(() => {
    if (userId !== undefined) {
      loadCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const loadCart = useCallback(async () => {
    try {
      let query = supabase
        .from('cart_items')
        .select('*, product:products(*)')

      if (userId) {
        query = query.eq('user_id', userId)
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
  }, [supabase, userId])

  const addItem = useCallback(async (product: Product) => {
    try {
      const item = {
        product_id: product.id,
        quantity: 1,
        price_snapshot: product.base_price,
        ...(userId ? { user_id: userId } : { session_id: getOrCreateSessionId() })
      }

      const { data, error } = await supabase
        .from('cart_items')
        .upsert(item, { onConflict: userId ? 'user_id,product_id' : 'session_id,product_id' })
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
  }, [supabase, userId])

  const removeItem = useCallback(async (itemId: string) => {
    // Store previous state for rollback
    const previousItems = items

    try {
      // Optimistic update
      setItems(prev => prev.filter(i => i.id !== itemId))

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      // Rollback on error
      setItems(previousItems)
      console.error('Error removing from cart:', error)
      throw error
    }
  }, [supabase, items])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }

    // Store previous state for rollback
    const previousItems = items

    try {
      // Optimistic update
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
      )

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      // Rollback on error
      setItems(previousItems)
      console.error('Error updating quantity:', error)
      throw error
    }
  }, [supabase, removeItem, items])

  const clearCart = useCallback(async () => {
    // Store previous state for rollback
    const previousItems = items

    try {
      // Optimistic update
      setItems([])

      if (userId) {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', userId)
        if (error) throw error
      } else {
        const sessionId = getOrCreateSessionId()
        const { error } = await supabase.from('cart_items').delete().eq('session_id', sessionId)
        if (error) throw error
      }
    } catch (error) {
      // Rollback on error
      setItems(previousItems)
      console.error('Error clearing cart:', error)
      throw error
    }
  }, [supabase, userId, items])

  // Memoize expensive calculations to prevent unnecessary recalculations
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.product.base_price) * item.quantity,
      0
    )
  }, [items])

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
