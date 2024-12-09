'use client'
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testGemini = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/test-gemini');
      const data = await res.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      setStatus('success');
      setResponse(data.response);
      setError('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to test Gemini');
    }
  };

  return (
    <div className="p-8">
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <h1 className="text-xl font-bold text-white mb-4">Gemini API Test</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={testGemini}
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? 'Testing...' : 'Test Gemini Connection'}
          </Button>

          {status === 'success' && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-green-400 font-medium mb-2">Success!</h3>
              <p className="text-green-300">Response: {response}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h3 className="text-red-400 font-medium mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 