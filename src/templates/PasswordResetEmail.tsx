import React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetLink,
}) => {
  const emailStyles = {
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      margin: 0,
      padding: "20px",
    },
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    header: {
      backgroundColor: "#4F46E5",
      color: "#ffffff",
      padding: "40px",
      textAlign: "center" as const,
    },
    headerTitle: {
      margin: 0,
      fontSize: "28px",
      fontWeight: "bold",
    },
    content: {
      padding: "40px",
      color: "#333333",
    },
    paragraph: {
      fontSize: "16px",
      lineHeight: "1.6",
      margin: "0 0 20px",
    },
    button: {
      display: "inline-block",
      padding: "12px 24px",
      margin: "20px 0",
      backgroundColor: "#4F46E5",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "5px",
      fontWeight: "bold",
    },
    footer: {
      textAlign: "center" as const,
      padding: "20px",
      fontSize: "12px",
      color: "#777777",
    },
  };

  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={emailStyles.headerTitle}>Reset Your Password</h1>
        </div>
        <div style={emailStyles.content}>
          <p style={emailStyles.paragraph}>Hello,</p>
          <p style={emailStyles.paragraph}>
            You are receiving this email because we received a password reset
            request for your account.
          </p>
          <p style={emailStyles.paragraph}>
            Click the button below to reset your password:
          </p>
          <div style={{ textAlign: "center" }}>
            <a href={resetLink} style={emailStyles.button}>
              Reset Password
            </a>
          </div>
          <p style={emailStyles.paragraph}>
            If you did not request a password reset, no further action is
            required.
          </p>
        </div>
        <div style={emailStyles.footer}>
          <p>
            &copy; {new Date().getFullYear()} Zion Hill. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmail;
