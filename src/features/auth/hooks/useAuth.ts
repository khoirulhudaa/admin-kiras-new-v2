import axios from 'axios';
import { useState } from 'react';

const API_AUTH = "http://localhost:5005/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_AUTH}/login`, payload);
      return res.data; // Mengembalikan { success: true, token, user }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_AUTH}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading };
};