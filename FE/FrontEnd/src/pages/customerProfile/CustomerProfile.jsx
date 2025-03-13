import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      console.error("No customerId found in localStorage");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5286/api/customer/${customerId}`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data) {
          setCustomerData(response.data);
          setFormData({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error loading customer data:", error);
      })
      .finally(() => setLoading(false));
  }, []);



  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{9,15}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format!";
    }
    if (!validatePhone(formData.phone)) {
      validationErrors.phone = "Phone must be 9-15 digits and contain only numbers!";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        toast.error("Customer ID not found.");
        return;
      }

      // Gửi dữ liệu cập nhật lên API
      await axios.put(`http://localhost:5286/api/customer/${customerId}`, formData);

      // Cập nhật lại dữ liệu hiển thị sau khi chỉnh sửa
      setCustomerData((prevData) => ({
        ...prevData,
        ...formData,
      }));

      toast.success("Customer updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer.");
    }
  };

  const buttonStyle = {
    backgroundColor: "#f43f5e", // Màu rose-500
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  };



  if (loading) return <p>Loading...</p>;
  if (!customerData) return <p>No customer data found.</p>;

  return (
    <>
      <Header />

      <div style={{ maxWidth: "1000px", margin: "auto", padding: "70px", backgroundColor: "#fff1f2", borderRadius: "5px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#e11d48",
            fontSize: "28px", // Tăng kích thước chữ
            fontWeight: "bold", // In đậm
            marginBottom: "20px",
          }}
        >My Profile</h2>

        {editing ? (
          <form onSubmit={handleSubmit}
            style={{
              backgroundColor: "#fff", // Màu rose-100
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {Object.keys(formData).map((field) => (
                  <tr key={field} style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                    <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </th>
                    <td style={{ padding: "15px" }}>

                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                          outline: "none",
                          fontSize: "16px"
                        }}
                      />
                      {errors[field] && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors[field]}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button type="submit" style={buttonStyle}>Save</button>
              <button type="button" onClick={() => setEditing(false)} style={{ ...buttonStyle, backgroundColor: "#ddd", color: "#333", marginLeft: "10px" }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
            }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                  <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>First Name</th>
                  <td style={{ padding: "15px" }}>{customerData.firstName}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                  <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>Last Name</th>
                  <td style={{ padding: "15px" }}>{customerData.lastName}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                  <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>Email</th>
                  <td style={{ padding: "15px" }}>{customerData.email}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                  <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>Phone</th>
                  <td style={{ padding: "15px" }}>{customerData.phone || "N/A"}</td>
                </tr>
                <tr style={{ height: "50px" }}>
                  <th style={{ padding: "15px", textAlign: "left", width: "30%" }}>Address</th>
                  <td style={{ padding: "15px" }}>{customerData.address || "N/A"}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button onClick={() => setEditing(true)} style={buttonStyle}>Edit</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>

  );
};



export default CustomerProfile;
