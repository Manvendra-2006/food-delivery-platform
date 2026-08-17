import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2, Circle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = ["Starters", "Mains", "Classics", "Desserts"]
const availableTags = ["Gluten-Free", "Vegan", "Organic", "Chef Special"]

const EditDish = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function fetchDish() {
    try {
      const { data } = await axios.get(`http://localhost:2000/api/restaurant/single-menu/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const dishData = data.SingleMenuData || {}
      setForm({
        ...dishData,
        tags: dishData.tags || [],
        isAvailable: dishData.isAvailable ?? true 
      })
    } catch (error) {
      console.log(error)
      toast.error("Failed to load dish")
      navigate('/menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDish()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleTag(tag) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  function toggleAvailability() {
    // agar abhi true hai to false bhejo, agar false hai to true bhejo
    setForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(
        `http://localhost:2000/api/restaurant/single-dish-update/${id}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      toast.success("Dish updated")
      navigate('/menu')
    } catch (error) {
      console.log(error)
      toast.error("Failed to update dish")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this dish permanently?")) return
    try {
      await axios.delete(`http://localhost:2000/api/restaurant/single-dish-delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      toast.success("Dish deleted")
      navigate('/menu')
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete dish")
    }
  }

  if (loading || !form) {
    return <div className='flex min-h-screen items-center justify-center'>Loading dish...</div>
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-10 px-4 pt-4">

    
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/menu')}
            className="p-2 bg-white rounded-full shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Dish</h1>
            <p className="text-gray-500 text-sm">Update dish details</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-100 rounded-full"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-gray-800">Dish Availability</p>
              <p className="text-sm text-gray-500">
                {form.isAvailable ? "Currently available to order" : "Currently unavailable"}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm
                ${form.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"}`}
            >
              {form.isAvailable ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {form.isAvailable ? "Available" : "Unavailable"}
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-500">Dish Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-500">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 mt-1"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm border
                    ${form.tags.includes(tag)
                      ? "bg-orange-600 text-white border-orange-600"
                      : "border-gray-300 text-gray-600"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-3 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-orange-600 text-white rounded-xl py-3 font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDish