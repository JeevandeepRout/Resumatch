import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import Resume from '@/models/Resume';
import { ResumeList } from './ResumeList';
import { RewriteTool } from '@/components/RewriteTool'; // Client component for interactivity

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.userId) {
    redirect('/login');
  }

  let resumes: any[] = [];
  try {
    await connectToDatabase();
    const docs = await Resume.find({ userId: session.userId })
      .select('_id fileName fileType createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    resumes = docs.map((doc: any) => ({
      _id: doc._id.toString(),
      fileName: doc.fileName,
      createdAt: doc.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
  }

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
        <ResumeList initialResumes={resumes} />
      </div>
    </div>
  );
}
