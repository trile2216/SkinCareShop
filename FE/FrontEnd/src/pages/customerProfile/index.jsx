import { useState } from "react";
import { FaShoppingCart, FaMapMarkerAlt, FaDollarSign, FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const CustomerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const [customer, setCustomer] = useState({
        firstName: "Minh",
        lastName: "Thu",
        email: "thultmsel85044@fpt.edu.vn",
        phoneNumber: "0123456789",
        address: "123 Nguyen Trai, Hanoi",
        skinType: ["Sensitive"],
        totalSpent: "0đ",
        allOrders: 0,
        addresses: 1,
    });

    const [formData, setFormData] = useState(customer);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const formattedValue =
            name === "firstName" || name === "lastName"
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : value;

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };


    const handleSkinTypeChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            skinType: checked
                ? [...prev.skinType, value] // Thêm vào danh sách nếu chọn
                : prev.skinType.filter((type) => type !== value), // Bỏ khỏi danh sách nếu bỏ chọn
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be exactly 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return; // Dừng lại nếu form có lỗi
        setCustomer(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(customer);
        setIsEditing(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-1/4 bg-white p-6 shadow-lg">
                <div className="text-lg font-semibold">{customer.firstName}</div>
                <div className="text-gray-500 text-sm mb-6">{customer.email}</div>
                <nav>
                    <ul className="space-y-4">
                        <li className="bg-rose-300 text-white p-3 rounded-lg">My profile</li>
                        <li className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer">Orders</li>
                        <li className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer">Addresses</li>
                        <li className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer">Change password</li>
                        <li className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer">Logout</li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 p-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard icon={<FaDollarSign />} label="Total spent" value={customer.totalSpent} />
                    <StatCard icon={<FaShoppingCart />} label="All orders" value={customer.allOrders} />
                    <StatCard icon={<FaMapMarkerAlt />} label="Addresses" value={customer.addresses} />
                </div>

                {/* Profile Info */}
                <div className="bg-white p-6 shadow-lg rounded-lg relative">
                    <h2 className="text-xl font-semibold mb-4">My profile</h2>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="absolute top-6 right-12 text-green-600 hover:text-green-800">
                                <FaCheck size={20} />
                            </button>
                            <button onClick={handleCancel} className="absolute top-6 right-6 text-red-600 hover:text-red-800">
                                <FaTimes size={20} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 text-gray-600 hover:text-gray-800">
                            <FaEdit size={20} />
                        </button>
                    )}

                    <ProfileField label="First name" name="firstName" value={formData.firstName} onChange={handleInputChange} isEditing={isEditing} />
                    <ProfileField label="Last name" name="lastName" value={formData.lastName} onChange={handleInputChange} isEditing={isEditing} />
                    <ProfileField label="Email" name="email" value={formData.email} onChange={handleInputChange} isEditing={isEditing} error={errors.email} />
                    <ProfileField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} isEditing={isEditing} error={errors.phoneNumber} />
                    <ProfileField label="Address" name="address" value={formData.address} onChange={handleInputChange} isEditing={isEditing} />

                    {/* Skin Type với checkbox */}
                    <div className="border-b py-3">
                        <p className="text-gray-500">Skin Type</p>
                        {isEditing ? (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Normal", "Dry", "Oily", "Combination", "Sensitive"].map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input type="checkbox" value={type} checked={formData.skinType.includes(type)} onChange={handleSkinTypeChange} className="mr-2" />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                                <button onClick={() => setFormData((prev) => ({ ...prev, skinType: [] }))} className="mt-2 px-4 py-2 bg-rose-300 text-white rounded">
                                    Clear Selection
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-800">{formData.skinType.join(", ")}</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const ProfileField = ({ label, name, value, onChange, isEditing, error }) => (
    <div className="border-b py-3">
        <p className="text-gray-500">{label}</p>
        {isEditing ? <input type="text" name={name} value={value} onChange={onChange} className="w-full p-1 border border-gray-300 rounded mt-1" /> : <p className="text-gray-800">{value}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
);
const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
        <div className="text-2xl text-rose-400 mr-3">{icon}</div>
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    </div>
);


export default CustomerProfile;
