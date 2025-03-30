import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { changePassword } from "../../services/api.customer";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import {
    Card, CardContent, Typography, TextField, Button, IconButton, InputAdornment
} from "@mui/material";

const ChangePassword = () => {
    const navigate = useNavigate();
    const customerId = useSelector((state) => state.user.customerId);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        comfirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        comfirm: false,
    });

    useEffect(() => {
        if (!customerId) {
            navigate("/changePassword");
        }
    }, [customerId, navigate]);
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

        if (formData.newPassword !== formData.comfirmPassword) {
            toast.error("New password and comfirmation password do not match");
            return;
        }

        console.log("🔍 Data sent to API:", {
            customerId,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            comfirmPassword: formData.comfirmPassword,
        });

        setLoading(true);
        try {
            await changePassword(customerId, formData);
            setFormData({ currentPassword: "", newPassword: "", comfirmPassword: "" });
            toast.success("Password changed successfully");
            navigate("/customerProfile");
        } catch (error) {
            toast.error("Error changing password");
        }
        setLoading(false);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-center  py-10 px-6">
                <Card sx={{ maxWidth: 400, width: "100%", padding: 2, boxShadow: "none", border: "none" }}>
                    <CardContent sx={{ textAlign: "left" }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#e11d48" }}>
                            Change Password
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            {["currentPassword", "newPassword", "comfirmPassword"].map((field, index) => (
                                <TextField
                                    key={index}
                                    label={
                                        field === "currentPassword"
                                            ? "Current  Password"
                                            : field === "newPassword"
                                                ? "New Password"
                                                : "comfirm New Password"
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
                                        "& .MuiInputLabel-root": {
                                            color: "#e11d48",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#be123c",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 8,
                                            "& fieldset": {
                                                borderColor: "#fda4af",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#fda4af",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#be123c",
                                                borderWidth: "2px",
                                            },
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
                                    "&:hover": {
                                        bgcolor: "#BE123C",
                                        transform: "scale(1.05)",
                                        transition: "0.2s",
                                    },
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
        </>
    );
};

export default ChangePassword;
