import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, subtotal, quantity, updateCartQuantity, deleteCartItem, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [updatingItems, setUpdatingItems] = useState({})
  const [deletingItems, setDeletingItems] = useState({})

  if (!user || user.role !== 'Customer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#E23744]/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={24} className="text-[#E23744]" />
          </div>
          <p className="text-[#8A8078] mb-5">Please log in as a customer to view cart</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#E23744] hover:bg-[#C42A36] text-white px-6 py-2.5 rounded-xl font-semibold transition"
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
      <div className="min-h-screen bg-[#FFFBF5] pb-20 px-4 pt-4">
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5C534C] hover:text-[#2B211B] transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-white border border-[#EFE8DD] flex items-center justify-center mb-5">
            <ShoppingCart size={32} className="text-[#B4AA9C]" />
          </div>
          <p className="font-serif text-lg font-bold text-[#2B211B] mb-1">Your cart is empty</p>
          <p className="text-sm text-[#8A8078] mb-6">Add some dishes to get started</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#E23744] hover:bg-[#C42A36] text-white px-6 py-2.5 rounded-xl font-semibold transition"
          >
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-32 px-4 pt-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5C534C] hover:text-[#2B211B] transition mb-3"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="font-serif text-2xl font-bold text-[#2B211B]">Shopping cart</h1>
        <p className="text-sm text-[#8A8078] mt-1">{quantity} item{quantity !== 1 ? 's' : ''}</p>
      </div>

      {/* Cart Items */}
      <div className="mt-4 flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4 flex gap-4"
          >
            {/* Item Image */}
            <div className="shrink-0">
              <img
                src={item.menuId?.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-[#F1EFE8]"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80'
                }}
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#2B211B]">{item.name}</h3>
                <p className="text-sm text-[#8A8078] mt-1">
                  ₹{item.menuId?.price ? Number(item.menuId.price).toFixed(2) : '0.00'}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 bg-[#FFFBF5] border border-[#E7DFD3] rounded-xl px-3 py-2">
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
                  <span className="w-6 text-center font-medium text-[#2B211B]">
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
                  className="p-2 text-[#E23744] hover:bg-[#FCEAEA] rounded-lg disabled:opacity-50 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="shrink-0 text-right">
              <p className="font-semibold text-[#2B211B]">
                ₹{item.menuId?.price
                  ? (Number(item.menuId.price) * item.quantity).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-xs text-[#B4AA9C] mt-1">
                {item.quantity}x
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-6 sticky bottom-0">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-[#5C534C] text-sm">
            <span>Subtotal</span>
            <span>₹{Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#5C534C] text-sm">
            <span>Delivery</span>
            <span>₹0.00</span>
          </div>
          <div className="border-t border-[#EFE8DD] pt-3 flex justify-between text-lg font-bold text-[#2B211B]">
            <span>Total</span>
            <span>₹{Number(subtotal).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold transition-all shadow-sm"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

export default Cart