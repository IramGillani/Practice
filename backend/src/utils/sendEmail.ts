import { Resend } from "resend";
import { EmailParams } from "../types";
import { EmailType } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  link,
  type,
}: EmailParams): Promise<void> => {
  let subject: string;
  let html: string;

  switch (type) {
    case EmailType.PASSWORD_RESET:
      subject = "Reset Your Account Password";
      html = `
        <h2>Password Reset Request</h2>

        <p>We received a request to reset your password.</p>

        <p>
          <a href="${link}">Reset Password</a>
        </p>

        <p>This link expires in 1 hour.</p>

        <p>If you didn't request this, simply ignore this email.</p>
      `;
      break;

    case EmailType.EMAIL_VERIFICATION:
      subject = "Verify Your Email Address";
      html = `
        <h2>Welcome!</h2>

        <p>Thanks for creating an account.</p>

        <p>Please verify your email by clicking the button below.</p>

        <p>
          <a href="${link}">Verify Email</a>
        </p>

        <p>This link expires in 1 hour.</p>
      `;
      break;

    default:
      throw new Error("Unsupported email type");
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
};
