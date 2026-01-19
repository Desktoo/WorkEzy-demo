type OtpRecord = {
  otp: string;
  expiresAt: number;
};

export const otpStore = new Map<string, OtpRecord>();
