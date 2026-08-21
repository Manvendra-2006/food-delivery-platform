import {MapContainer,TileLayer,Marker,useMapEvents,useMap} from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import L from "leaflet";
import { LuLocateFixed } from "react-icons/lu";
import { BiLoader, BiPlus, BiTrash } from "react-icons/bi";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};
const LocateMeButton = ({ onLocate }) => {
  const map = useMap();

  const locateUser = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        map.flyTo([latitude, longitude], 16, {
          animate: true,
        });

        onLocate(latitude, longitude);
      },
      () => {
        toast.error("Location permission denied");
      }
    );
  };

  return (
    <button
      onClick={locateUser}
      className="absolute right-3 top-3 z-[1000] flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#2B211B] shadow-[0_2px_10px_rgba(43,33,27,0.12)] border border-[#EFE8DD] hover:bg-[#FCEAEA] hover:border-[#E23744]/30 hover:text-[#E23744] transition"
    >
      <LuLocateFixed size={16} />
      Use current location
    </button>
  );
};
const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [mobile, setMobile] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const fetchFormattedAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      setFormattedAddress(data.display_name || "");
    } catch (error) {
      toast.error("Failed to fetch address");
    }
  };
  const setLocation = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);

    fetchFormattedAddress(lat, lng);
  };
  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:2000/api/address/fetch-address`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddresses(data.fetchAddress || []);
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const addAddress = async () => {
    if (
      !mobile ||
      !formattedAddress ||
      latitude === null ||
      longitude === null
    ) {
      toast.error("Please select location on map");
      return;
    }

    try {
      setAdding(true);

      await axios.post(
        `http://localhost:2000/api/address/create-address`,
        {
          formattedAddress,
          phoneNo:mobile,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Address added");

      setMobile("");
      setFormattedAddress("");
      setLatitude(null);
      setLongitude(null);

      fetchAddresses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed"
      );
    } finally {
      setAdding(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      setDeletingId(id);

      await axios.delete(
        `http://localhost:2000/api/address/delete-address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Address deleted");

      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-[#FFFBF5] px-4 py-6">

      <h1 className="font-serif text-2xl font-bold text-[#2B211B]">
        Select Delivery Address
      </h1>
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-[#EFE8DD] shadow-[0_2px_20px_rgba(43,33,27,0.06)]">

        <MapContainer
          center={[
            latitude || 28.6139,
            longitude || 77.209,
          ]}
          zoom={13}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LocationPicker
            setLocation={setLocation}
          />
          <LocateMeButton
            onLocate={setLocation}
          />
          {latitude !== null &&
            longitude !== null && (
              <Marker
                position={[latitude, longitude]}
              />
            )}

        </MapContainer>
      </div>
      {formattedAddress && (
        <div className="rounded-xl border border-[#EFE8DD] bg-[#FCEAEA] p-3 text-sm text-[#2B211B]">
          📍 {formattedAddress}
        </div>
      )}
      <input
        type="tel"
        placeholder="Mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] px-4 py-2.5 text-[#2B211B] placeholder:text-[#B4AA9C] outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
      />
      <button
        disabled={adding}
        onClick={addAddress}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E23744] px-4 py-3 font-semibold text-white shadow-sm hover:bg-[#C42A36] active:scale-[0.99] disabled:bg-[#D9D2C6] disabled:cursor-not-allowed transition-all"
      >
        {adding ? (
          <BiLoader className="animate-spin" />
        ) : (
          <BiPlus />
        )}

        Save Address
      </button>

     
      <div className="space-y-3">

        <h2 className="text-lg font-semibold text-[#2B211B]">
          Saved Addresses
        </h2>

        {loading ? (
          <p className="text-sm text-[#8A8078]">
            Loading...
          </p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-[#8A8078]">
            No addresses saved
          </p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="flex items-center justify-between rounded-xl border border-[#EFE8DD] bg-white p-3 shadow-[0_2px_10px_rgba(43,33,27,0.04)] hover:border-[#E23744]/20 transition"
            >

              <div>
                <p className="text-sm font-medium text-[#2B211B]">
                  {addr.formattedAddress}
                </p>
                <p className="text-xs text-[#8A8078]">
                  📞 {addr.mobile}
                </p>
              </div>

              <button
                onClick={() =>
                  deleteAddress(addr._id)
                }
                disabled={deletingId === addr._id}
                className="rounded-lg p-2 text-[#E23744] hover:bg-[#FCEAEA] disabled:opacity-50 transition"
              >

                {deletingId === addr._id ? (
                  <BiLoader
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <BiTrash size={16} />
                )}

              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Address