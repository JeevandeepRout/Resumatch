'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadResume } from '@/components/UploadResume';
import Link from 'next/link';

type Resume = {
  _id: string;
  fileName: string;
  createdAt: string;
};

export function ResumeList({ initialResumes }: { initialResumes: Resume[] }) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (error) {
      alert('Failed to delete resume');
    }
  };

  const handleUploadSuccess = (newResumeId: string) => {
    // In a real app, you might fetch the single new resume or revalidate the page.
    // For simplicity, we just reload to get fresh data from the server.
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <Card key={resume._id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="truncate" title={resume.fileName}>
              {resume.fileName}
            </CardTitle>
            <CardDescription>
              {new Date(resume.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-end justify-between space-x-2">
            <Link href={`/dashboard/analysis/${resume._id}`}>
              <Button variant="outline" size="sm">View Analysis</Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(resume._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      <div className="md:col-span-2 lg:col-span-3 mt-8">
        <h3 className="text-lg font-medium mb-4">Upload New</h3>
        <UploadResume onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
