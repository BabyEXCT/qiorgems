'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { showToast } from '@/utils/alerts'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  material: string
  category: string
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

const initialState: WishlistState = {
  items: [],
  itemCount: 0
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return state // Item already in wishlist
      }
      
      const newItems = [...state.items, action.payload]
      const itemCount = newItems.length
      
      return { ...state, items: newItems, itemCount }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const itemCount = newItems.length
      
      return { ...state, items: newItems, itemCount }
    }
    
    case 'CLEAR_WISHLIST':
      return initialState
    
    default:
      return state
  }
}

interface WishlistContextType {
  state: WishlistState
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  
  const addItem = (item: WishlistItem) => {
    const existingItem = state.items.find(wishlistItem => wishlistItem.id === item.id)
    if (existingItem) {
      showToast(`${item.name} is already in your wishlist`, 'info')
      return
    }
    
    dispatch({ type: 'ADD_ITEM', payload: item })
    showToast(`${item.name} added to wishlist`, 'success')
  }
  
  const removeItem = (id: string) => {
    const item = state.items.find(item => item.id === id)
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    if (item) {
      showToast(`${item.name} removed from wishlist`, 'info')
    }
  }
  
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
    showToast('Wishlist cleared', 'info')
  }
  
  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id)
  }
  
  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}