import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyTaskPage.css';
import { verifyService } from '../api/services'; // ✅ adjust path if needed

type VerifyTaskPageProps = {
  initialTask?: string;
  petName?: string; // optional, defaults to "Pablo"
  onSubmit?: (data: { task: string; file: File }) => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null && 'message' in err) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === 'string') return maybeMsg;
  }

  return 'Unknown error';
}

function getUserIdFromStorage(): string | null {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;

    const p = parsed as Record<string, unknown>;
    const directId = p.user_id;
    if (typeof directId === 'string') return directId;

    const user = p.user;
    if (typeof user === 'object' && user !== null) {
      const u = user as Record<string, unknown>;
      if (typeof u.user_id === 'string') return u.user_id;
      if (typeof u.id === 'string') return u.id;
      if (typeof u.mongodb_id === 'string') return u.mongodb_id;
    }

    return null;
  } catch {
    return null;
  }
}

export default function VerifyTaskPage({
  initialTask = '',
  petName = 'Pablo',
  onSubmit,
}: VerifyTaskPageProps) {
  const [task, setTask] = React.useState<string>(initialTask);
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Preview image
  React.useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Close modal with ESC
  React.useEffect(() => {
    if (!showSuccess) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSuccess(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showSuccess]);

  const canSubmit = task.trim().length > 0 && !!file && !loading;

  const pickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;
    setFile(selected);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !file) return;

    onSubmit?.({
      task: task.trim(),
      file,
    });

    try {
      setLoading(true);
      setError('');

      const userId = getUserIdFromStorage();
      if (!userId) {
        setError('No user_id found. Please login again.');
        return;
      }

      const res = await verifyService.verify({
        user_id: userId,
        task: task.trim(),
        file,
      });

      // If your backend returns { verified: true/false }
      if (res.verified === false) {
        setError(res.message ?? 'Task not verified. Try another photo.');
        return;
      }

      setShowSuccess(true);
    } catch (err: unknown) {
      setError(`Failed to verify task: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccess(false);
    navigate('/dashboard');
  };

  return (
    <div className="verify-container">
      <main className="verify-card">
        <h1 className="verify-title">
          <span className="verify-title-blue">
            Hm.. Let’s see if you really completed your task !
          </span>{' '}
        </h1>

        <form className="verify-form" onSubmit={handleSubmit}>
          <label className="verify-label" htmlFor="task">
            What is the task you completed ?
          </label>

          <input
            id="task"
            className="verify-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Open my calculus PDF"
          />

          <p className="verify-help">
            Proof time! Upload a photo showing you completed the task (include
            the object involved).
          </p>

          {/* Hidden file input */}
          <input
            ref={inputRef}
            className="verify-fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Upload area */}
          <button
            type="button"
            className="verify-dropzone"
            onClick={pickFile}
            aria-label="Upload a photo"
          >
            {!previewUrl ? (
              <div className="verify-dropInner">
                <UploadIcon />
                <div className="verify-dropText">Add a photo</div>
              </div>
            ) : (
              <div className="verify-previewWrap">
                <img
                  className="verify-previewImg"
                  src={previewUrl}
                  alt="Selected proof"
                />
                <div className="verify-changeHint">Click to change</div>
              </div>
            )}
          </button>

          {error && (
            <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button className="verify-button" type="submit" disabled={!canSubmit}>
            {loading ? 'Verifying...' : 'Verify task'}
          </button>
        </form>
      </main>

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div
          className="success-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Task verified"
          onClick={() => setShowSuccess(false)}
        >
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-content">
              <div className="success-textTop">Yay! good job.</div>

              <div className="success-textMain">
                {petName} was waiting for you... now he can eat!
              </div>

              <div className="success-checkWrap" aria-hidden="true">
                <div className="success-checkCircle">
                  <CheckIcon />
                </div>
              </div>

              <button
                type="button"
                className="success-closeBtn"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Icons ---------- */

function UploadIcon() {
  return (
    <svg
      className="verify-uploadIcon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 16.5V7.5A2.5 2.5 0 0 1 6.5 5h8.2a2.5 2.5 0 0 1 1.77.73l2.8 2.8A2.5 2.5 0 0 1 22 10.3v6.2A2.5 2.5 0 0 1 19.5 19h-13A2.5 2.5 0 0 1 4 16.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 15.5 10.2 12.8a1.2 1.2 0 0 1 1.7 0l2 2 1-1a1.2 1.2 0 0 1 1.7 0l2.3 2.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.7 6.2V3.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.45 4.95h2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="success-checkIcon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 7.5 10.5 17 4 10.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
