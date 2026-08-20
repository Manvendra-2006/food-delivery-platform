import React, { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

const EditRestaurant = ({ fetchMyRestaurant, restaurant, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description,
    phone: restaurant.phone,
    formattedAddress: restaurant.addLocation?.formattedAddress,
    isOpen: restaurant.isOpen
  })
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.put(
        'http://localhost:2000/api/restaurant/update',
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      onUpdated(data.restaurantData)
      fetchMyRestaurant()
      onClose()
    } catch (error) {
      console.log(error)
      alert("Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
      <div className="bg-[#FFFBF5] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-[#EFE8DD] shadow-[0_8px_40px_rgba(43,33,27,0.15)]">

      
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2B211B]">Edit restaurant</h2>
            <p className="text-xs text-[#8A8078] mt-0.5">Update your restaurant details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8A8078] hover:bg-[#EFE8DD] hover:text-[#2B211B] transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#2B211B] mb-1.5">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-white text-[#2B211B] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2B211B] mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-white text-[#2B211B] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2B211B] mb-1.5">Phone</label>
            <input
              name="phone"
              type="number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-white text-[#2B211B] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2B211B] mb-1.5">Address</label>
            <input
              name="formattedAddress"
              value={form.formattedAddress}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-white text-[#2B211B] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition"
            />
          </div>

          <label
            htmlFor="isOpen"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E7DFD3] cursor-pointer hover:border-[#C1432B]/40 transition"
          >
            <input
              type="checkbox"
              name="isOpen"
              checked={form.isOpen}
              onChange={handleChange}
              id="isOpen"
              className="w-4 h-4 accent-[#C1432B] cursor-pointer"
            />
            <span className="text-sm text-[#2B211B]">Restaurant is currently open</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#C1432B] hover:bg-[#A6351F] active:scale-[0.99] text-white rounded-xl py-3.5 font-semibold text-sm tracking-wide mt-1 disabled:bg-[#D9D2C6] disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRestaurant