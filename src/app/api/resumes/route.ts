import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const resumes = await Resume.find({ userId: session.userId })
      .select('_id fileName fileType createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
