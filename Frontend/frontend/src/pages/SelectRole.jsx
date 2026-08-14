import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import api from "../../axios";

const roles = ["Customer", "Rider", "Seller"];

const SelectRole = () => {

    const [role, setrole] = useState(null);

    const { setuser } = useContext(AppContext);

    const navigate = useNavigate();

    async function AddRole() {
        try {

            const { data } = await api.post(
                "/auth/role",
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

            setuser(data.user);

            navigate("/", { replace: true });

        } catch (error) {
            alert("Something went wrong");
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">

            <div className="w-full max-w-sm space-y-6">

                <h1 className="text-center text-2xl font-bold">
                    Choose Your Role
                </h1>

                <div className="space-y-4">

                    {roles.map((r) => (
                        <button
                            key={r}
                            onClick={() => setrole(r)}
                            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                                role === r
                                    ? "border-[#E23744] bg-[#E23744] text-white"
                                    : "border-gray-300 bg-white text-black"
                            }`}
                        >
                            Continue as {r}
                        </button>
                    ))}

                    <button
                        onClick={AddRole}
                        disabled={!role}
                        className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>
    );
};

export default SelectRole;