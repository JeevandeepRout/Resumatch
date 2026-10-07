'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function UploadResume({ onUploadSuccess }: { onUploadSuccess?: (resumeId: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Resume uploaded and parsed successfully!');
      if (onUploadSuccess) onUploadSuccess(data.resumeId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>Upload your PDF or DOCX file (Max 5MB).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Input type="file" accept=".pdf,.docx" onChange={handleFileChange} disabled={loading} />
        <Button className="w-full" onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Uploading & Analyzing...' : 'Upload'}
        </Button>
      </CardContent>
    </Card>
  );
}
