import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { changePassword } from "../../services/api.customer";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import {
    Card, CardContent, Typography, TextField, Button, IconButton, InputAdornment
} from "@mui/material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ChangePassword = () => {
    const navigate = useNavigate();
    const customerId = useSelector((state) => state.user.customerId);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    if (!customerId) {
        navigate("/login");
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirmation password do not match");
            return;
        }

        setLoading(true);
        try {
            await changePassword(customerId, formData);
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Password changed successfully");
            navigate("/customerProfile");
        } catch (error) {
            toast.error("Error changing password");
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-6">
                <Card sx={{ maxWidth: 400, width: "100%", padding: 2, boxShadow: "none", border: "none" }}>
                    <CardContent sx={{ textAlign: "left" }}>
                        {/* Nút Back */}
                        <Button
                            startIcon={<ArrowBack />}
                            sx={{ mb: 2, textTransform: "none", fontSize: 16 }}
                            onClick={() => navigate("/customerProfile")}
                        >
                            Back
                        </Button>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Change Password
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => (
                                <TextField
                                    key={index}
                                    label={
                                        field === "currentPassword"
                                            ? "Current Password"
                                            : field === "newPassword"
                                                ? "New Password"
                                                : "Confirm New Password"
                                    }
                                    type={showPassword[field] ? "text" : "password"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 8,
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => togglePasswordVisibility(field)} edge="end">
                                                    {showPassword[field] ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ))}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    bgcolor: "#E11D48",
                                    "&:hover": { bgcolor: "#BE123C" },
                                    borderRadius: 8
                                }}
                                disabled={loading}
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </>
    );
};

export default ChangePassword;
