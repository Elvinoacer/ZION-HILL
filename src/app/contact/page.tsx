import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-4">
        We'd love to hear from you! Please feel free to reach out with any questions or inquiries.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-2">Email: info@churchconnect.com</p>
        <p className="text-gray-700 mb-2">Phone: (123) 456-7890</p>
        <p className="text-gray-700">Address: 123 Church St, City, State, 12345</p>
      </div>
    </div>
  );
};

export default ContactPage;
