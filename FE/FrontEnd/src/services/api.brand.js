import { toast } from "react-toastify";
import api from "../config/axios";

export const getBrands = async () => {
  try {
    const response = await api.get("/brand");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
