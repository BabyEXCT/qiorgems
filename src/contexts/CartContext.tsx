'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { showToast } from '@/utils/alerts'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  material: string
  category: string
}

export interface AppliedVoucher {
  id: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  discountAmount: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  appliedVoucher: AppliedVoucher | null
  originalTotal: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_VOUCHER'; payload: AppliedVoucher }
  | { type: 'REMOVE_VOUCHER' }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  appliedVoucher: null,
  originalTotal: 0
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      const originalTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const total = state.appliedVoucher ? originalTotal - state.appliedVoucher.discountAmount : originalTotal
      
      return { ...state, items: newItems, total, itemCount, originalTotal }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const originalTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const total = state.appliedVoucher ? originalTotal - state.appliedVoucher.discountAmount : originalTotal
      
      return { ...state, items: newItems, total, itemCount, originalTotal }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      const originalTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const total = state.appliedVoucher ? originalTotal - state.appliedVoucher.discountAmount : originalTotal
      
      return { ...state, items: newItems, total, itemCount, originalTotal }
    }
    
    case 'APPLY_VOUCHER': {
      const originalTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const total = originalTotal - action.payload.discountAmount
      
      return { ...state, appliedVoucher: action.payload, total, originalTotal }
    }
    
    case 'REMOVE_VOUCHER': {
      const originalTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return { ...state, appliedVoucher: null, total: originalTotal, originalTotal }
    }
    
    case 'CLEAR_CART':
      return initialState
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  applyVoucher: (voucher: AppliedVoucher) => void
  removeVoucher: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = state.items.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      showToast(`Updated ${item.name} quantity in cart`, 'success')
    } else {
      showToast(`${item.name} added to cart`, 'success')
    }
    dispatch({ type: 'ADD_ITEM', payload: item })
  }
  
  const removeItem = (id: string) => {
    const item = state.items.find(item => item.id === id)
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    if (item) {
      showToast(`${item.name} removed from cart`, 'info')
    }
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }
  
  const applyVoucher = (voucher: AppliedVoucher) => {
    dispatch({ type: 'APPLY_VOUCHER', payload: voucher })
    showToast(`Voucher ${voucher.code} applied successfully`, 'success')
  }
  
  const removeVoucher = () => {
    dispatch({ type: 'REMOVE_VOUCHER' })
    showToast('Voucher removed', 'info')
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, applyVoucher, removeVoucher, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}