import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/api.customer";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Email } from "@mui/icons-material";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xác thực email
    if (!email.trim() || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email); // Gọi API
      setEmailSent(true); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error requesting password reset:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center">
      {/* Ảnh nền bị làm mờ */}
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/xP1xJCq.jpg')] bg-cover bg-center blur-md opacity-90"></div>

      {/* Khung đăng nhập */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-rose-100 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-rose-400">
            {emailSent ? "Check Your Email" : "Forgot Password"}
          </h2>
        </div>

        {emailSent ? (
          // Hiển thị khi email đã được gửi
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Email sx={{ fontSize: 60, color: "#E11D48", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Check your email
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We have sent a password recovery link to:
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
              {email}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please check your email and click on the link to reset your
              password. If you don't see it, check your spam folder.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                borderColor: "#E11D48",
                color: "#E11D48",
                "&:hover": { borderColor: "#BE123C", color: "#BE123C" },
              }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          // Form quên mật khẩu
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Please enter the email address associated with your account,
              and we'll send you a link to reset your password.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                autoFocus
                sx={{
                  mb: 3,
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
                  py: 1.5,
                  bgcolor: "#E11D48",
                  "&:hover": { bgcolor: "#BE123C" },
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    style={{ color: "#E11D48", textDecoration: "none" }}
                  >
                    Back to login
                  </Link>
                </Typography>
              </Box>
            </form>
          </>
        )}
      </div>

      <div className="absolute top-4 left-4">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
