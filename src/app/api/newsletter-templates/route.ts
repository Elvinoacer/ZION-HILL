import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templateName = searchParams.get('template');
  const templatesDirectory = path.join(process.cwd(), 'src', 'templates', 'newsletters');

  try {
    if (templateName) {
      const filePath = path.join(templatesDirectory, templateName);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return NextResponse.json({ content: fileContent });
    } else {
      const files = await fs.readdir(templatesDirectory);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      return NextResponse.json(htmlFiles);
    }
  } catch (error) {
    console.error('Failed to fetch newsletter templates', error);
    return NextResponse.json({ error: 'Failed to fetch newsletter templates' }, { status: 500 });
  }
}
