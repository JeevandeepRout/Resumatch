import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import Analysis from '@/models/Analysis';
import { getSession } from '@/lib/auth';
import { analyzeResume } from '@/lib/ai';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const resume = await Resume.findOne({ _id: id, userId: session.userId });
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Check if analysis already exists
    let analysis = await Analysis.findOne({ resumeId: id, userId: session.userId });
    
    // If not, generate one
    if (!analysis) {
      const result = await analyzeResume(resume.extractedText);
      
      analysis = await Analysis.create({
        userId: session.userId,
        resumeId: resume._id,
        ...result
      });
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const analysis = await Analysis.findOne({ resumeId: id, userId: session.userId });
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
