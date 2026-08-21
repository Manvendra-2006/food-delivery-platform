import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, MapPin, Receipt, UtensilsCrossed } from 'lucide-react'
const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (!state?.orderId) {
      navigate('/', { replace: true })
      return
    }
    const timer = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(timer)
  }, [state, navigate])

  if (!state?.orderId) return null

  const { orderId, amount, restaurantName, address, eta } = state
  const shortOrderId = String(orderId).slice(-8).toUpperCase()

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFFBF5] to-[#FCEAEA]/30 px-4 py-10 text-[#2B211B]">
      <div className="mx-auto max-w-md">       
        <div className="flex justify-center">
          <div
            className={`grid h-20 w-20 place-items-center rounded-full bg-[#E23744] shadow-[0_10px_30px_rgba(226,55,68,0.35)] transition-all duration-700 ease-out ${
              revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <svg viewBox="0 0 52 52" className="h-10 w-10">
              <circle
                cx="26" cy="26" r="23" fill="none" stroke="white" strokeWidth="2.5"
                strokeDasharray="145" strokeDashoffset={revealed ? 0 : 145}
                style={{ transition: 'stroke-dashoffset 0.6s ease-out 0.15s' }}
              />
              <path
                d="M15 27 L22 34 L37 18" fill="none" stroke="white" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="34" strokeDashoffset={revealed ? 0 : 34}
                style={{ transition: 'stroke-dashoffset 0.4s ease-out 0.7s' }}
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-5 text-center font-serif text-2xl font-bold">Payment successful</h1>
        <p className="mt-1.5 text-center text-sm text-[#8A8078]">
          {restaurantName ? `Your order from ${restaurantName} is confirmed.` : 'Your order is confirmed.'}
        </p>
        <div className="relative mt-7">
          <div className="rounded-t-2xl border border-b-0 border-[#EFE8DD] bg-white px-6 pb-2 pt-6 shadow-[0_2px_24px_rgba(43,33,27,0.07)]">
            <div className="flex items-center justify-between border-b border-dashed border-[#EFE8DD] pb-4">
              <span className="flex items-center gap-2 text-sm text-[#8A8078]">
                <Receipt size={16} className="text-[#E23744]" /> Order ID
              </span>
              <span className="font-mono text-sm font-semibold tracking-wide">#{shortOrderId}</span>
            </div>

            {restaurantName && (
              <div className="flex items-center justify-between border-b border-dashed border-[#EFE8DD] py-4">
                <span className="flex items-center gap-2 text-sm text-[#8A8078]">
                  <UtensilsCrossed size={16} className="text-[#E23744]" /> Restaurant
                </span>
                <span className="max-w-[60%] truncate text-right text-sm font-medium">{restaurantName}</span>
              </div>
            )}

            {address && (
              <div className="flex items-start justify-between gap-4 border-b border-dashed border-[#EFE8DD] py-4">
                <span className="flex shrink-0 items-center gap-2 text-sm text-[#8A8078]">
                  <MapPin size={16} className="text-[#E23744]" /> Delivering to
                </span>
                <span className="text-right text-sm font-medium">{address}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-dashed border-[#EFE8DD] py-4">
              <span className="flex items-center gap-2 text-sm text-[#8A8078]">
                <Clock size={16} className="text-[#E23744]" /> Estimated arrival
              </span>
              <span className="text-sm font-medium">{eta || '30-40 mins'}</span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm font-semibold text-[#2B211B]">Amount paid</span>
              <span className="text-xl font-bold text-[#E23744]">₹{Number(amount).toFixed(2)}</span>
            </div>
          </div>
          <div
            className="h-4 rounded-b-2xl border border-t-0 border-[#EFE8DD] bg-white shadow-[0_2px_24px_rgba(43,33,27,0.07)]"
            style={{
              maskImage: 'radial-gradient(circle 7px at 8px 0, transparent 7px, black 7.5px)',
              maskRepeat: 'repeat-x',
              maskSize: '18px 100%',
              WebkitMaskImage: 'radial-gradient(circle 7px at 8px 0, transparent 7px, black 7.5px)',
              WebkitMaskRepeat: 'repeat-x',
              WebkitMaskSize: '18px 100%',
            }}
          />
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button
            onClick={() => navigate('/myorders')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E23744] py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(226,55,68,0.35)] transition hover:bg-[#C42A36]"
          >
            <CheckCircle2 size={18} /> Track your order
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl border border-[#EFE8DD] bg-white py-3.5 font-semibold text-[#2B211B] transition hover:bg-[#FFFBF5]"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess