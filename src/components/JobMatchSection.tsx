'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function JobMatchSection({ resumeId }: { resumeId: string }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<any>(null);

  const handleMatch = async () => {
    if (!jobTitle || !jobDescription) {
      setError('Please provide both job title and description');
      return;
    }

    setLoading(true);
    setError(null);
    setJobAnalysis(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, jobDescription })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to match job');

      setJobAnalysis(data.jobAnalysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Compare with a Job Description</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Paste a job description to see how well your resume matches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Job Title (e.g., Software Engineer)" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
          />
          <Textarea 
            placeholder="Paste the full job description here..." 
            className="min-h-[150px]"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button onClick={handleMatch} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Analyzing Match...' : 'Calculate Match Score'}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {jobAnalysis && (
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Match Score for {jobAnalysis.jobTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-primary">{jobAnalysis.matchScore}/100</div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Matched Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.matchedSkills.map((item: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{item}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Missing Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.missingSkills.map((item: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">{item}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {jobAnalysis.recommendations.map((item: string, i: number) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
