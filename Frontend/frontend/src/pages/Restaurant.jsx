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
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#8A8078]'>
        Loading restaurant...
      </div>
    )
  }
  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-24">


      <div className="flex items-center gap-2 px-5 py-4 bg-white border-b border-[#EFE8DD] shadow-sm">
        <BadgeCheck className="text-[#E23744]" size={24} />
        <h1 className="font-serif text-xl font-bold text-[#E23744]">{restaurant.name}</h1>
      </div>

     
      <div className="px-4 pt-4">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-56 md:h-64 object-cover rounded-2xl ring-1 ring-[#EFE8DD] shadow-[0_4px_24px_rgba(43,33,27,0.08)]"
          loading="lazy"
        />
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2B211B]">{restaurant.name}</h2>
            <p className="text-[#8A8078] mt-1">{restaurant.description?.slice(0, 40) || "Restaurant"}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
              ${restaurant.isOpen ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-[#FCEAEA] text-[#E23744] ring-1 ring-[#E23744]/20"}`}>
              <BadgeCheck size={14} />
              {restaurant.isOpen ? "OPEN NOW" : "CLOSED"}
            </span>
          </div>
        </div>

        <hr className="my-4 border-[#EFE8DD]" />

        <div>
          <h3 className="font-serif font-bold text-lg text-[#2B211B] mb-2">About</h3>
          <p className="text-[#5C534C] leading-relaxed">{restaurant.description}</p>
        </div>
      </div>

   
      <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
          <div className="flex items-center justify-between text-[#2B211B] font-semibold">
            Today's Orders <ClipboardList className="text-[#E23744]" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2 text-[#2B211B]">142</p>
          <p className="text-[#E23744] text-sm flex items-center gap-1 mt-1">
            <TrendingUp size={14} /> +12% vs yesterday
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
          <div className="flex items-center justify-between text-[#2B211B] font-semibold">
            Revenue <Wallet className="text-[#E23744]" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2 text-[#2B211B]">$4.2k</p>
          <p className="text-[#E23744] text-sm flex items-center gap-1 mt-1">
            <TrendingUp size={14} /> +8% vs yesterday
          </p>
        </div>
      </div>

    
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <h3 className="font-serif font-bold text-lg text-[#2B211B] mb-4">Contact Info</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 ring-1 ring-[#E23744]/10 p-2 rounded-full"><Phone className="text-[#E23744]" size={18} /></div>
          <div>
            <p className="text-xs text-[#B4AA9C]">PHONE</p>
            <p className="font-medium text-[#2B211B]">{restaurant.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 ring-1 ring-[#E23744]/10 p-2 rounded-full"><Mail className="text-[#E23744]" size={18} /></div>
          <div>
            <p className="text-xs text-[#B4AA9C]">EMAIL</p>
            <p className="font-medium text-[#2B211B]">{restaurant.email || "N/A"}</p>
          </div>
        </div>
      </div>

    
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <h3 className="font-serif font-bold text-lg text-[#2B211B] mb-4">Location</h3>
        <div className="flex items-start gap-3">
          <MapPin className="text-[#E23744] mt-1" size={20} />
          <p className="text-[#5C534C]">{restaurant.addLocation?.formattedAddress}</p>
        </div>
   
        <div className="mt-4 h-40 bg-[#FFFDF9] border border-[#EFE8DD] rounded-xl flex items-center justify-center text-[#B4AA9C] text-sm">
          Map preview (lat: {restaurant.addLocation?.coordinates?.[1]}, lng: {restaurant.addLocation?.coordinates?.[0]})
        </div>
      </div>

      <div className="flex gap-3 mx-4 mt-5">
        <button
          onClick={() => setShowEdit(true)}
          className="flex-1 bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold shadow-[0_4px_14px_rgba(226,55,68,0.3)] transition-all"
        >
          <Pencil size={18} /> Edit
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="flex-1 border border-[#E23744] text-[#E23744] hover:bg-[#FCEAEA] rounded-xl py-3 flex items-center justify-center gap-2 font-semibold transition"
        >
          <UtensilsCrossed size={18} /> Menu
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EFE8DD] shadow-[0_-4px_20px_rgba(43,33,27,0.06)] flex justify-around py-3">
        <div className="flex flex-col items-center text-[#E23744]">
          <div className="bg-[#E23744] text-white p-2 rounded-full shadow-[0_4px_14px_rgba(226,55,68,0.3)]"><LayoutGrid size={18} /></div>
          <span className="text-xs mt-1 font-semibold">Overview</span>
        </div>
        <button onClick={() => navigate('/menu')} className="flex flex-col items-center text-[#8A8078] hover:text-[#E23744] transition">
          <UtensilsCrossed size={20} />
          <span className="text-xs mt-1">Menu</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center text-[#8A8078] hover:text-[#E23744] transition">
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>

      
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