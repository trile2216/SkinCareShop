import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import useAuth from "../context/useAuth";
import { instance } from "../lib/axios";
import { useSelector } from "react-redux";

const Profile = () => {
  const { logoutUser } = useAuth();
  const customerId = useSelector((state) => state.user.customerId);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (customerId) {
      fetchUserProfile();
    }
  }, [customerId]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: () => {
          logoutUser();
        },
        style: "destructive",
      },
    ]);
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/customer/${customerId}`);
      console.log("Profile Response:", response.data);
      
      const userData = response.data?.data || response.data;
      
      if (!userData || !userData.firstName) {
        console.error("Invalid user data:", userData);
        Alert.alert("Error", "Invalid profile data received");
        return;
      }
      
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
      });
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        address: formData.address || null,
      };

      const response = await instance.put(`/customer/${customerId}`, payload);
      setUser(response.data.data || response.data);
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchUserProfile}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const email = user?.email || "";
  const phone = user?.phone || "";
  const address = user?.address || "";
  const isActive = user?.isActive || false;

  return (
    <ScrollView style={styles.container} key="profile-view">
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {firstName?.[0]?.toUpperCase() || "?"}
            {lastName?.[0]?.toUpperCase() || "?"}
          </Text>
        </View>
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) =>
                  handleInputChange("firstName", value)
                }
                placeholder="Enter first name"
              />
            ) : (
              <Text style={styles.value}>{firstName || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                placeholder="Enter last name"
              />
            ) : (
              <Text style={styles.value}>{lastName || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email || "Not provided"}</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholder="Enter phone number"
              />
            ) : (
              <Text style={styles.value}>{phone || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textAreaInput]}
                value={formData.address}
                onChangeText={(value) => handleInputChange("address", value)}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.value}>
                {address || "Not provided"}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#757575",
  },
  logoutButton: {
    backgroundColor: "#ffebee",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d32f2f",
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    color: "#333",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  input: {
    fontSize: 14,
    color: "#333",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  textAreaInput: {
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#667eea",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
