import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import { getSession } from '@/lib/auth';

export async function DELETE(
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
      return NextResponse.json({ error: 'Resume not found or unauthorized' }, { status: 404 });
    }

    await Resume.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Resume deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
