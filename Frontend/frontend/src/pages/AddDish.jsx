import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = ["Starters", "Mains", "Classics", "Desserts"]
const availableTags = ["Gluten-Free", "Vegan", "Organic", "Chef Special"]

const AddDish = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Starters",
    tags: []
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

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

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!imageFile) {
      toast.error("Please select a dish image")
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("price", form.price)
      formData.append("category", form.category)
      formData.append("tags", JSON.stringify(form.tags))
      formData.append("file", imageFile)

      await axios.post(
        'http://localhost:2000/api/restaurant/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )
      toast.success("Dish added successfully")
      navigate('/menu')
    } catch (error) {
      console.log(error)
      toast.error("Failed to add dish")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-10 px-4 pt-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/menu')}
          className="p-2.5 bg-white rounded-full border border-[#EFE8DD] shadow-sm hover:bg-[#FCEAEA] hover:border-[#E23744]/30 transition text-[#2B211B]"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#2B211B]">Add dish</h1>
          <p className="text-[#8A8078] text-sm">Add a new item to your menu</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Image */}
          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-2 block">Dish image</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-xl ring-1 ring-black/5"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/75 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E7DFD3] bg-[#FFFDF9] rounded-xl h-48 cursor-pointer text-[#B4AA9C] hover:border-[#E23744]/50 hover:bg-[#FCEAEA] hover:text-[#E23744] transition">
                <ImagePlus size={28} />
                <span className="text-sm font-medium">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Dish name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Pan-seared duck breast"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-[#2B211B] mb-1.5 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of the dish..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition resize-none"
            />
          </div>

          {/* Price + Category */}
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
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
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

          {/* Tags */}
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
                      ? "bg-[#E23744] text-white border-[#E23744]"
                      : "border-[#E7DFD3] text-[#5C534C] bg-[#FFFDF9] hover:border-[#E23744]/40"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              className="flex-1 bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.99] text-white rounded-xl py-3 font-semibold disabled:bg-[#D9D2C6] disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {saving ? "Saving..." : "Add dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDish