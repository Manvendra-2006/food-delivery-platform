import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AppContext } from '../context/AppContext'
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, ShieldCheck } from 'lucide-react'

const RESTAURANT_API = 'http://localhost:2000/api'
const PAYMENT_API = 'http://localhost:3000/api/payment'

const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(true), { once: true })
    existingScript.addEventListener('error', () => reject(new Error('Razorpay SDK failed to load')), { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true
  script.onload = () => resolve(true)
  script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
  document.body.appendChild(script)
})

const getDistanceInKilometers = (firstLatitude, firstLongitude, secondLatitude, secondLongitude) => {
  const earthRadius = 6371
  const latitudeDifference = (secondLatitude - firstLatitude) * Math.PI / 180
  const longitudeDifference = (secondLongitude - firstLongitude) * Math.PI / 180
  const latitudeOne = firstLatitude * Math.PI / 180
  const latitudeTwo = secondLatitude * Math.PI / 180
  const value = Math.sin(latitudeDifference / 2) ** 2 +
    Math.sin(longitudeDifference / 2) ** 2 * Math.cos(latitudeOne) * Math.cos(latitudeTwo)

  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

const CheckOut = () => {
  const { cart, subtotal, quantity } = useContext(AppContext)
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(true)
  const [paymentState, setPaymentState] = useState('idle')
  const [paymentMessage, setPaymentMessage] = useState('')
  const verificationStarted = useRef(false)

  const restaurant = cart[0]?.restaurantId
  const restaurantId = restaurant?._id || restaurant
  const restaurantCoordinates = restaurant?.addLocation?.coordinates
  const subtotalAmount = Number(subtotal)
  const deliveryFee = subtotalAmount < 250 ? 49 : 0
  const platformFee = 7
  const displayTotal = subtotalAmount + deliveryFee + platformFee

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(`${RESTAURANT_API}/address/fetch-address`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const fetchedAddresses = data.fetchAddress || []
        setAddresses(fetchedAddresses)
        setSelectedAddressId(fetchedAddresses[0]?._id || null)
      } catch (error) {
        setPaymentMessage(error.response?.data?.message || 'Unable to load your addresses.')
      } finally {
        setLoadingAddress(false)
      }
    }

    fetchAddresses()
  }, [])

  const selectedAddress = addresses.find((address) => address._id === selectedAddressId)

  const verifyPayment = async (orderId, paymentResponse) => {
    try {
      const { data } = await axios.post(`${PAYMENT_API}/verify`, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderId
      })

      setPaymentState('success')
      setPaymentMessage(data.message || 'Payment verified successfully.')
      toast.success('Payment successful')
   
navigate('/payment-success', {
  state: {
    orderId,
    amount: displayTotal,
    restaurantName: restaurant?.name,
    address: selectedAddress?.formattedAddress,
  },
})
    } catch (error) {
      setPaymentState('error')
      setPaymentMessage(error.response?.data?.message || 'Payment verification failed. Please try again.')
    }
  }

  const handlePayNow = async () => {
    if (paymentState === 'creating' || paymentState === 'verifying') return
    if (!selectedAddressId || !restaurantId) {
      setPaymentState('error')
      setPaymentMessage('Select a delivery address before paying.')
      return
    }
    if (!restaurantCoordinates || restaurantCoordinates.length < 2 || !selectedAddress?.location?.coordinates) {
      setPaymentState('error')
      setPaymentMessage('Delivery location details are unavailable. Please select another address.')
      return
    }

    try {
      setPaymentState('creating')
      setPaymentMessage('Preparing secure payment...')
      const [restaurantLongitude, restaurantLatitude] = restaurantCoordinates
      const [addressLongitude, addressLatitude] = selectedAddress.location.coordinates
      const distance = getDistanceInKilometers(
        Number(addressLatitude),
        Number(addressLongitude),
        Number(restaurantLatitude),
        Number(restaurantLongitude)
      )

      const { data: orderData } = await axios.post(
        `${RESTAURANT_API}/order/create-order/${selectedAddressId}/${restaurantId}`,
        { paymentMethod: 'razorpay', distance },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      const orderId = orderData.orderId
      const amount = Number(orderData.amount)
      if (!orderId || !Number.isFinite(amount) || amount <= 0) {
        throw new Error('Order details were not returned by the server.')
      }

      const { data: paymentData } = await axios.post(`${PAYMENT_API}/create`, { orderId })
      if (!paymentData.razorpayOrderId || !paymentData.key) {
        throw new Error('Payment details were not returned by the server.')
      }

      await loadRazorpay()
      setPaymentState('idle')
      setPaymentMessage('')
      verificationStarted.current = false

      const razorpay = new window.Razorpay({
        key: paymentData.key,
        amount: amount,
        currency: 'INR',
        order_id: paymentData.razorpayOrderId,
        name: 'Tomato',
        description: 'Food order payment',
        handler: async (response) => {
          if (verificationStarted.current) return
          verificationStarted.current = true
          setPaymentState('verifying')
          setPaymentMessage('Verifying your payment...')
          await verifyPayment(orderId, response)
        },
        modal: {
          ondismiss: () => {
            if (!verificationStarted.current) {
              setPaymentState('error')
              setPaymentMessage('Payment was cancelled. You can try again.')
            }
          }
        },
        theme: { color: '#E23744' }
      })
      razorpay.on('payment.failed', () => {
        setPaymentState('error')
        setPaymentMessage('Payment failed. Please try again.')
      })
      razorpay.open()
    } catch (error) {
      setPaymentState('error')
      setPaymentMessage(error.response?.data?.message || error.message || 'Unable to start payment. Please try again.')
    }
  }

  if (quantity === 0 || cart.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#FFFBF5] to-[#FCEAEA]/30 px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#2B211B]">Your cart is empty</h1>
        <button onClick={() => navigate('/')} className="mt-6 rounded-xl bg-[#E23744] px-6 py-3 font-semibold text-white">Continue shopping</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFFBF5] to-[#FCEAEA]/30 px-4 py-6 text-[#2B211B]">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-[#5C534C] hover:text-[#E23744]">
          <ArrowLeft size={20} /> Back to cart
        </button>
        <h1 className="font-serif text-3xl font-bold">Checkout</h1>

        <section className="mt-5 rounded-2xl border border-[#EFE8DD] bg-white p-5 shadow-[0_2px_20px_rgba(43,33,27,0.06)]">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-[#E23744]" />
            <h2 className="font-semibold">Delivery address</h2>
          </div>
          {loadingAddress ? (
            <p className="mt-4 text-sm text-[#8A8078]">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <div className="mt-4 rounded-xl bg-[#FFFBF5] p-4 text-sm text-[#8A8078]">
              No saved address found. Add one before placing your order.
              <button onClick={() => navigate('/address')} className="mt-3 block font-semibold text-[#E23744]">Add address</button>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {addresses.map((address) => (
                <label key={address._id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${selectedAddressId === address._id ? 'border-[#E23744] bg-[#FCEAEA]/40' : 'border-[#EFE8DD]'}`}>
                  <input type="radio" name="address" checked={selectedAddressId === address._id} onChange={() => setSelectedAddressId(address._id)} className="mt-1 accent-[#E23744]" />
                  <span>
                    <span className="block font-medium">{address.formattedAddress}</span>
                    <span className="mt-1 block text-sm text-[#8A8078]">Phone: {address.phoneNo}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-2xl border border-[#EFE8DD] bg-white p-5 shadow-[0_2px_20px_rgba(43,33,27,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Order summary</h2>
            <span className="text-sm text-[#8A8078]">{quantity} item{quantity === 1 ? '' : 's'}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#EFE8DD] pt-4">
            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between text-[#5C534C]">
                <span>Subtotal</span>
                <span>₹{subtotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5C534C]">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5C534C]">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-[#EFE8DD] pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="text-xl font-bold text-[#E23744]">₹{displayTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {paymentMessage && (
          <div className={`mt-4 flex items-start gap-2 rounded-xl border p-4 text-sm ${paymentState === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-[#E23744]/20 bg-[#FCEAEA]/50 text-[#A52A35]'}`}>
            {paymentState === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <span>{paymentMessage}</span>
          </div>
        )}

        {paymentState === 'success' ? (
          <button onClick={() => navigate('/')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E23744] py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(226,55,68,0.35)]">
            Continue shopping
          </button>
        ) : (
          <button
            onClick={handlePayNow}
            disabled={loadingAddress || addresses.length === 0 || paymentState === 'creating' || paymentState === 'verifying'}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E23744] py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(226,55,68,0.35)] transition hover:bg-[#C42A36] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard size={18} />
            {paymentState === 'creating' ? 'Preparing payment...' : paymentState === 'verifying' ? 'Verifying payment...' : 'Pay now with Razorpay'}
          </button>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#8A8078]"><ShieldCheck size={15} /> Secure payment verification by Razorpay</p>
      </div>
    </div>
  )
}

export default CheckOut