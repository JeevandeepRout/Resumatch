'use client';

import { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { JobMatchSection } from '@/components/JobMatchSection';

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // First try to GET existing analysis
      let res = await fetch(`/api/resumes/${id}/analyze`);
      if (res.status === 404) {
        // Not found, we must trigger POST to analyze
        res = await fetch(`/api/resumes/${id}/analyze`, { method: 'POST' });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch analysis');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrAnalyze();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-4xl flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-semibold">Analyzing your resume...</h2>
        <p className="text-muted-foreground">Our AI is reading and scoring your experience.</p>
        <Progress value={null} className="w-full max-w-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={fetchOrAnalyze}>Try Again</Button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Resume Analysis Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-primary-foreground text-center flex flex-col justify-center py-6">
          <CardTitle className="text-lg">Overall Score</CardTitle>
          <div className="text-6xl font-bold mt-2">{analysis.overallScore}</div>
        </Card>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analysis.skillsScore}/100</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Experience</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analysis.experienceScore}/100</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Projects</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analysis.projectsScore}/100</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Keywords</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analysis.keywordsScore}/100</div></CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.strengths.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.weaknesses.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Skills / Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((item: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actionable Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.suggestions.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
