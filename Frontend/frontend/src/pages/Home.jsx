import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
const Home = () => {
  const { Location } = useContext(AppContext)
  const [searchParams] = useSearchParams()

  const search = searchParams.get("search") || ""
const navigate = useNavigate()
  const [restaurant, setrestaurant] = useState([])
  const [loading, setloading] = useState(true)

  async function fetchRestaurant() {
    if (!Location?.latitude || !Location?.longitude) {
      return
    }

    setloading(true)

    try {
      const { data } = await axios.get(
        "http://localhost:2000/api/restaurant/restaurant-near",
        {
          params: {
            latitude: Location.latitude,
            longitude: Location.longitude,
            search
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      setrestaurant(data.restaurants)

    } catch (error) {
      console.log(error)
      setrestaurant([])
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchRestaurant()
  }, [Location, search])

  if (loading || !Location) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">
            Finding restaurants near you...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 sm:px-6 lg:px-10 py-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">

        <p className="text-sm text-gray-500 mb-2">
          Restaurants near you
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {search
                ? `Results for "${search}"`
                : "Discover great food"}
            </h1>

            <p className="text-gray-400 mt-2">
              Find the best restaurants around your location
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {restaurant.length} restaurants found
          </div>
        </div>
      </div>

      {/* No restaurant */}
      {restaurant.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="border border-gray-800 rounded-2xl py-20 text-center bg-[#111111]">
            <div className="text-5xl mb-4">
              🍽️
            </div>

            <h2 className="text-xl font-semibold">
              No restaurants found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching for something else.
            </p>
          </div>
        </div>
      ) : (

        /* Restaurant Grid */
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{restaurant.map((item) => (
 <div
    key={item._id}
    onClick={() => navigate(`/restaurant/${item._id}`)}
    className="group bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
  >
    {/* Image */}
    <div className="relative h-52 overflow-hidden">

      <img
        src={item.image}
        alt={item.name}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          !item.isOpen
            ? "blur-[3px] grayscale brightness-50"
            : "group-hover:scale-105"
        }`}
      />

      {/* Closed Overlay */}
      {!item.isOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-widest text-white drop-shadow-2xl">
            CLOSED
          </span>
        </div>
      )}

      {/* Open Status */}
      {item.isOpen && (
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/90 text-white">
            ● Open
          </span>
        </div>
      )}

      {/* Distance */}
      <div className="absolute bottom-3 right-3">
        <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-xs font-medium text-white">
          📍 {item.distanceKm} km
        </span>
      </div>

    </div>

    {/* Content */}
    <div
      className={`p-5 ${
        !item.isOpen ? "opacity-60" : ""
      }`}
    >

      <div className="flex items-start justify-between gap-3">

        <h2 className="text-lg font-semibold line-clamp-1 text-white">
          {item.name}
        </h2>

        {item.isVerified && (
          <span className="text-blue-400 text-sm">
            ✓
          </span>
        )}

      </div>

      <p className="text-sm text-gray-500 mt-2 line-clamp-1">
        {item.addLocation?.formattedAddress ||
          "Location unavailable"}
      </p>

      <p className="text-sm text-gray-400 mt-3 line-clamp-2 leading-5">
        {item.description}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-800">

        <div>
          <p className="text-xs text-gray-500">
            Distance
          </p>

          <p className="text-sm font-medium mt-1 text-gray-300">
            {item.distanceKm} km away
          </p>
        </div>

        <button
          type="button"
          disabled={!item.isOpen}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/menu/${item._id}`)
          }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            item.isOpen
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
        >
          {item.isOpen ? "View Menu" : "Closed"}
        </button>

      </div>

    </div>
  </div>
))}
        </div>
      )}

    </div>
  )
}

export default Home