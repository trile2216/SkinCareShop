import { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch("https://localhost:5286/customers");
        if (!response.ok) throw new Error("Failed to fetch customer data");
        const data = await response.json();
        setCustomer(data);
        setFormData(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch("https://localhost:5286/customers/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchOrderHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch("https://localhost:5286/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setCustomer(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = () => {
    setFormData(customer);
    setIsEditing(false);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-rose-100">
      <main className="w-3/4 p-8">
        <div className="bg-rose-300 p-6 shadow-lg rounded-lg mb-6 relative text-white">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          {isEditing ? (
            <>
              <button onClick={handleSave} className="absolute top-6 right-12 text-white hover:text-gray-300">
                <FaCheck size={20} />
              </button>
              <button onClick={handleCancel} className="absolute top-6 right-6 text-white hover:text-gray-300">
                <FaTimes size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 text-white hover:text-gray-300">
              <FaEdit size={20} />
            </button>
          )}
          <ProfileField label="First name" name="firstName" value={formData.firstName} onChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="Last name" name="lastName" value={formData.lastName} onChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="Email" name="email" value={formData.email} onChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} isEditing={isEditing} error={errors.phoneNumber} />
          <ProfileField label="Address" name="address" value={formData.address} onChange={handleInputChange} isEditing={isEditing} />
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <table className="w-full border-collapse border border-rose-300">
              <thead>
                <tr className="bg-rose-300 text-white">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="text-center">
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="border p-2">${order.total}</td>
                    <td className="border p-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, isEditing, error }) => (
  <div className="border-b py-3">
    <p className="text-gray-100">{label}</p>
    {isEditing ? (
      <input type="text" name={name} value={value} onChange={onChange} className="w-full p-1 border border-gray-300 rounded mt-1 text-gray-900" />
    ) : (
      <p className="text-white">{value}</p>
    )}
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default CustomerProfile;
