import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const testimonials = await prisma.feedback.findMany({
      where: { tags: { has: 'testimonial' } },
      include: { user: true }, // Include the related User data
    });
    console.log('Fetched testimonials:', testimonials);
    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: `Error fetching testimonials: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Received POST request body:', body);
  try {
    const newTestimonial = await prisma.feedback.create({ data: { ...body, tags: [...(body.tags || []), 'testimonial'] } });
    console.log('Created new testimonial:', newTestimonial);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: `Error creating testimonial: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
  }

  try {
    const updatedTestimonial = await prisma.feedback.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), 'testimonial'] },
    });
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
  }

  try {
    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting testimonial' }, { status: 500 });
  }
}
