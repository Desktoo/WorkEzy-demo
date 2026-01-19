import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: sans-serif">
        <h2>Your OTP Code</h2>
        <p>Use the following OTP to continue:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `,
  });
}
