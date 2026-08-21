import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Truck, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, subtotal, quantity, updateCartQuantity, deleteCartItem, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [updatingItems, setUpdatingItems] = useState({})
  const [deletingItems, setDeletingItems] = useState({})

  if (!user || user.role !== 'Customer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/40 px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-[#E23744]/10">
            <ShoppingCart size={26} className="text-[#E23744]" />
          </div>
          <p className="text-[#8A8078] mb-5">Please log in as a customer to view cart</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_4px_14px_rgba(226,55,68,0.3)]"
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  const handleQuantityIncrease = async (menuId, cartId, currentQuantity) => {
    const newQuantity = currentQuantity + 1
    setUpdatingItems({ ...updatingItems, [cartId]: true })
    const result = await updateCartQuantity(menuId, cartId, newQuantity)
    if (result.success) {
      toast.success("Quantity updated")
    } else {
      toast.error("Failed to update quantity")
    }
    setUpdatingItems({ ...updatingItems, [cartId]: false })
  }

  const handleQuantityDecrease = async (menuId, cartId, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleDeleteItem(cartId)
      return
    }
    const newQuantity = currentQuantity - 1
    setUpdatingItems({ ...updatingItems, [cartId]: true })
    const result = await updateCartQuantity(menuId, cartId, newQuantity)
    if (result.success) {
      toast.success("Quantity updated")
    } else {
      toast.error("Failed to update quantity")
    }
    setUpdatingItems({ ...updatingItems, [cartId]: false })
  }

  const handleDeleteItem = async (cartId) => {
    if (!confirm("Remove this item from cart?")) return
    setDeletingItems({ ...deletingItems, [cartId]: true })
    const result = await deleteCartItem(cartId)
    if (result.success) {
      toast.success("Item removed from cart")
    } else {
      toast.error("Failed to remove item")
    }
    setDeletingItems({ ...deletingItems, [cartId]: false })
  }

  if (quantity === 0 || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-20 px-4 pt-4">
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5C534C] hover:text-[#E23744] transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-[#FCEAEA]/60 border border-[#EFE8DD] shadow-[0_4px_20px_rgba(43,33,27,0.06)] flex items-center justify-center mb-5">
            <ShoppingCart size={34} className="text-[#E23744]/40" />
          </div>
          <p className="font-serif text-xl font-bold text-[#2B211B] mb-1">Your cart is empty</p>
          <p className="text-sm text-[#8A8078] mb-6">Add some dishes to get started</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.98] text-white px-7 py-3 rounded-xl font-semibold transition-all shadow-[0_4px_14px_rgba(226,55,68,0.3)]"
          >
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-32 px-4 pt-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5C534C] hover:text-[#E23744] transition-colors mb-3"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 flex items-center justify-center ring-1 ring-[#E23744]/10">
            <ShoppingCart size={20} className="text-[#E23744]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2B211B] leading-tight">Shopping cart</h1>
            <p className="text-sm text-[#8A8078]">{quantity} item{quantity !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="mt-4 flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] hover:shadow-[0_4px_24px_rgba(43,33,27,0.1)] hover:border-[#E23744]/20 transition-all p-4 flex gap-4"
          >
            {/* Item Image */}
            <div className="shrink-0">
              <img
                src={item.menuId?.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-[#F1EFE8] ring-1 ring-[#EFE8DD] shadow-sm"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80'
                }}
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#2B211B]">{item.name}</h3>
                <p className="text-sm text-[#E23744] font-medium mt-1">
                  ₹{item.menuId?.price ? Number(item.menuId.price).toFixed(2) : '0.00'}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 bg-[#FFFBF5] border border-[#E7DFD3] rounded-xl px-3 py-2 shadow-sm">
                  <button
                    onClick={() =>
                      handleQuantityDecrease(
                        item.menuId?._id,
                        item._id,
                        item.quantity
                      )
                    }
                    disabled={updatingItems[item._id]}
                    className="text-[#5C534C] hover:text-[#E23744] disabled:opacity-50 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-semibold text-[#2B211B]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityIncrease(
                        item.menuId?._id,
                        item._id,
                        item.quantity
                      )
                    }
                    disabled={updatingItems[item._id]}
                    className="text-[#5C534C] hover:text-[#E23744] disabled:opacity-50 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  disabled={deletingItems[item._id]}
                  className="p-2 text-[#E23744] hover:bg-[#FCEAEA] rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="shrink-0 text-right flex flex-col justify-between items-end">
              <p className="font-bold text-[#2B211B]">
                ₹{item.menuId?.price
                  ? (Number(item.menuId.price) * item.quantity).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-xs text-[#B4AA9C] bg-[#FFFBF5] px-2 py-0.5 rounded-full border border-[#EFE8DD]">
                {item.quantity}x
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_4px_28px_rgba(43,33,27,0.1)] p-6 sticky bottom-0">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-[#E23744]" />
          <h2 className="text-sm font-semibold text-[#2B211B]">Order summary</h2>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-[#5C534C] text-sm">
            <span>Subtotal</span>
            <span>₹{Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#5C534C] text-sm">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#8A8078]" />
              Delivery
            </span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="border-t border-dashed border-[#EFE8DD] pt-3 flex justify-between items-center">
            <span className="text-base font-semibold text-[#2B211B]">Total</span>
            <span className="text-xl font-bold text-[#E23744]">₹{Number(subtotal).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold transition-all shadow-[0_4px_16px_rgba(226,55,68,0.35)]"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

export default Cart