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
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            <div className="mx-auto max-w-md">

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                
                    <div className="flex flex-col items-center border-b p-6">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-3xl font-semibold text-white">
                            {firstletter}
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            {user?.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {user?.email}
                        </p>
                    </div>

                   
                    <div className="p-5">

                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                            Account Information
                        </h3>

                 
                        <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                            <FiUser className="text-xl text-gray-500" />

                            <div>
                                <p className="text-xs text-gray-400">
                                    Name
                                </p>

                                <p className="font-medium text-gray-700">
                                    {user?.name}
                                </p>
                            </div>
                        </div>

                  
                        <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                            <FiMail className="text-xl text-gray-500" />

                            <div>
                                <p className="text-xs text-gray-400">
                                    Email
                                </p>

                                <p className="font-medium text-gray-700">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                            <FiShield className="text-xl text-gray-500" />

                            <div>
                                <p className="text-xs text-gray-400">
                                    Role
                                </p>

                                <p className="font-medium capitalize text-gray-700">
                                    {user?.role || "Not Selected"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t p-5">

                        <button
                            onClick={() => navigate("/orders")}
                            className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <FiShoppingBag className="text-xl text-gray-500" />

                                <span>Your Orders</span>
                            </div>

                            <span className="text-gray-400">
                                →
                            </span>
                        </button>

                    </div>
<div className="mt-3">
    <button
        onClick={() => navigate("/address")}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
    >
        <div className="flex items-center gap-3">
            <FiMapPin className="text-xl text-gray-500" />

            <span>Address</span>
        </div>

        <span className="text-gray-400">
            →
        </span>
    </button>
</div>
              
                    <div className="border-t p-5">

                        <button
                            onClick={logoutHandler}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600"
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