import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksService } from '../api/services';
import './NewMicroGoalPage.css';

type EnergyLevel = 'Low' | 'Medium' | 'High';
type Mood = 'OK :/' | 'Happy :)' | 'Stressed :(' | 'Tired zZ' | 'Motivated!';

type NewMicroGoalPageProps = {
  onSubmit?: (data: {
    goal: string;
    energy: EnergyLevel;
    mood: Mood;
    minutes: number;
  }) => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null && 'message' in err) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === 'string') return maybeMsg;
  }

  return 'Unknown error';
}

function mapEnergyToBackend(energy: EnergyLevel): string {
  // backend expects: "low" | "medium" | "high"
  return energy.toLowerCase();
}

function mapMoodToBackend(mood: Mood): string {
  // backend expects strings like: "stressed"
  // Map your UI labels to backend values.
  switch (mood) {
    case 'Stressed :(':
      return 'stressed';
    case 'Tired zZ':
      return 'tired';
    case 'Happy :)':
      return 'happy';
    case 'Motivated!':
      return 'motivated';
    case 'OK :/':
    default:
      return 'ok';
  }
}

function getUserIdFromStorage(): string | null {
  // Based on earlier: you store "auth" in localStorage.
  // Try to find a user id in a few common shapes.
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;

    if (typeof parsed === 'object' && parsed !== null) {
      const p = parsed as Record<string, unknown>;

      // common patterns
      const user = p.user as Record<string, unknown> | undefined;
      const directId = p.user_id;

      if (typeof directId === 'string') return directId;

      if (user) {
        if (typeof user.user_id === 'string') return user.user_id;
        if (typeof user.id === 'string') return user.id;
        if (typeof user.mongodb_id === 'string') return user.mongodb_id;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function NewMicroGoalPage({ onSubmit }: NewMicroGoalPageProps) {
  const navigate = useNavigate();
  const [goal, setGoal] = React.useState<string>('');
  const [energy, setEnergy] = React.useState<EnergyLevel>('Medium');
  const [mood, setMood] = React.useState<Mood>('OK :/');
  const [minutes, setMinutes] = React.useState<string>('10');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const canSubmit = goal.trim().length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const parsedMinutes = Math.max(1, Number(minutes || 0));
    const finalMinutes = Number.isFinite(parsedMinutes) ? parsedMinutes : 10;

    onSubmit?.({
      goal: goal.trim(),
      energy,
      mood,
      minutes: finalMinutes,
    });

    try {
      setLoading(true);
      setError('');

      const userId = getUserIdFromStorage();
      if (!userId) {
        setError('No user_id found. Please login again.');
        return;
      }

      const payload = {
        user_id: userId,
        context: goal.trim(),
        time: finalMinutes,
        mood: mapMoodToBackend(mood),
        energy_level: mapEnergyToBackend(energy),
      };

      const backendResponse = await tasksService.generate(payload);

      const params = new URLSearchParams({
        egg: '2',
        name: 'Blopa',
        tasks: JSON.stringify(backendResponse.tasks),
      });

      navigate(`/dashboard?${params.toString()}`);
    } catch (err: unknown) {
      setError(`Failed to get micro-goal: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="microgoal-container">
      <main className="microgoal-card">
        <h1 className="microgoal-title">
          <span className="microgoal-title-blue">New</span>{' '}
          <span className="microgoal-title-gray">Micro–</span>
          <span className="microgoal-title-orange">Goal</span>
        </h1>

        <form className="microgoal-form" onSubmit={handleSubmit}>
          {/* Goal */}
          <label className="microgoal-label" htmlFor="goal">
            What do you want to work on?
          </label>
          <input
            id="goal"
            className="microgoal-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., study calculus, write my report"
          />

          {/* Two columns */}
          <div className="microgoal-row2">
            <div className="microgoal-field">
              <label className="microgoal-label" htmlFor="energy">
                Energy Level
              </label>
              <select
                id="energy"
                className="microgoal-select"
                value={energy}
                onChange={(e) => setEnergy(e.target.value as EnergyLevel)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="microgoal-field">
              <label className="microgoal-label" htmlFor="mood">
                Mood
              </label>
              <select
                id="mood"
                className="microgoal-select"
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
              >
                <option value="OK :/">OK :/</option>
                <option value="Happy :)">Happy :)</option>
                <option value="Motivated!">Motivated!</option>
                <option value="Tired zZ">Tired zZ</option>
                <option value="Stressed :(">Stressed :(</option>
              </select>
            </div>
          </div>

          {/* Minutes */}
          <label className="microgoal-label" htmlFor="minutes">
            Time Available (minutes)
          </label>
          <input
            id="minutes"
            className="microgoal-input"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="10"
          />

          <button
            className="microgoal-button"
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? 'Getting Micro–Goal...' : 'Get My Micro–Goal'}
          </button>

          {error && (
            <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
              {error}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
