import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/api.customer";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  LinearProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  Check,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Lấy email và token từ URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      setFormData((prev) => ({
        ...prev,
        email,
        token,
      }));
    } else {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords don't match" });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword,
      });

      setResetSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          {!resetSuccess && (
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/login")}
              sx={{ mb: 2 }}
            >
              Back to Login
            </Button>
          )}

          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              {resetSuccess ? (
                // Hiển thị khi đặt lại mật khẩu thành công
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Check
                    sx={{
                      fontSize: 60,
                      color: "#4caf50",
                      mb: 2,
                      p: 1,
                      borderRadius: "50%",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                    }}
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Password Reset Successful!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Your password has been changed successfully.
                  </Typography>
                  <Typography variant="body2">
                    You will be redirected to the login page in a few seconds...
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                      mt: 2,
                      bgcolor: "#E11D48",
                      "&:hover": { bgcolor: "#BE123C" },
                      borderRadius: 2,
                    }}
                  >
                    Go to Login
                  </Button>
                </Box>
              ) : (
                // Form đặt lại mật khẩu
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    <LockReset sx={{ fontSize: 48, color: "#E11D48" }} />
                  </Box>

                  <Typography
                    variant="h5"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                    align="center"
                  >
                    Reset Your Password
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                    align="center"
                  >
                    Please create a new secure password for your account
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="New Password"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        bgcolor: "#E11D48",
                        "&:hover": { bgcolor: "#BE123C" },
                        borderRadius: 2,
                      }}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ResetPassword;
