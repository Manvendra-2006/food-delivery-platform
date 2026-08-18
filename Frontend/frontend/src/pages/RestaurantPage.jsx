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
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400">
            Loading restaurant...
          </p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          Restaurant not found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 px-5 py-2.5 bg-orange-500 rounded-xl font-semibold"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">

      {/* Hero */}
      <div className="relative h-[320px] sm:h-[400px] overflow-hidden">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={`w-full h-full object-cover ${
            !restaurant.isOpen
              ? "blur-[3px] grayscale brightness-50"
              : ""
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/30 to-black/20" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition"
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
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                restaurant.isOpen
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {restaurant.isOpen ? "● Open" : "● Closed"}
            </span>

            {restaurant.isVerified && (
              <span className="flex items-center gap-1 text-blue-400 text-sm">
                <CheckCircle2 size={16} />
                Verified
              </span>
            )}

          </div>

          <h1 className="text-3xl sm:text-5xl font-bold">
            {restaurant.name}
          </h1>

        </div>

      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main information */}
          <div className="lg:col-span-2">

            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-3">
                About Restaurant
              </h2>

              <p className="text-gray-400 leading-7">
                {restaurant.description ||
                  "No description available."}
              </p>

            </div>

            {/* Location */}
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 mt-5">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <MapPin size={21} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Location
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {restaurant.addLocation?.formattedAddress ||
                      "Address unavailable"}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Side information */}
          <div>

            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">

              <h2 className="text-lg font-bold mb-5">
                Restaurant Information
              </h2>

              {/* Status */}
              <div className="flex items-center gap-4 pb-5 border-b border-gray-800">

                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Clock size={19} className="text-green-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p
                    className={`text-sm font-semibold mt-1 ${
                      restaurant.isOpen
                        ? "text-green-500"
                        : "text-red-500"
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

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Phone size={19} className="text-blue-400" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Contact
                  </p>

                  <p className="text-sm font-semibold mt-1">
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
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  restaurant.isOpen
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
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