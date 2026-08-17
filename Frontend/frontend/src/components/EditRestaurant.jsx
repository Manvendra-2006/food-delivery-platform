// components/EditRestaurant.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

const EditRestaurant = ({ fetchMyRestaurant,restaurant, onClose, onUpdated }) => {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Restaurant</h2>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <input
              name="phone"
              type="number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Address</label>
            <input
              name="formattedAddress"
              value={form.formattedAddress}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isOpen"
              checked={form.isOpen}
              onChange={handleChange}
              id="isOpen"
            />
            <label htmlFor="isOpen" className="text-sm text-gray-700">Restaurant is currently open</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 text-white rounded-xl py-3 font-semibold mt-2 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRestaurant