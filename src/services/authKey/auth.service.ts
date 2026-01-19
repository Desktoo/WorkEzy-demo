import axios from "axios";

export const authService = {
  async sendOtp(mobile: string) {
    const res = await axios.post("/api/auth/send-otp", { mobile });
    return res.data; // { logid }
  },

  async verifyOtp(mobile: string, otp: string) {
    const res = await axios.post("/api/auth/verify-otp", {
      mobile,
      otp,
    });
    return res.data;
  },

  async resendOtp(mobile: string) {
    const res = await axios.post("/api/auth/send-otp", { mobile });
    return res.data;
  },
};
