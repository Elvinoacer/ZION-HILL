import React from 'react';

interface OtpEmailProps {
  otp: string;
}

const OtpEmail: React.FC<OtpEmailProps> = ({ otp }) => {
  const emailStyles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      margin: 0,
      padding: '20px',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    header: {
      backgroundColor: '#4F46E5',
      color: '#ffffff',
      padding: '40px',
      textAlign: 'center' as const,
    },
    headerTitle: {
      margin: 0,
      fontSize: '28px',
      fontWeight: 'bold',
    },
    content: {
      padding: '40px',
      color: '#333333',
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.6',
      margin: '0 0 20px',
    },
    highlight: {
      fontWeight: 'bold',
      color: '#4F46E5',
      fontSize: '24px',
      letterSpacing: '4px',
    },
    footer: {
      textAlign: 'center' as const,
      padding: '20px',
      fontSize: '12px',
      color: '#777777',
    },
  };

  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={emailStyles.headerTitle}>Your One-Time Password</h1>
        </div>
        <div style={emailStyles.content}>
          <p style={emailStyles.paragraph}>Hello,</p>
          <p style={emailStyles.paragraph}>
            Please use the following One-Time Password (OTP) to complete your login. This OTP is valid for 1 minute.
          </p>
          <p style={emailStyles.paragraph}>
            Your OTP is: <span style={emailStyles.highlight}>{otp}</span>
          </p>
          <p style={emailStyles.paragraph}>
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
        <div style={emailStyles.footer}>
          <p>&copy; {new Date().getFullYear()} Kenya Assemblies of God. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OtpEmail;