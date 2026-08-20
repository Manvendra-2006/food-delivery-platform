import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiMapPin,
    FiLogOut,
    FiShield,
    FiShoppingBag
} from "react-icons/fi";

const Account = () => {
    const { setuser, user, setisAuth } = useContext(AppContext);
    const navigate = useNavigate();

    const firstletter = user?.name?.charAt(0).toUpperCase();

    function logoutHandler() {
        localStorage.removeItem("token");

        setuser(null);
        setisAuth(false);

        toast.success("Logout Successfully");
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] px-4 py-10">
            <div className="mx-auto max-w-md">
                <div className="overflow-hidden rounded-2xl bg-white border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)]">

                    {/* Profile header */}
                    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-[#FCEAEA] to-white border-b border-[#F1E4E2]">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E23744] text-3xl font-semibold text-white ring-4 ring-white shadow-sm">
                            {firstletter}
                        </div>

                        <h2 className="mt-4 font-serif text-xl font-bold text-[#2B211B]">
                            {user?.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#8A8078]">
                            {user?.email}
                        </p>
                    </div>

                    {/* Account info */}
                    <div className="p-5">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#B4AA9C]">
                            Account information
                        </h3>

                        <div className="mb-3 flex items-center gap-4 rounded-xl bg-[#FFFBF5] border border-[#EFE8DD] p-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E23744]/10">
                                <FiUser className="text-base text-[#E23744]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#B4AA9C]">Name</p>
                                <p className="font-medium text-[#2B211B]">{user?.name}</p>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center gap-4 rounded-xl bg-[#FFFBF5] border border-[#EFE8DD] p-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E23744]/10">
                                <FiMail className="text-base text-[#E23744]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#B4AA9C]">Email</p>
                                <p className="font-medium text-[#2B211B]">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl bg-[#FFFBF5] border border-[#EFE8DD] p-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E23744]/10">
                                <FiShield className="text-base text-[#E23744]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#B4AA9C]">Role</p>
                                <p className="font-medium capitalize text-[#2B211B]">
                                    {user?.role || "Not selected"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="px-5">
                        <button
                            onClick={() => navigate("/orders")}
                            className="flex w-full items-center justify-between rounded-xl border border-[#EFE8DD] px-4 py-3.5 font-medium text-[#2B211B] transition hover:border-[#E23744]/30 hover:bg-[#FCEAEA]"
                        >
                            <div className="flex items-center gap-3">
                                <FiShoppingBag className="text-lg text-[#E23744]" />
                                <span>Your orders</span>
                            </div>
                            <span className="text-[#B4AA9C]">→</span>
                        </button>
                    </div>

                    {/* Address */}
                    <div className="p-5">
                        <button
                            onClick={() => navigate("/address")}
                            className="flex w-full items-center justify-between rounded-xl border border-[#EFE8DD] px-4 py-3.5 font-medium text-[#2B211B] transition hover:border-[#E23744]/30 hover:bg-[#FCEAEA]"
                        >
                            <div className="flex items-center gap-3">
                                <FiMapPin className="text-lg text-[#E23744]" />
                                <span>Address</span>
                            </div>
                            <span className="text-[#B4AA9C]">→</span>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#F1E4E2] p-5">
                        <button
                            onClick={logoutHandler}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E23744] px-4 py-3.5 font-semibold text-white transition hover:bg-[#C42A36] active:scale-[0.99]"
                        >
                            <FiLogOut className="text-lg" />
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Account;