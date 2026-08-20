import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Link, useLocation, useSearchParams } from 'react-router'
import { CgShoppingCart } from "react-icons/cg";
import { BiMapPin, BiSearch } from "react-icons/bi";

const Navbar = () => {
    const { isAuth, city, LoadingLocation, quantity } = useContext(AppContext)
    const currentLocation = useLocation()
    const isHomePage = currentLocation.pathname === "/"
    const [searchParams, setsearchParams] = useSearchParams()
    const [search, setsearch] = useState(searchParams.get("search") || "")

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                setsearchParams({ search })
            } else {
                setsearchParams({})
            }
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    return (
        <div className='w-full bg-white/95 backdrop-blur-sm border-b border-[#F1E4E2] sticky top-0 z-40'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5'>
                <Link to={"/"} className='font-serif text-2xl font-bold text-[#E23744] tracking-tight cursor-pointer'>
                    Tomato
                </Link>

                <div className='flex items-center gap-5'>
                    <Link to={'/cart'} className='relative group'>
                        <div className='w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-[#FCEAEA] transition'>
                            <CgShoppingCart className='h-6 w-6 text-[#E23744]' />
                        </div>
                        {quantity > 0 && (
                            <span className='absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#E23744] text-[11px] font-semibold text-white ring-2 ring-white'>
                                {quantity}
                            </span>
                        )}
                    </Link>

                    {isAuth ? (
                        <Link
                            to="/account"
                            className='text-sm font-semibold text-white bg-[#E23744] px-4 py-2 rounded-full hover:bg-[#C42A36] transition'
                        >
                            Account
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className='text-sm font-semibold text-[#E23744] border border-[#E23744]/30 px-4 py-2 rounded-full hover:bg-[#FCEAEA] transition'
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {isHomePage && (
                <div className='px-4 pb-4'>
                    <div className='mx-auto flex max-w-7xl items-stretch rounded-xl border border-[#E7DFD3] bg-[#FFFBF5] overflow-hidden focus-within:border-[#E23744]/50 focus-within:ring-2 focus-within:ring-[#E23744]/20 transition'>
                        <div className='flex items-center gap-2 px-4 py-2.5 border-r border-[#E7DFD3] text-[#5C534C]'>
                            <BiMapPin className='h-4 w-4 text-[#E23744] shrink-0' />
                            <span className='text-sm font-medium truncate max-w-35'>{city}</span>
                        </div>
                        <div className='flex flex-1 items-center gap-2 px-4'>
                            <BiSearch className='h-4 w-4 text-[#B4AA9C] shrink-0' />
                            <input
                                type="text"
                                placeholder='Search for restaurant'
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                                className='w-full py-2.5 text-sm outline-none bg-transparent placeholder:text-[#B4AA9C]'
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar