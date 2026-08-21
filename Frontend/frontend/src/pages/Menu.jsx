// pages/Menu.jsx
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {Plus,Search,Flame,Pencil,Trash2,Leaf,CheckCircle2,XCircle,ShoppingCart} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AppContext } from '../context/AppContext'

const categories = ["All Items", "Starters", "Mains", "Classics", "Desserts"]
const dietaryFilters = ["All", "Chef Specials", "Gluten-Free", "Vegan", "Organic"]

const Menu = () => {
  const { user, fetchCart, addToCart, quantity, clearCart } = useContext(AppContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const userRole = user?.role?.toString().trim().toLowerCase()
  const isSeller = userRole === 'seller'

  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [activeDiet, setActiveDiet] = useState("All")
  const [search, setSearch] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [addingToCart, setAddingToCart] = useState({})
  const [showClearCartDialog, setShowClearCartDialog] = useState(false)
  const [pendingDishToAdd, setPendingDishToAdd] = useState(null)
  async function fetchMenu() {
    try {
      setLoading(true)

      let response
      if (isSeller) {
        response = await axios.get('http://localhost:2000/api/restaurant/my-menu', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      } else if (id) {
        response = await axios.get(`http://localhost:2000/api/restaurant/restaurant-menu/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      } else {
        setDishes([])
        return
      }

      const menuData = response?.data?.MenuData || response?.data?.menuData || []
      setDishes(menuData)
      setRestaurantName(response?.data?.restaurantName || 'Restaurant Menu')
    } catch (error) {
      console.log(error)
      setDishes([])
      setRestaurantName('Restaurant Menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [isSeller, id])

  async function handleAddToCart(dish) {
    try {
      setAddingToCart({ ...addingToCart, [dish._id]: true })
      const result = await addToCart(id, dish._id, 1, dish.name)
      
      if (result.success) {
        toast.success(`${dish.name} added to cart`)
      } else {
        // Check if error is due to different restaurant
        const errorMessage = result.error?.response?.data?.message || ""
        if (errorMessage.includes("only one restaurant")) {
          setPendingDishToAdd(dish)
          setShowClearCartDialog(true)
        } else {
          toast.error(errorMessage || "Failed to add item to cart")
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Error adding to cart")
    } finally {
      setAddingToCart({ ...addingToCart, [dish._id]: false })
    }
  }

  async function handleClearCartAndAdd() {
    try {
      setShowClearCartDialog(false)
      toast.loading("Clearing cart...")
      const clearResult = await clearCart()
      
      if (clearResult.success) {
        toast.dismiss()
        toast.success("Cart cleared")
        
    
        if (pendingDishToAdd) {
          setAddingToCart({ ...addingToCart, [pendingDishToAdd._id]: true })
          const addResult = await addToCart(id, pendingDishToAdd._id, 1, pendingDishToAdd.name)
          
          if (addResult.success) {
            toast.success(`${pendingDishToAdd.name} added to cart`)
          } else {
            toast.error("Failed to add item after clearing cart")
          }
          
          setAddingToCart({ ...addingToCart, [pendingDishToAdd._id]: false })
          setPendingDishToAdd(null)
        }
      } else {
        toast.error("Failed to clear cart")
      }
    } catch (error) {
      console.log(error)
      toast.error("Error clearing cart")
    }
  }

  const filteredDishes = dishes.filter((d) => {
    const matchesCategory = activeCategory === "All Items" || d.category === activeCategory
    const matchesDiet = activeDiet === "All" || d.tags?.includes(activeDiet)
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesDiet && matchesSearch
  })

  const categoryCount = (cat) =>
    cat === "All Items" ? dishes.length : dishes.filter((d) => d.category === cat).length

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#8A8078]'>
        Loading menu...
      </div>
    )
  }

  // Clear Cart Dialog
  const ClearCartDialog = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_8px_40px_rgba(43,33,27,0.2)] border border-[#EFE8DD]">
          <h2 className="font-serif text-lg font-bold text-[#2B211B] mb-2">Switch Restaurant?</h2>
          <p className="text-[#8A8078] mb-6">
            You can order from only one restaurant at a time. Please clear your cart first to add items from this restaurant.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowClearCartDialog(false)
                setPendingDishToAdd(null)
              }}
              className="flex-1 px-4 py-2 border border-[#E7DFD3] text-[#2B211B] rounded-xl font-medium hover:bg-[#FFFDF9] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleClearCartAndAdd}
              className="flex-1 px-4 py-2 bg-[#E23744] text-white rounded-xl font-medium hover:bg-[#C42A36] active:scale-[0.99] shadow-[0_4px_14px_rgba(226,55,68,0.3)] transition-all"
            >
              Clear & Add
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 text-[#8A8078]'>
        Loading menu...
      </div>
    )
  }

  if (!isSeller) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-20 px-4 pt-4">
        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#E23744] font-semibold">Menu</p>
              <h1 className="font-serif text-2xl font-bold text-[#2B211B]">{restaurantName || 'Restaurant Menu'}</h1>
            </div>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="relative p-3 rounded-full bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 text-[#E23744] ring-1 ring-[#E23744]/10 hover:bg-[#FCEAEA] transition"
            >
              <ShoppingCart size={22} />
              {quantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E23744] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {quantity}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5 mt-4">
          <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#E7DFD3] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#E23744]/30 focus-within:border-[#E23744] transition">
            <Search size={18} className="text-[#B4AA9C]" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or pairings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-[#2B211B] placeholder:text-[#B4AA9C]"
            />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat ? "bg-[#E23744] text-white shadow-sm" : "bg-[#FFFDF9] border border-[#E7DFD3] text-[#5C534C] hover:border-[#E23744]/30"
                }`}
              >
                {cat} ({categoryCount(cat)})
              </button>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs text-[#B4AA9C] mb-2">Dietary:</p>
            <div className="flex flex-wrap gap-2">
              {dietaryFilters.map((diet) => (
                <button
                  key={diet}
                  onClick={() => setActiveDiet(diet)}
                  className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-1 transition ${
                    activeDiet === diet ? "border-[#E23744] text-[#E23744] bg-[#FCEAEA]" : "border-[#E7DFD3] text-[#5C534C] bg-[#FFFDF9]"
                  }`}
                >
                  {diet === "Vegan" && <Leaf size={14} />} {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {filteredDishes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-8 text-center text-[#8A8078]">
              No dishes available right now.
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div key={dish._id} className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] hover:shadow-[0_4px_24px_rgba(43,33,27,0.1)] hover:border-[#E23744]/20 transition-all p-4 flex gap-4">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-24 h-24 object-cover rounded-xl bg-[#F1EFE8] ring-1 ring-[#EFE8DD]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#2B211B]">{dish.name}</h3>
                      <p className="text-sm text-[#8A8078] mt-1">{dish.category}</p>
                    </div>
                    <span className="font-bold text-[#E23744]">₹{Number(dish.price).toFixed(2)}</span>
                  </div>

                  <p className="text-sm text-[#8A8078] mt-2 line-clamp-2">{dish.description}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {dish.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-[#F1EFE8] text-[#5C534C]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(dish)}
                      disabled={addingToCart[dish._id]}
                      className="flex items-center gap-2 bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.98] text-white px-3 py-2 rounded-xl font-medium disabled:opacity-50 shadow-[0_4px_14px_rgba(226,55,68,0.3)] transition-all"
                    >
                      <Plus size={16} /> {addingToCart[dish._id] ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
        {showClearCartDialog && <ClearCartDialog />}
      </>
    )
  }


  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/30 pb-24 px-4 pt-4">
      <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2B211B]">Restaurant Menu</h1>
            <p className="text-[#8A8078] text-sm mt-1">Manage offerings, pricing, and live availability</p>
          </div>

          <button
            onClick={() => navigate('/menu/add')}
            className="bg-[#E23744] hover:bg-[#C42A36] active:scale-[0.98] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold whitespace-nowrap shadow-[0_4px_14px_rgba(226,55,68,0.3)] transition-all"
          >
            <Plus size={18} /> Add Dish
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#E7DFD3] rounded-xl px-4 py-3 mt-4 focus-within:ring-2 focus-within:ring-[#E23744]/30 focus-within:border-[#E23744] transition">
          <Search size={18} className="text-[#B4AA9C]" />
          <input
            type="text"
            placeholder="Search dishes, ingredients, or pairings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-[#2B211B] placeholder:text-[#B4AA9C]"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                ${activeCategory === cat
                  ? "bg-[#E23744] text-white shadow-sm"
                  : "bg-[#FFFDF9] border border-[#E7DFD3] text-[#5C534C] hover:border-[#E23744]/30"}`}
            >
              {cat} ({categoryCount(cat)})
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-xs text-[#B4AA9C] mb-2">Dietary:</p>
          <div className="flex flex-wrap gap-2">
            {dietaryFilters.map((diet) => (
              <button
                key={diet}
                onClick={() => setActiveDiet(diet)}
                className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-1 transition
                  ${activeDiet === diet
                    ? "border-[#E23744] text-[#E23744] bg-[#FCEAEA]"
                    : "border-[#E7DFD3] text-[#5C534C] bg-[#FFFDF9]"}`}
              >
                {diet === "Vegan" && <Leaf size={14} />} {diet}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {filteredDishes.length === 0 && (
          <p className="text-center text-[#B4AA9C] mt-6">No dishes found.</p>
        )}
        {filteredDishes.map((dish) => (
          <div key={dish._id} className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] hover:shadow-[0_4px_24px_rgba(43,33,27,0.1)] transition-all p-4 flex gap-4 relative">
            <div className="relative">
              <img
                src={dish.image}
                alt={dish.name}
                className={`w-24 h-24 object-cover rounded-xl bg-[#F1EFE8] ring-1 ring-[#EFE8DD] ${!dish.isAvailable ? "opacity-50" : ""}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[#2B211B]">{dish.name}</h3>
                <span className="font-bold text-[#E23744]">₹{Number(dish.price).toFixed(2)}</span>
              </div>
              <p className="text-[#8A8078] text-sm mt-1 line-clamp-2">{dish.description}</p>

              <div className="flex gap-2 mt-2 flex-wrap items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1
                  ${dish.isAvailable
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-[#FCEAEA] text-[#E23744] ring-1 ring-[#E23744]/20"}`}
                >
                  {dish.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {dish.isAvailable ? "Available" : "Unavailable"}
                </span>

                {dish.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded-full font-medium
                      ${tag === "Chef Special"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-[#F1EFE8] text-[#5C534C]"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-2">
                {dish.orderedToday > 0 && (
                  <span className="text-[#E23744] text-xs flex items-center gap-1">
                    <Flame size={14} /> {dish.orderedToday} ordered today
                  </span>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => navigate(`/menu/edit/${dish._id}`)}
                    className="p-2 bg-[#FFFDF9] border border-[#E7DFD3] rounded-full hover:bg-[#FCEAEA] hover:border-[#E23744]/30 transition"
                  >
                    <Pencil size={14} className="text-[#2B211B]" />
                  </button>
                  <button
                    onClick={() => handleDelete(dish._id)}
                    className="p-2 bg-[#FCEAEA] rounded-full hover:bg-[#E23744]/15 transition"
                  >
                    <Trash2 size={14} className="text-[#E23744]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {showClearCartDialog && <ClearCartDialog />}
    </>
  )
}

export default Menu