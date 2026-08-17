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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add Your Restaurant</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Restaurant Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            placeholder="Enter restaurant name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            placeholder="Describe your restaurant (cuisine, specialties, etc.)"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                            placeholder="Enter contact number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

               
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Restaurant Image *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg mb-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full"
                                        required
                                    />
                                    <p className="text-gray-500 text-sm mt-2">Click to upload or drag and drop</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>                    
{Location ? (
    <div className="mt-3 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-700">
            <strong>Address:</strong> {Location.formattedAddress}
        </p>

        <p className="text-sm text-gray-600">
            Lat: {Location.latitude.toFixed(4)}, Long: {Location.longitude.toFixed(4)}
        </p>
    </div>
) : (
    <p className="mt-3 text-sm text-gray-500 text-center">
        Fetching location...
    </p>
)}
                    </div>

                    
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:bg-gray-400 transition"
                    >
                        {submitting ? "Adding Restaurant..." : "Add Restaurant"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddRestaurant