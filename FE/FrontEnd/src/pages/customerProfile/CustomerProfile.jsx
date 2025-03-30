import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Tabs, Tab, Box, Slide  } from "@mui/material";
import ChangePassword from "../customerProfile/ChangePassword";
import { Person, Lock } from "@mui/icons-material";

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
  const [tabIndex, setTabIndex] = useState(0);

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

    axios
      .get(`http://localhost:5286/api/customer/${customerId}`)
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
      validationErrors.phone =
        "Phone must be 9-15 digits and contain only numbers!";
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

      await axios.put(
        `http://localhost:5286/api/customer/${customerId}`,
        formData
      );

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
    backgroundColor: "#e11d48",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: "#be123c"
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!customerData) return <p>No customer data found.</p>;

  return (
    <> 
      <Box 
        sx={{
          display: "flex", 
          maxWidth: "1100px", 
          margin: "auto", 
          padding: "40px", 
          backgroundColor: "#fff", 
          borderRadius: "10px", 
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "15px",
          height: "700px"
        }}
      >
       {/* Tabs Navigation */}
       <Tabs
          orientation="vertical"
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          sx={{
            minWidth: "220px",
            borderRight: 1,
            marginRight: "10px",
            borderColor: "divider",
            "& .MuiTabs-indicator": { backgroundColor: "#e11d48" }, // Đổi màu thanh chỉ báo
            "& .MuiTab-root": { 
              color: "#333", 
              fontSize: "16px", 
              fontWeight: "bold", 
              textAlign: "left", 
              justifyContent: "flex-start",  
              paddingLeft: "10px",
              "&:hover": { color: "#e11d48" }, // Khi hover đổi màu
            },
            "& .Mui-selected": { color: "#e11d48" }, // Màu tab khi được chọn
          }}
        >
          <Tab icon={<Person />} iconPosition="start" label="My Profile" />
          <Tab icon={<Lock />} iconPosition="start" label="Change Password" />
        </Tabs>

        <Box sx={{ flex: 1, paddingLeft: "20px" }}>
        {/* Tab Panels */}
        {tabIndex === 0 && (
          <div>
          <h2
            style={{
              textAlign: "center",
              color: "#e11d48",
              fontSize: "28px", 
              fontWeight: "bold", 
              marginBottom: "20px",
            }}
          >
            My Profile
          </h2>

          {editing ? (
            <form
              onSubmit={handleSubmit}
              style={{
                backgroundColor: "#fff", 
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {Object.keys(formData).map((field) => (
                    <tr
                      key={field}
                      style={{ borderBottom: "1px solid #ddd", height: "50px" }}
                    >
                      <th
                        style={{
                          padding: "15px",
                          textAlign: "left",
                          width: "30%",
                        }}
                      >
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
                            fontSize: "16px",
                          }}
                        />
                        {errors[field] && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginTop: "5px",
                            }}
                          >
                            {errors[field]}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button type="submit" style={buttonStyle}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#ddd",
                    color: "#333",
                    marginLeft: "10px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <tbody>
                  <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                    <th
                      style={{ padding: "15px", textAlign: "left", width: "30%" }}
                    >
                      First Name
                    </th>
                    <td style={{ padding: "15px" }}>{customerData.firstName}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                    <th
                      style={{ padding: "15px", textAlign: "left", width: "30%" }}
                    >
                      Last Name
                    </th>
                    <td style={{ padding: "15px" }}>{customerData.lastName}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                    <th
                      style={{ padding: "15px", textAlign: "left", width: "30%" }}
                    >
                      Email
                    </th>
                    <td style={{ padding: "15px" }}>{customerData.email}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #ddd", height: "50px" }}>
                    <th
                      style={{ padding: "15px", textAlign: "left", width: "30%" }}
                    >
                      Phone
                    </th>
                    <td style={{ padding: "15px" }}>
                      {customerData.phone || "N/A"}
                    </td>
                  </tr>
                  <tr style={{ height: "50px" }}>
                    <th
                      style={{ padding: "15px", textAlign: "left", width: "30%" }}
                    >
                      Address
                    </th>
                    <td style={{ padding: "15px" }}>
                      {customerData.address || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => setEditing(true)} style={buttonStyle}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {tabIndex === 1 && <ChangePassword />}
      </Box>
      </Box>
    </>
  );
};

export default CustomerProfile;
