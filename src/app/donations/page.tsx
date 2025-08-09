"use client";

import React, { useState, useEffect } from "react";

interface Fund {
  id: string;
  name: string;
  description?: string;
}

const DonationsPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [selectedFund, setSelectedFund] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loadingFunds, setLoadingFunds] = useState(true);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await fetch("/api/funds");
        if (!res.ok) throw new Error("Failed to fetch funds");
        const data = await res.json();
        setFunds(data);
        if (data.length > 0) {
          setSelectedFund(data[0].id); // Select the first fund by default
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingFunds(false);
      }
    };

    fetchFunds();
  }, []);

  const sendDonationReceipt = async (
    toEmail: string,
    donationDetails: { amount: number; fundName: string }
  ) => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: toEmail,
          subject: "Thank You for Your Donation!",
          html: `
            <h1>Thank You for Your Generous Donation!</h1>
            <p>Dear Donor,</p>
            <p>We sincerely thank you for your donation of <strong>KES ${donationDetails.amount.toFixed(
              2
            )}</strong> to the <strong>${donationDetails.fundName}</strong>.</p>
            <p>Your contribution makes a significant difference in our mission.</p>
            <p>God bless you!</p>
            <p>Sincerely,<br/>The Church Team</p>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(
          "Failed to send donation receipt email:",
          errorData.error
        );
      }
    } catch (err) {
      console.error("Error sending donation receipt email:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (amount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }

    try {
      const res = await fetch("/api/intasend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          phone,
          fundId: selectedFund,
          description: "Online Donation",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process donation");
      }

      setMessage(
        "M-Pesa STK Push initiated. Please complete the transaction on your phone."
      );
      setAmount(0);
      setPhone("");
      // Assuming you have the donor's email to send a receipt
      // For now, let's use a placeholder email or fetch it from user session if available
      const donorEmail = "omondielvin@gmail.com"; // Replace with actual donor email
      const selectedFundName =
        funds.find((f) => f.id === selectedFund)?.name || "General Fund";
      sendDonationReceipt(donorEmail, { amount, fundName: selectedFundName });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Make a Donation</h1>
      <p className="text-lg text-gray-600 mb-4">
        Your generous contributions help us continue our mission and support our
        community.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Donation Amount (KES):
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            M-Pesa Phone Number (e.g., 2547XXXXXXXX):
          </label>
          <input
            type="text"
            id="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="2547XXXXXXXX"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="fund"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Fund:
          </label>
          {loadingFunds ? (
            <p>Loading funds...</p>
          ) : funds.length > 0 ? (
            <select
              id="fund"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              required
            >
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {fund.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No funds available.</p>
          )}
        </div>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default DonationsPage;
