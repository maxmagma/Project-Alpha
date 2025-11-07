'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product, VisionBoardItem, VisionBoardContextType } from '@/types/vision-board'

const VisionBoardContext = createContext<VisionBoardContextType | undefined>(undefined)

export function VisionBoardProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<VisionBoardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const isDemoMode = !supabase

  useEffect(() => {
    loadBoard()
  }, [])

  async function loadBoard() {
    try {
      // Demo mode - just set loading to false
      if (isDemoMode) {
        console.log('🎨 Running in demo mode - vision board disabled')
        setIsLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase
        .from('vision_board_items')
        .select('*, product:products(*, vendor:vendors(id, company_name, email, lead_fee))')

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        const sessionId = getOrCreateSessionId()
        query = query.eq('session_id', sessionId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading vision board:', error)
      } else {
        setItems(data || [])
      }
    } catch (error) {
      console.error('Error in loadBoard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function addItem(product: Product, quantity: number = 1) {
    if (isDemoMode) {
      console.log('Demo mode - would add:', product.name)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const item = {
        product_id: product.id,
        quantity,
        ...(user ? { user_id: user.id } : { session_id: getOrCreateSessionId() })
      }

      const { data, error } = await supabase
        .from('vision_board_items')
        .upsert(item, { onConflict: user ? 'user_id,product_id' : 'session_id,product_id' })
        .select('*, product:products(*, vendor:vendors(id, company_name, email, lead_fee))')
        .single()

      if (error) throw error

      if (data) {
        setItems(prev => {
          const existing = prev.find(i => i.product.id === product.id)
          if (existing) {
            // Update existing
            return prev.map(i => i.product.id === product.id ? data : i)
          }
          // Add new
          return [...prev, data]
        })
      }
    } catch (error) {
      console.error('Error adding to vision board:', error)
      throw error
    }
  }

  async function removeItem(itemId: string) {
    if (isDemoMode) return

    try {
      const { error } = await supabase
        .from('vision_board_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch (error) {
      console.error('Error removing from vision board:', error)
      throw error
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (isDemoMode) return

    try {
      const { error } = await supabase
        .from('vision_board_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      setItems(prev =>
        prev.map(i => i.id === itemId ? { ...i, quantity } : i)
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  async function updateNotes(itemId: string, notes: string) {
    if (isDemoMode) return

    try {
      const { error } = await supabase
        .from('vision_board_items')
        .update({ notes })
        .eq('id', itemId)

      if (error) throw error

      setItems(prev =>
        prev.map(i => i.id === itemId ? { ...i, notes } : i)
      )
    } catch (error) {
      console.error('Error updating notes:', error)
      throw error
    }
  }

  async function clearBoard() {
    if (isDemoMode) return

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase.from('vision_board_items').delete().eq('user_id', user.id)
      } else {
        const sessionId = getOrCreateSessionId()
        await supabase.from('vision_board_items').delete().eq('session_id', sessionId)
      }

      setItems([])
    } catch (error) {
      console.error('Error clearing vision board:', error)
      throw error
    }
  }

  // Computed values
  const rentalItems = items.filter(
    i => i.product.fulfillment_type === 'rental' || i.product.fulfillment_type === 'service'
  )

  const purchasableItems = items.filter(
    i => i.product.fulfillment_type === 'purchasable'
  )

  const totalRentalValue = rentalItems.reduce(
    (sum, item) => sum + (Number(item.product.base_price) * item.quantity),
    0
  )

  const totalPurchaseValue = purchasableItems.reduce(
    (sum, item) => sum + (Number(item.product.base_price) * item.quantity),
    0
  )

  return (
    <VisionBoardContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearBoard,
        totalItems: items.length,
        rentalItems,
        purchasableItems,
        totalRentalValue,
        totalPurchaseValue,
        isLoading,
      }}
    >
      {children}
    </VisionBoardContext.Provider>
  )
}

export function useVisionBoard() {
  const context = useContext(VisionBoardContext)
  if (!context) {
    throw new Error('useVisionBoard must be used within VisionBoardProvider')
  }
  return context
}

// Helper function for guest session
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('vision_board_session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('vision_board_session', sessionId)
  }
  return sessionId
}
