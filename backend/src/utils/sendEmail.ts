import { Resend } from "resend";
import { EmailParams } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  resetLink,
}: EmailParams): Promise<void> => {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Reset Your Account Password",
    html: `
      <h2>Password Reset Request</h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        <a href="${resetLink}">Reset Password</a>
      </p>

      <p>This link expires in 1 hour.</p>

      <p>If you didn't request this, simply ignore this email.</p>
    `,
  });
  console.log("Email sent");
  if (error) {
    throw new Error(error.message);
  }
};
