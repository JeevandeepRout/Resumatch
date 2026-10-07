import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { rewriteResumeContent } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { originalText } = await req.json();

    if (!originalText || typeof originalText !== 'string' || originalText.trim().length === 0) {
      return NextResponse.json({ error: 'Original text is required' }, { status: 400 });
    }

    const result = await rewriteResumeContent(originalText);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Rewrite Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
