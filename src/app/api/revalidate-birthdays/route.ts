import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // NOTE: For this to work, you need to set a secret in your environment variables
    // and check it here to make sure only authorized requests can trigger a revalidation.
    // For example:
    // const secret = req.headers.get('x-revalidate-secret');
    // if (secret !== process.env.REVALIDATE_SECRET) {
    //   return new NextResponse('Invalid secret', { status: 401 });
    // }

    // Revalidate the "Birthdays" page
    await NextResponse.next().headers.set('x-middleware-cache', 'no-cache');
    await req.cookies.clear();
    const response = NextResponse.redirect(new URL('/member/birthdays', req.url));
    response.headers.set('x-revalidated', 'true');
    return response;

  } catch (error) {
    console.error('Error revalidating birthdays page:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
