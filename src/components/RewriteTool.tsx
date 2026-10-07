'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function RewriteTool() {
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleRewrite = async () => {
    if (!originalText) {
      setError('Please provide text to rewrite');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rewrite text');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.suggestedText) {
      navigator.clipboard.writeText(result.suggestedText);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>AI Resume Rewriter</CardTitle>
        <CardDescription>Paste a weak bullet point or section to get an impactful, action-oriented version.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="e.g., I worked on a team that made the database faster." 
          className="min-h-[100px]"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
        />
        <Button onClick={handleRewrite} disabled={loading} className="w-full md:w-auto">
          {loading ? 'Rewriting...' : 'Rewrite Text'}
        </Button>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted rounded-md border">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Suggested Text</p>
              <p className="text-lg">{result.suggestedText}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-md border border-primary/20 text-primary-foreground">
              <p className="text-sm font-semibold text-primary mb-1">Why this is better:</p>
              <p className="text-primary">{result.explanation}</p>
            </div>
            <Button variant="outline" onClick={copyToClipboard}>Copy Suggestion</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
