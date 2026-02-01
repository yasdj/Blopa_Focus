import { useState } from 'react';
import { healthService, geminiService } from '../api/services';

export default function TestGeminiPage() {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [userMessage, setUserMessage] = useState<string>('I studied for 30 minutes');
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Test Health Check
  const testHealth = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await healthService.check();
      setHealthStatus(`✅ Backend: ${response.message}`);
    } catch (err: any) {
      setError(`❌ Health check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test Gemini Text Analysis
  const testGemini = async () => {
    try {
      setLoading(true);
      setError('');
      setGeminiResponse(null);

      const response = await geminiService.analyzeText({
        user_message: userMessage,
        user_settings: { level: 1, streak: 5 }
      });

      setGeminiResponse(response);
    } catch (err: any) {
      setError(`❌ Gemini failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test Page - Gemini Integration</h1>

      {/* Health Check Test */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>1. Test Backend Connection</h2>
        <button 
          onClick={testHealth} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: '10px' }}
        >
          Test Health Check
        </button>
        {healthStatus && <p style={{ color: 'green', fontWeight: 'bold' }}>{healthStatus}</p>}
      </div>

      {/* Gemini Test */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>2. Test Gemini Analysis</h2>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <strong>User Message:</strong>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Describe what you did (e.g., 'I studied for 30 minutes')"
          />
        </label>

        <button 
          onClick={testGemini} 
          disabled={loading || !userMessage.trim()}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Analyzing...' : 'Test Gemini'}
        </button>

        {geminiResponse && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
            <h3>✅ Gemini Response:</h3>
            <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(geminiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📝 Test Instructions:</h3>
        <ol>
          <li>Click "Test Health Check" to verify backend is running</li>
          <li>Modify the user message if needed</li>
          <li>Click "Test Gemini" to send request to Gemini API</li>
          <li>Check the response for tasks, time, and mood</li>
        </ol>
      </div>
    </div>
  );
}
