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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in as a customer to view cart</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
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
      <div className="min-h-screen bg-[#f7f4ef] pb-20 px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 mb-4"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center py-20">
          <ShoppingCart size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-32 px-4 pt-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">{quantity} item{quantity !== 1 ? 's' : ''}</p>
      </div>

      {/* Cart Items */}
      <div className="mt-4 flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
          >
            {/* Item Image */}
            <div className="shrink-0">
              <img
                src={item.menuId?.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80'
                }}
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{item.menuId?.price ? Number(item.menuId.price).toFixed(2) : '0.00'}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <button
                    onClick={() =>
                      handleQuantityDecrease(
                        item.menuId?._id,
                        item._id,
                        item.quantity
                      )
                    }
                    disabled={updatingItems[item._id]}
                    className="text-gray-600 disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-medium text-gray-900">
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
                    className="text-gray-600 disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  disabled={deletingItems[item._id]}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="shrink-0 text-right">
              <p className="font-bold text-gray-900">
                ₹{item.menuId?.price
                  ? (Number(item.menuId.price) * item.quantity).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.quantity}x
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm p-6 sticky bottom-0">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>₹0.00</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{Number(subtotal).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart