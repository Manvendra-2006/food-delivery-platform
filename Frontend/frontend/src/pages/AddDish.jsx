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
    <div className="min-h-screen bg-[#f7f4ef] pb-10 px-4 pt-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/menu')}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add Dish</h1>
          <p className="text-gray-500 text-sm">Add a new item to your menu</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Image Upload */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Dish Image</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl h-48 cursor-pointer text-gray-400 hover:border-orange-400 hover:text-orange-500 transition">
                <ImagePlus size={28} />
                <span className="text-sm">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">Dish Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Pan-Seared Duck Breast"
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
              placeholder="Short description of the dish..."
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
                placeholder="0.00"
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
              {saving ? "Saving..." : "Add Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDish