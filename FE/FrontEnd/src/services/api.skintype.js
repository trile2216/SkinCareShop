import { toast } from "react-toastify";
import api from "../config/axios";

export const getSkinTypes = async () => {
  try {
    const response = await api.get("/skintype");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const getSkinTypesById = async () => {
  try {
    const response = await api.get(`/skintype/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
