import { useState } from 'react';
import { NewExpedicionForm } from './NewExpedicionForm';
import type { Expedicion } from '../types';
import { COLORS, TOUCH } from '../theme';

interface Props {
  expeditions: Expedicion[];
  setExpeditions: React.Dispatch<React.SetStateAction<Expedicion[]>>;
  showNotif: (msg: string) => void;
  onSelectExp: (id: string) => void;
}

export function Expediciones({
  expeditions,
  setExpeditions,
  showNotif,
  onSelectExp,
}: Props) {
  const [showForm, setShowForm] = useState(false);

  function handleSave(exp: Expedicion) {
    setExpeditions((prev) => [exp, ...prev]);
    setShowForm(false);
    showNotif('🧭 Expedición iniciada');
  }

  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setShowForm((v) => !v)}
          className="touch-cta"
          style={{
            fontSize: TOUCH.FONT_ACTION,
            padding: '10px 18px',
            borderRadius: 20,
            background: COLORS.INFO_FG,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          + Nueva
        </button>
      </div>

      {showForm && (
        <NewExpedicionForm
          expeditions={expeditions}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {expeditions.map((exp) => (
          <button
            key={exp.id}
            onClick={() => onSelectExp(exp.id)}
            style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: 12,
              padding: '12px 14px',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-main)',
                }}
              >
                {exp.nombre}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background:
                    exp.estado === 'En progreso'
                      ? COLORS.WARN_BG
                      : COLORS.OK_BG,
                  color:
                    exp.estado === 'En progreso'
                      ? COLORS.WARN_FG
                      : COLORS.OK_FG,
                  fontWeight: 700,
                }}
              >
                {exp.estado}
              </span>
            </div>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 12,
                color: 'var(--text-sec)',
              }}
            >
              {exp.zona} · {exp.tipoTerreno}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-sec)' }}>
              👤 {exp.guardabosque} · 📅 {exp.fecha} · 📸 {exp.registros} reg.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
