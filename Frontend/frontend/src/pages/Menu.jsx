// pages/Menu.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Search, Flame, Pencil, Trash2, Leaf, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const categories = ["All Items", "Starters", "Mains", "Classics", "Desserts"]
const dietaryFilters = ["All", "Chef Specials", "Gluten-Free", "Vegan", "Organic"]

const Menu = () => {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [activeDiet, setActiveDiet] = useState("All")
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  async function fetchMenu() {
    try {
      const { data } = await axios.get('http://localhost:2000/api/restaurant/my-menu', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setDishes(data.MenuData || [])
    } catch (error) {
      console.log(error)
      setDishes([]) // 👈 fix: 'data' yahan defined nahi tha, crash hoga
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this dish permanently?")) return
    try {
      await axios.delete(`http://localhost:2000/api/restaurant/delete-dish/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      toast.success("Dish deleted")
      await fetchMenu()
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete dish")
    }
  }

  const filteredDishes = dishes.filter(d => {
    const matchesCategory = activeCategory === "All Items" || d.category === activeCategory
    const matchesDiet = activeDiet === "All" || d.tags?.includes(activeDiet)
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesDiet && matchesSearch
  })

  const categoryCount = (cat) =>
    cat === "All Items" ? dishes.length : dishes.filter(d => d.category === cat).length

  if (loading) {
    return <div className='flex min-h-screen items-center justify-center'>Loading menu...</div>
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-24 px-4 pt-4">

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Menu</h1>
            <p className="text-gray-500 text-sm mt-1">Manage offerings, pricing, and live availability</p>
          </div>

          <button
            onClick={() => navigate('/menu/add')}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold whitespace-nowrap"
          >
            <Plus size={18} /> Add Dish
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search dishes, ingredients, or pairings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${activeCategory === cat
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600"}`}
            >
              {cat} ({categoryCount(cat)})
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">Dietary:</p>
          <div className="flex flex-wrap gap-2">
            {dietaryFilters.map(diet => (
              <button
                key={diet}
                onClick={() => setActiveDiet(diet)}
                className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-1
                  ${activeDiet === diet
                    ? "border-orange-600 text-orange-600"
                    : "border-gray-200 text-gray-600"}`}
              >
                {diet === "Vegan" && <Leaf size={14} />} {diet}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dish List */}
      <div className="flex flex-col gap-4 mt-4">
        {filteredDishes.length === 0 && (
          <p className="text-center text-gray-400 mt-6">No dishes found.</p>
        )}
        {filteredDishes.map(dish => (
          <div key={dish._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 relative">
            <div className="relative">
              <img
                src={dish.image}
                alt={dish.name}
                className={`w-24 h-24 object-cover rounded-xl bg-gray-100 ${!dish.isAvailable ? "opacity-50" : ""}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{dish.name}</h3>
                <span className="font-bold text-gray-900">${Number(dish.price).toFixed(2)}</span>
              </div>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{dish.description}</p>

              <div className="flex gap-2 mt-2 flex-wrap items-center">
                {/* 👇 Availability badge */}
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1
                  ${dish.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"}`}
                >
                  {dish.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {dish.isAvailable ? "Available" : "Unavailable"}
                </span>

                {dish.tags?.map(tag => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded-full font-medium
                      ${tag === "Chef Special"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-2">
                {dish.orderedToday > 0 && (
                  <span className="text-orange-500 text-xs flex items-center gap-1">
                    <Flame size={14} /> {dish.orderedToday} ordered today
                  </span>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => navigate(`/menu/edit/${dish._id}`)}
                    className="p-2 bg-gray-100 rounded-full"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(dish._id)}
                    className="p-2 bg-red-100 rounded-full"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu