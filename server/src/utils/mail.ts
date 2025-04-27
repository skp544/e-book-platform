import nodemailer from "nodemailer";

interface VerificationMailOptions {
  to: string;
  link: string;
}

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_TEST_HOST,
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

const mail = {
  async sendVerificationMail(options: VerificationMailOptions) {
    await transport.sendMail({
      to: options.to,
      from: process.env.VERIFICATION_MAIL,
      subject: "Verify your eBook account",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background-color: #f9f9f9;">
      <h2 style="color: #333333;">Welcome to eBook Platform!</h2>
      <p style="color: #555555; font-size: 16px;">
        Hello,<br><br>
        Thank you for signing up with the email <strong>${options.to}</strong>.<br>
        Please confirm your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${options.link}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify My Account
        </a>
      </div>
      <p style="color: #888888; font-size: 14px;">
        If you did not request this verification, please ignore this email.
      </p>
      <p style="color: #888888; font-size: 14px;">
        Thanks,<br>
        The eBook Platform Team
      </p>
    </div>
  `,
    });
  },
};

export default mail;
