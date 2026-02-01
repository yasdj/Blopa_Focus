// LoginPage.tsx (React + CSS + TSX)
// Put your logo at: /public/assets/logo2.png

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { authService } from '../api/services';

type LoginPageProps = {
  logoSrc?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
};

export default function LoginPage({
  logoSrc = '/assets/logo2.png',
  onSubmit,
}: LoginPageProps) {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const canSubmit =
    email.trim().length > 0 && password.trim().length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setLoading(true);

    try {
      onSubmit?.({ email, password });

      const res = await authService.login({ email, password });
      localStorage.setItem('auth', JSON.stringify(res));

      // ✅ Go directly to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1 className="login-title">
          <span className="login-title-welcome">Welcome</span>{' '}
          <span className="login-title-welcome">to</span>
          <span className="login-title-dots">...</span>
        </h1>

        <div className="login-logo-wrapper">
          <img className="login-logo" src={logoSrc} alt="Blopa Focus" />
        </div>
      </header>

      <main className="login-card">
        <h2 className="login-subtitle">You friend misses you :(</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            Email
          </label>

          <div className="login-input-group">
            <span className="login-input-icon">
              <MailIcon />
            </span>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <label className="login-label" htmlFor="password">
            Password
          </label>

          <div className="login-input-group">
            <span className="login-input-icon">
              <LockIcon />
            </span>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={!canSubmit} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="login-footer">
            Don't have an account?{' '}
            <Link className="login-register-link" to="/register">
              Register here
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

/* ---------- Icons (TSX) ---------- */

function MailIcon(): React.ReactNode {
  return (
    <svg
      className="login-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 7.5 12 12l5.5-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon(): React.ReactNode {
  return (
    <svg
      className="login-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 10V8.5A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 4.5 4.5V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10h11A2.5 2.5 0 0 1 20 12.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A2.5 2.5 0 0 1 6.5 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 14.2v2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
