import React from "react";

interface DonationThankYouEmailProps {
  name: string;
  amount: number;
  transactionId: string;
  fund: string;
}

const DonationThankYouEmail: React.FC<DonationThankYouEmailProps> = ({
  name,
  amount,
  transactionId,
  fund,
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
    highlight: {
      fontWeight: "bold",
      color: "#4F46E5",
    },
    details: {
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "5px",
      margin: "20px 0",
    },
    detailsItem: {
      fontSize: "14px",
      marginBottom: "10px",
    },
    footer: {
      textAlign: "center" as const,
      padding: "20px",
      fontSize: "12px",
      color: "#777777",
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
  };

  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        <div style={emailStyles.header}>
          <h1 style={emailStyles.headerTitle}>Thank You for Your Gift!</h1>
        </div>
        <div style={emailStyles.content}>
          <p style={emailStyles.paragraph}>Dear {name},</p>
          <p style={emailStyles.paragraph}>
            We are incredibly grateful for your generous donation of{" "}
            <span style={emailStyles.highlight}>Kes {amount.toFixed(2)}</span>{" "}
            to the <span style={emailStyles.highlight}>{fund}</span> fund. Your
            support is not just a gift; it's a partnership in our shared
            mission.
          </p>
          <p style={emailStyles.paragraph}>
            Your contribution will help us continue our work in the community,
            support our ministries, and spread the message of hope. Because of
            you, we can make a real difference.
          </p>
          <div style={emailStyles.details}>
            <h3 style={{ ...emailStyles.highlight, marginBottom: "15px" }}>
              Donation Details:
            </h3>
            <p style={emailStyles.detailsItem}>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p style={emailStyles.detailsItem}>
              <strong>Amount:</strong> Kes {amount.toFixed(2)}
            </p>
            <p style={emailStyles.detailsItem}>
              <strong>Fund:</strong> {fund}
            </p>
          </div>
          <p style={emailStyles.paragraph}>
            We are blessed to have you as part of our church family. May God
            bless you abundantly for your faithfulness and generosity.
          </p>
          <div style={{ textAlign: "center" }}>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/member/giving`}
              style={emailStyles.button}
            >
              View Your Giving History
            </a>
          </div>
        </div>
        <div style={emailStyles.footer}>
          <p>
            &copy; {new Date().getFullYear()} Zion Hill. All rights reserved.
          </p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default DonationThankYouEmail;
