import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './NamePetPage.css';

type NamePetPageProps = {
  initialName?: string;
  onSubmit?: (name: string) => void;
};

export default function NamePetPage({
  initialName = '',
  onSubmit,
}: NamePetPageProps) {
  const [name, setName] = React.useState<string>(initialName);

  const navigate = useNavigate();
  const [params] = useSearchParams();

  // egg comes from /name?egg=2
  const egg = params.get('egg') ?? '2';

  const canSubmit = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const finalName = name.trim();
    onSubmit?.(finalName);

    // ✅ MUST match your App.tsx route
    navigate(
      `/dashboard?egg=${encodeURIComponent(egg)}&name=${encodeURIComponent(finalName)}`
    );
  };

  return (
    <div className="namepet-container">
      <main className="namepet-card">
        <h1 className="namepet-title">
          Choose a name for{' '}
          <span className="namepet-title-accent">your friend</span>
        </h1>

        <p className="namepet-subtitle">
          You won’t be able to change the name in the future
        </p>

        <form className="namepet-form" onSubmit={handleSubmit}>
          <input
            className="namepet-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type the name here..."
            aria-label="Pet name"
          />

          <button className="namepet-next" type="submit" disabled={!canSubmit}>
            Next
          </button>
        </form>
      </main>
    </div>
  );
}
