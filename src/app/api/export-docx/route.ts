import { NextResponse } from 'next/server';
import * as HTMLToDocx from 'html-to-docx';

export async function POST(request: Request) {
  try {
    const { htmlContent } = await request.json();

    if (!htmlContent) {
      return new NextResponse('HTML content is required', { status: 400 });
    }

    const docxBuffer = await HTMLToDocx.asBlob(htmlContent);

    return new NextResponse(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="document.docx"',
      },
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
