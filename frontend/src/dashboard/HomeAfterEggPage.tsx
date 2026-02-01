import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './HomeAfterEggPage.css';

type EggId = 1 | 2 | 3;

function eggSrcFromId(egg: EggId) {
  if (egg === 1) return '/assets/oeuf1.png';
  if (egg === 2) return '/assets/oeuf2.png';
  return '/assets/oeuf3.png';
}

export default function HomeAfterEggPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const eggParam = params.get('egg');
  const eggId: EggId =
    eggParam === '1' || eggParam === '2' || eggParam === '3'
      ? (Number(eggParam) as EggId)
      : 2;

  const petName = (params.get('name') || 'Pablo').trim();
  const eggSrc = eggSrcFromId(eggId);

  // ✅ you need user_id for validation (store in URL or localStorage)
  const userId =
    params.get('user_id') ||
    localStorage.getItem('user_id') ||
    '769aba1e47e049efa7ecfd1e4b1b4159';

  // Parse tasks from URL once, then store in state (so we can remove tasks)
  const tasksParam = params.get('tasks');
  const [tasks, setTasks] = React.useState<string[]>(() => {
    try {
      return tasksParam ? JSON.parse(tasksParam) : [];
    } catch {
      return [];
    }
  });

  const [progress] = React.useState<number>(6);

  // ---------------------------
  // Modal state
  // ---------------------------
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string>('');
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState<
    number | null
  >(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const [validationMsg, setValidationMsg] = React.useState<string>('');
  const [validationOk, setValidationOk] = React.useState<boolean | null>(null);

  const hasTasks = tasks.length > 0;

  function openTaskModal(task: string, idx: number) {
    setSelectedTask(task);
    setSelectedTaskIndex(idx);
    setFile(null);
    setPreviewUrl('');
    setValidationMsg('');
    setValidationOk(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedTask('');
    setSelectedTaskIndex(null);
    setFile(null);
    setPreviewUrl('');
    setValidationMsg('');
    setValidationOk(null);
    setLoading(false);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setValidationMsg('');
    setValidationOk(null);
  }

  async function submitProof() {
    if (!userId) {
      setValidationOk(false);
      setValidationMsg('Missing user_id. Log in again 😭');
      return;
    }

    if (!file) {
      setValidationOk(false);
      setValidationMsg('Please upload a photo first.');
      return;
    }

    setLoading(true);
    setValidationMsg('');
    setValidationOk(null);

    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('task', selectedTask);
      formData.append('image', file);

      const res = await fetch('http://127.0.0.1:8000/tasks/validate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationOk(false);
        setValidationMsg(data?.detail || 'Validation failed.');
        return;
      }

      // Expected: { valid: boolean, reason: string, confidence: number }
      const valid = Boolean(data?.valid);
      const reason = data?.reason || 'No reason.';
      const confidence =
        typeof data?.confidence === 'number' ? data.confidence : 0;

      if (valid) {
        setValidationOk(true);
        setValidationMsg(
          `✅ Valid! ${reason} (conf: ${confidence.toFixed(2)})`
        );

        // ✅ Remove the task from UI list
        if (selectedTaskIndex !== null) {
          setTasks((prev) => prev.filter((_, i) => i !== selectedTaskIndex));
        }

        // close after a tiny delay so user sees success
        setTimeout(() => closeModal(), 700);
      } else {
        setValidationOk(false);
        setValidationMsg(
          `❌ Not valid: ${reason} (conf: ${confidence.toFixed(2)})`
        );
      }
    } catch (err) {
      setValidationOk(false);
      setValidationMsg('Network error while validating.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="homeegg-container">
      <div className="homeegg-grid">
        {/* LEFT: Pet card */}
        <section className="homeegg-card homeegg-card--pet">
          <div className="homeegg-petHeader">
            <h2 className="homeegg-petTitle">Hi, it’s {petName} !</h2>
            <p className="homeegg-petSub">I feel great today.</p>
          </div>

          <div className="homeegg-eggWrap">
            <img className="homeegg-eggImg" src={eggSrc} alt="Your egg" />
          </div>

          <h3 className="homeegg-hatchText">
            Complete a task to hatch your egg
          </h3>

          <div className="homeegg-progress" aria-label="Hatch progress">
            <div
              className="homeegg-progressFill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="homeegg-progressKnob"
              style={{ left: `${progress}%` }}
            />
          </div>

          <button
            className="homeegg-primaryBtn"
            type="button"
            onClick={() => navigate('/tasks/new')}
          >
            Set up your tasks
          </button>
        </section>

        {/* RIGHT: Tasks card */}
        <section className="homeegg-card homeegg-card--tasks">
          <h2 className="homeegg-tasksTitle">Your tasks today</h2>

          {!hasTasks ? (
            <div className="homeegg-empty">
              <div className="homeegg-emptyIcon" aria-hidden="true">
                <span className="homeegg-warningTri" />
                <span className="homeegg-warningLine1" />
                <span className="homeegg-warningLine2" />
              </div>

              <p className="homeegg-emptyText">
                There is no task at the moment...
              </p>
              <p className="homeegg-emptyText2">
                Set up your tasks so you can
                <br />
                feed your companion
              </p>
            </div>
          ) : (
            <div className="homeegg-taskList">
              {tasks.map((task, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="homeegg-taskItem"
                  onClick={() => openTaskModal(task, idx)}
                >
                  <p className="homeegg-taskText">{task}</p>
                  <span className="homeegg-taskHint">
                    Tap to submit proof 📸
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="homeegg-modalOverlay" onClick={closeModal}>
          <div className="homeegg-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="homeegg-modalTitle">Submit proof</h3>
            <p className="homeegg-modalTask">{selectedTask}</p>

            <input type="file" accept="image/*" onChange={onPickFile} />

            {previewUrl && (
              <div className="homeegg-previewWrap">
                <img
                  className="homeegg-previewImg"
                  src={previewUrl}
                  alt="preview"
                />
              </div>
            )}

            {validationMsg && (
              <p
                className={
                  validationOk === true
                    ? 'homeegg-validation homeegg-validation--ok'
                    : 'homeegg-validation homeegg-validation--bad'
                }
              >
                {validationMsg}
              </p>
            )}

            <div className="homeegg-modalActions">
              <button
                className="homeegg-secondaryBtn"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="homeegg-primaryBtn"
                type="button"
                onClick={submitProof}
                disabled={loading}
              >
                {loading ? 'Validating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
