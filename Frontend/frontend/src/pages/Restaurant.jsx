// pages/Restaurant.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddRestaurant from '../components/AddRestaurant'
import EditRestaurant from '../components/EditRestaurant'

import {
  BadgeCheck, Pencil, UtensilsCrossed, Phone, Mail,
  MapPin, ClipboardList, Wallet, TrendingUp, LayoutGrid, Settings
} from 'lucide-react'

const Restaurant = () => {
  const [restaurant, setrestaurant] = useState(null)
  const [loading, setloading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const navigate = useNavigate()

  async function fetchMyRestaurant() {
    try {
      const { data } = await axios.get('http://localhost:2000/api/restaurant/my-restaurant', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setrestaurant(data.restaurantData || null)
    } catch (error) {
      console.log(error)
      setrestaurant(null)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchMyRestaurant()
  }, [])

  if (loading) {
    return <div className='flex min-h-screen items-center justify-center'>Loading restaurant...</div>
  }
  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-24">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 bg-white border-b">
        <BadgeCheck className="text-orange-600" size={24} />
        <h1 className="text-xl font-bold text-orange-600">{restaurant.name}</h1>
      </div>

      {/* Hero Image */}
      <div className="px-4 pt-4">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-56 md:h-64 object-cover rounded-2xl"
          loading="lazy"
        />
      </div>

      {/* Info Card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
            <p className="text-gray-500 mt-1">{restaurant.description?.slice(0, 40) || "Restaurant"}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
              ${restaurant.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              <BadgeCheck size={14} />
              {restaurant.isOpen ? "OPEN NOW" : "CLOSED"}
            </span>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="font-bold text-lg mb-2">About</h3>
          <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between text-gray-800 font-semibold">
            Today's Orders <ClipboardList className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2">142</p>
          <p className="text-orange-500 text-sm flex items-center gap-1 mt-1">
            <TrendingUp size={14} /> +12% vs yesterday
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between text-gray-800 font-semibold">
            Revenue <Wallet className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2">$4.2k</p>
          <p className="text-orange-500 text-sm flex items-center gap-1 mt-1">
            <TrendingUp size={14} /> +8% vs yesterday
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-lg mb-4">Contact Info</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-100 p-2 rounded-full"><Phone className="text-orange-600" size={18} /></div>
          <div>
            <p className="text-xs text-gray-400">PHONE</p>
            <p className="font-medium">{restaurant.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full"><Mail className="text-orange-600" size={18} /></div>
          <div>
            <p className="text-xs text-gray-400">EMAIL</p>
            <p className="font-medium">{restaurant.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-lg mb-4">Location</h3>
        <div className="flex items-start gap-3">
          <MapPin className="text-orange-600 mt-1" size={20} />
          <p className="text-gray-700">{restaurant.addLocation?.formattedAddress}</p>
        </div>
        {/* Optional: embed real map using coordinates */}
        <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Map preview (lat: {restaurant.addLocation?.coordinates?.[1]}, lng: {restaurant.addLocation?.coordinates?.[0]})
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mx-4 mt-5">
        <button
          onClick={() => setShowEdit(true)}
          className="flex-1 bg-orange-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <Pencil size={18} /> Edit
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="flex-1 border border-orange-600 text-orange-600 rounded-xl py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <UtensilsCrossed size={18} /> Menu
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <div className="flex flex-col items-center text-orange-600">
          <div className="bg-orange-600 text-white p-2 rounded-full"><LayoutGrid size={18} /></div>
          <span className="text-xs mt-1 font-semibold">Overview</span>
        </div>
        <button onClick={() => navigate('/menu')} className="flex flex-col items-center text-gray-500">
          <UtensilsCrossed size={20} />
          <span className="text-xs mt-1">Menu</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center text-gray-500">
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <EditRestaurant
        fetchMyRestaurant={fetchMyRestaurant}
          restaurant={restaurant}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => setrestaurant(updated)}
        />
      )}
    </div>
  )
}

export default Restaurant