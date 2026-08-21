import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle2
} from "lucide-react"

const RestaurantPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchRestaurant() {
    try {
      const { data } = await axios.get(
        `http://localhost:2000/api/restaurant/restaurant-data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      setRestaurant(data.restaurant)

    } catch (error) {
      console.log(error)
      setRestaurant(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurant()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-[#EFE8DD] border-t-[#E23744] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[#8A8078]">
            Loading restaurant...
          </p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#2B211B] flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl font-bold">
          Restaurant not found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 px-5 py-2.5 bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.98] text-white rounded-xl font-semibold shadow-[0_4px_14px_rgba(226,55,68,0.3)] transition-all"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#2B211B]">

      {/* Hero */}
      <div className="relative h-[320px] sm:h-[400px] overflow-hidden">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={`w-full h-full object-cover ${
            !restaurant.isOpen
              ? "blur-[3px] grayscale brightness-75"
              : ""
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Closed */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black tracking-widest text-white drop-shadow-2xl">
              CLOSED
            </span>
          </div>
        )}

        {/* Restaurant title */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4">

          <div className="flex items-center gap-2 mb-2">

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                restaurant.isOpen
                  ? "bg-green-500 text-white"
                  : "bg-white/20 text-white backdrop-blur-sm"
              }`}
            >
              {restaurant.isOpen ? "● Open" : "● Closed"}
            </span>

            {restaurant.isVerified && (
              <span className="flex items-center gap-1 text-blue-300 text-sm">
                <CheckCircle2 size={16} />
                Verified
              </span>
            )}

          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white drop-shadow-md">
            {restaurant.name}
          </h1>

        </div>

      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main information */}
          <div className="lg:col-span-2">

            <div className="bg-white border border-[#EFE8DD] rounded-2xl shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-6">

              <h2 className="font-serif text-xl font-bold text-[#2B211B] mb-3">
                About Restaurant
              </h2>

              <p className="text-[#5C534C] leading-7">
                {restaurant.description ||
                  "No description available."}
              </p>

            </div>

            {/* Location */}
            <div className="bg-white border border-[#EFE8DD] rounded-2xl shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-6 mt-5">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 ring-1 ring-[#E23744]/10 text-[#E23744] flex items-center justify-center">
                  <MapPin size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#2B211B]">
                    Location
                  </h3>

                  <p className="text-[#8A8078] text-sm mt-1">
                    {restaurant.addLocation?.formattedAddress ||
                      "Address unavailable"}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Side information */}
          <div>

            <div className="bg-white border border-[#EFE8DD] rounded-2xl shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-6">

              <h2 className="font-serif text-lg font-bold text-[#2B211B] mb-5">
                Restaurant Information
              </h2>

              {/* Status */}
              <div className="flex items-center gap-4 pb-5 border-b border-[#EFE8DD]">

                <div className="w-10 h-10 rounded-xl bg-green-50 ring-1 ring-green-200 flex items-center justify-center">
                  <Clock size={19} className="text-green-600" />
                </div>

                <div>
                  <p className="text-xs text-[#B4AA9C]">
                    Status
                  </p>

                  <p
                    className={`text-sm font-semibold mt-1 ${
                      restaurant.isOpen
                        ? "text-green-600"
                        : "text-[#E23744]"
                    }`}
                  >
                    {restaurant.isOpen
                      ? "Currently Open"
                      : "Currently Closed"}
                  </p>
                </div>

              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 py-5">

                <div className="w-10 h-10 rounded-xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
                  <Phone size={19} className="text-blue-500" />
                </div>

                <div>
                  <p className="text-xs text-[#B4AA9C]">
                    Contact
                  </p>

                  <p className="text-sm font-semibold mt-1 text-[#2B211B]">
                    {restaurant.phone}
                  </p>
                </div>

              </div>

              {/* Menu Button */}
              <button
                disabled={!restaurant.isOpen}
                onClick={() =>
                  navigate(`/menu/${restaurant._id}`)
                }
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  restaurant.isOpen
                    ? "bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white shadow-[0_4px_14px_rgba(226,55,68,0.3)]"
                    : "bg-[#F1EFE8] text-[#B4AA9C] cursor-not-allowed"
                }`}
              >
                {restaurant.isOpen
                  ? "View Menu"
                  : "Restaurant Closed"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RestaurantPage