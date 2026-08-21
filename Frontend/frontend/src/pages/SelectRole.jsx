import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const roles = ["Customer", "Rider", "Seller"];

const SelectRole = () => {

    const [role, setrole] = useState(null);

    const { setuser } = useContext(AppContext);

    const navigate = useNavigate();

    async function AddRole() {
        try {

            const { data } = await axios.post(
                "http://localhost:1000/api/auth/role",
                {
                    role: role
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            localStorage.setItem("token", data.tokenRole);

            const updatedUser = data.user || {};
            setuser(updatedUser);

            navigate(updatedUser.role ? "/" : "/select-role", { replace: true });

        } catch (error) {
            alert("Something went wrong");
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/40 px-4">

            <div className="w-full max-w-sm space-y-6 bg-white border border-[#EFE8DD] rounded-2xl shadow-[0_4px_28px_rgba(43,33,27,0.08)] p-8">

                <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 flex items-center justify-center mb-1 ring-1 ring-[#E23744]/10">
                        <span className="font-serif text-2xl font-bold text-[#E23744]">?</span>
                    </div>
                    <h1 className="font-serif text-center text-2xl font-bold text-[#2B211B]">
                        Choose Your Role
                    </h1>
                    <p className="text-center text-sm text-[#8A8078]">Pick how you'd like to use the app</p>
                </div>

                <div className="space-y-3">

                    {roles.map((r) => (
                        <button
                            key={r}
                            onClick={() => setrole(r)}
                            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                                role === r
                                    ? "border-[#E23744] bg-[#E23744] text-white shadow-[0_4px_14px_rgba(226,55,68,0.3)]"
                                    : "border-[#E7DFD3] bg-[#FFFDF9] text-[#2B211B] hover:border-[#E23744]/40 hover:bg-white"
                            }`}
                        >
                            Continue as {r}
                        </button>
                    ))}

                    <button
                        onClick={AddRole}
                        disabled={!role}
                        className="w-full rounded-xl bg-[#2B211B] hover:bg-[#1a1310] active:scale-[0.99] px-4 py-3 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>
    );
};

export default SelectRole;