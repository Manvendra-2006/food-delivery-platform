import React from 'react'
import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddRestaurant = ({fetchMyRestaurant}) => {
    const [name, setname] = useState("")
    const [description, setdescription] = useState("")
    const [phone, setphone] = useState("")
    const [image, setimage] = useState(null)
    const [imagePreview, setimagePreview] = useState(null)
    const [submitting, setsubmitting] = useState(false)
    const { Location, setLocation, LoadingLocation, setLoadingLocation } = useContext(AppContext)
    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setimage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setimagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!name || !description || !phone || !image || !Location) {
            toast.error("All fields are required")
            return
        }

        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("latitude", Location.latitude)
        formData.append("longitude", Location.longitude)
        formData.append("formattedAddress", Location.formattedAddress)
        formData.append("phone", phone)
        formData.append("file", image)

        try {
            setsubmitting(true)
            const response = await axios.post('http://localhost:2000/api/restaurant/created', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            toast.success("Restaurant added successfully")
            fetchMyRestaurant()
            setname("")
            setdescription("")
            setphone("")
            setimage(null)
            setimagePreview(null)
            setLocation(null)
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Error adding restaurant")
        }
        finally {
            setsubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C1432B]/10 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#C1432B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18M3 8h4M3 13h4M15 3v18M15 3a4 4 0 014 4v4a4 4 0 01-4 4" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2B211B] tracking-tight">
                        Add your restaurant
                    </h1>
                    <p className="text-[#8A8078] text-sm mt-2">
                        Tell us about your place so customers can find you
                    </p>
                </div>

           
                <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)] p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-7">

                      
                        <div>
                            <label className="block text-sm font-semibold text-[#2B211B] mb-2">
                                Restaurant name <span className="text-[#C1432B]">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                placeholder="e.g. Spice Route Kitchen"
                                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition"
                                required
                            />
                        </div>

                     
                        <div>
                            <label className="block text-sm font-semibold text-[#2B211B] mb-2">
                                Description <span className="text-[#C1432B]">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                placeholder="Cuisine, specialties, what makes your place special..."
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition resize-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#2B211B] mb-2">
                                Phone number <span className="text-[#C1432B]">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setphone(e.target.value)}
                                placeholder="Enter contact number"
                                className="w-full px-4 py-3 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#C1432B]/30 focus:border-[#C1432B] transition"
                                required
                            />
                        </div>

                      
                        <div>
                            <label className="block text-sm font-semibold text-[#2B211B] mb-2">
                                Restaurant image <span className="text-[#C1432B]">*</span>
                            </label>

                            {imagePreview ? (
                                <div className="flex flex-col items-center gap-4 p-5 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9]">
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="h-36 w-36 object-cover rounded-xl ring-1 ring-black/5" />
                                        <span className="absolute -top-2 -right-2 bg-[#C1432B] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                                            Ready
                                        </span>
                                    </div>
                                    <label className="text-sm font-medium text-[#C1432B] cursor-pointer hover:underline">
                                        Change image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="group flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-[#E7DFD3] bg-[#FFFDF9] hover:border-[#C1432B]/50 hover:bg-[#C1432B]/5 transition cursor-pointer">
                                    <div className="w-11 h-11 rounded-full bg-[#C1432B]/10 flex items-center justify-center group-hover:bg-[#C1432B]/15 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#C1432B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5.5 5.5 0 0116.9 6.1 4.5 4.5 0 0118 15h-1M12 12v9m0-9l-3 3m3-3l3 3" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-[#2B211B]">Click to upload a photo</p>
                                        <p className="text-xs text-[#B4AA9C] mt-0.5">PNG or JPG, clear front shot works best</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required
                                    />
                                </label>
                            )}
                        </div>

                      
                        <div>
                            <label className="block text-sm font-semibold text-[#2B211B] mb-2">
                                Location <span className="text-[#C1432B]">*</span>
                            </label>

                            {Location ? (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F0F7EE] border border-[#DCEBD6]">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8B3A] shrink-0" />
                                    <div>
                                        <p className="text-sm text-[#2B211B]">
                                            <span className="font-semibold">Address:</span> {Location.formattedAddress}
                                        </p>
                                        <p className="text-xs text-[#6B8A62] mt-1">
                                            Lat: {Location.latitude.toFixed(4)}, Long: {Location.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFFDF9] border border-[#E7DFD3]">
                                    <span className="w-2 h-2 rounded-full bg-[#C1432B] animate-pulse shrink-0" />
                                    <p className="text-sm text-[#8A8078]">Fetching location...</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl bg-[#C1432B] hover:bg-[#A6351F] active:scale-[0.99] text-white font-semibold text-sm tracking-wide disabled:bg-[#D9D2C6] disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {submitting ? "Adding restaurant..." : "Add restaurant"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddRestaurant