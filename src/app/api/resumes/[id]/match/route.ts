import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import JobAnalysis from '@/models/JobAnalysis';
import { getSession } from '@/lib/auth';
import { analyzeJobMatch } from '@/lib/ai';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, jobDescription } = await req.json();

    if (!jobTitle || !jobDescription) {
      return NextResponse.json({ error: 'Job title and description are required' }, { status: 400 });
    }

    const { id } = await params;
    await connectToDatabase();

    const resume = await Resume.findOne({ _id: id, userId: session.userId });
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Always generate a new analysis for each job description
    const result = await analyzeJobMatch(resume.extractedText, jobDescription);
      
    const jobAnalysis = await JobAnalysis.create({
      userId: session.userId,
      resumeId: resume._id,
      jobTitle,
      jobDescription,
      ...result
    });

    return NextResponse.json({ jobAnalysis }, { status: 200 });
  } catch (error: any) {
    console.error('Job Match Error:', error);
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

    const jobAnalyses = await JobAnalysis.find({ resumeId: id, userId: session.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ jobAnalyses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
