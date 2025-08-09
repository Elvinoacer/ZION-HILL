import { NextResponse } from 'next/server';
import IntaSend from 'intasend-node';

export async function POST(request: Request) {
  const { amount, phone, fundId, description } = await request.json();

  if (!amount || !phone) {
    return NextResponse.json({ error: 'Amount and phone number are required' }, { status: 400 });
  }

  try {
    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY as string,
      process.env.INTASEND_SECRET_KEY as string,
      false // Set to true for test environment, false for production
    );

    const collection = intasend.collection();
    const intasendResponse = await collection.mpesaStkPush({
      amount: amount,
      phone_number: phone,
      api_ref: `donation-${Date.now()}`,
      // You might want to add a callback URL here for status updates
      // callback_url: 'YOUR_CALLBACK_URL',
      // You can also pass other details like first_name, last_name, email, host if needed
    });

    // Save the transaction to your database
    // This part assumes you have a way to link the IntaSend transaction to your local transaction
    // For simplicity, I'm just returning the IntaSend response for now.
    // In a real application, you'd save the transaction details and status.

    return NextResponse.json(intasendResponse);
  } catch (error: any) {
    console.error('IntaSend API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to initiate M-Pesa STK Push' },
      { status: error.response?.status || 500 }
    );
  }
}