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
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#8A8078]'>
        Loading dish...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-10 px-4 pt-4">

    
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/menu')}
            className="p-2.5 bg-white rounded-full border border-[#EFE8DD] shadow-sm hover:bg-[#FCEAEA] hover:border-[#E23744]/30 transition text-[#2B211B]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#2B211B]">Edit Dish</h1>
            <p className="text-[#8A8078] text-sm">Update dish details</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2.5 bg-[#FCEAEA] hover:bg-[#E23744]/15 rounded-full border border-[#E23744]/10 transition"
        >
          <Trash2 size={18} className="text-[#E23744]" />
        </button>
      </div>

      
      <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          
          <div className="flex items-center justify-between bg-[#FFFDF9] border border-[#EFE8DD] rounded-xl px-4 py-3.5">
            <div>
              <p className="font-semibold text-[#2B211B]">Dish Availability</p>
              <p className="text-sm text-[#8A8078]">
                {form.isAvailable ? "Currently available to order" : "Currently unavailable"}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition shadow-sm
                ${form.isAvailable
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-[#FCEAEA] text-[#E23744] ring-1 ring-[#E23744]/20"}`}
            >
              {form.isAvailable ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {form.isAvailable ? "Available" : "Unavailable"}
            </button>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Dish Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition resize-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
            />
          </div>

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-44 object-cover rounded-xl ring-1 ring-[#EFE8DD] shadow-sm"
            />
          )}

          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition
                    ${form.tags.includes(tag)
                      ? "bg-[#E23744] text-white border-[#E23744] shadow-sm"
                      : "border-[#E7DFD3] text-[#5C534C] bg-[#FFFDF9] hover:border-[#E23744]/40"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="flex-1 border border-[#E7DFD3] text-[#5C534C] rounded-xl py-3 font-semibold hover:bg-[#FFFDF9] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white rounded-xl py-3 font-semibold disabled:bg-[#D9D2C6] disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(226,55,68,0.3)]"
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