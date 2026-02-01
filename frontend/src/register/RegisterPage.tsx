// RegisterPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { authService } from '../api/services';

type RegisterPageProps = {
  logoSrc?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
};

export default function RegisterPage({
  logoSrc = '/assets/logo2.png',
  onSubmit,
}: RegisterPageProps) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const passwordsMatch =
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  const canSubmit =
    email.trim().length > 0 &&
    name.trim().length > 0 &&
    password.trim().length > 0 &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setLoading(true);

    try {
      onSubmit?.({ email, password });

      const res = await authService.register({
        email,
        mdp: password,
        name,
        filepath: 'oeuf' + Math.floor(Math.random() * 3) + 1,
      });

      localStorage.setItem('auth', JSON.stringify(res));

      // ✅ Go directly to dashboard after register
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Register failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <header className="register-header">
        <h1 className="register-title">
          <span className="register-title-welcome">Welcome</span>{' '}
          <span className="register-title-to">to</span>
          <span className="register-title-dots">...</span>
        </h1>

        <div className="register-logo-wrapper">
          <img className="register-logo" src={logoSrc} alt="Blopa Focus" />
        </div>
      </header>

      <main className="register-card">
        <h2 className="register-subtitle">
          <span className="register-subtitle-left">Meet your</span>{' '}
          <span className="register-subtitle-right">friend !</span>
        </h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label" htmlFor="email">
            Email
          </label>
          <div className="register-input-group">
            <span className="register-input-icon">
              <MailIcon />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
            />
          </div>

          <label className="register-label" htmlFor="name">
            Name
          </label>
          <div className="register-input-group">
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
            />
          </div>

          <label className="register-label" htmlFor="password">
            Password
          </label>
          <div className="register-input-group">
            <span className="register-input-icon">
              <LockIcon />
            </span>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Choose your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
            />
          </div>

          <label className="register-label" htmlFor="confirmPassword">
            Password
          </label>
          <div className="register-input-group">
            <span className="register-input-icon">
              <LockIcon />
            </span>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="register-input"
            />
          </div>

          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="register-error">Passwords do not match.</p>
          )}

          {error && <p className="register-error">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="register-button"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="register-footer">
            Already have an account?{' '}
            <Link className="register-login-link" to="/login">
              Login here
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
      className="register-icon"
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
      className="register-icon"
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
