import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import { getSession } from '@/lib/auth';
import { extractTextFromFile } from '@/lib/parsers';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const mimeType = file.type;
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    // Convert file to Buffer for parser
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(buffer, mimeType);
    } catch (parseError) {
      console.error('Text extraction failed:', parseError);
      return NextResponse.json({ error: 'Failed to extract text from file. The document may be corrupted or image-only.' }, { status: 400 });
    }

    if (!extractedText.trim()) {
       return NextResponse.json({ error: 'No readable text found. Please upload a text-readable document.' }, { status: 400 });
    }

    await connectToDatabase();

    const newResume = await Resume.create({
      userId: session.userId,
      fileName: file.name,
      fileType: mimeType,
      extractedText: extractedText.trim(),
    });

    return NextResponse.json(
      { message: 'Resume uploaded successfully', resumeId: newResume._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
