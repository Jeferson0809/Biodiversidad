import { useState } from 'react';
import { Badge } from '../components/Badge';
import { NewRecordForm } from './NewRecordForm';
import type { Expedicion, RegistroBiologico, TipoRegistro } from '../types';
import { COLORS, TOUCH } from '../theme';

type Filtro = 'todos' | TipoRegistro;

interface Props {
  records: RegistroBiologico[];
  setRecords: React.Dispatch<React.SetStateAction<RegistroBiologico[]>>;
  expeditions: Expedicion[];
  showNotif: (msg: string) => void;
}

export function Registros({ records, setRecords, expeditions, showNotif }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [showForm, setShowForm] = useState(false);

  const filtered =
    filtro === 'todos' ? records : records.filter((r) => r.tipo === filtro);

  function handleSave(
    data: Omit<RegistroBiologico, 'id' | 'fecha' | 'hora'>,
  ) {
    const rec: RegistroBiologico = {
      id: Date.now(),
      // FIX B4: .split('T')[0] para obtener sólo YYYY-MM-DD
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      foto: 'placeholder',
      ...data,
    };
    setRecords((prev) => [rec, ...prev]);
    setShowForm(false);
    showNotif('✅ Registro guardado');
  }

  const filtros: { id: Filtro; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'especie', label: '🌿 Especies' },
    { id: 'degradacion', label: '⚠️ Focos' },
    { id: 'riesgo', label: '🚨 Riesgos' },
  ];

  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className="touch-pill"
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 20,
                border: '0.5px solid var(--border)',
                background: filtro === f.id ? COLORS.PRIMARY_DARK : 'var(--bg-card)',
                color: filtro === f.id ? 'white' : 'var(--text-sec)',
                cursor: 'pointer',
                fontWeight: filtro === f.id ? 700 : 500,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="touch-cta"
          style={{
            fontSize: TOUCH.FONT_ACTION,
            padding: '10px 16px',
            borderRadius: 20,
            background: COLORS.PRIMARY_DARK,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          + Nuevo
        </button>
      </div>

      {showForm && (
        <NewRecordForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          expeditions={expeditions}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-sec)',
              fontSize: 13,
              padding: '24px 0',
            }}
          >
            Sin registros en este filtro.
          </p>
        )}
        {filtered.map((rec) => (
          <div
            key={rec.id}
            style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  flex: 1,
                }}
              >
                {rec.tipo === 'especie'
                  ? '🌿 ' + (rec.especie ?? 'Especie')
                  : rec.tipo === 'riesgo'
                    ? '🚨 ' + (rec.degradacion ?? 'Riesgo')
                    : '⚠️ ' + (rec.degradacion ?? 'Degradación')}
              </span>
              <Badge status={rec.sync} />
            </div>

            {rec.severidad && (
              <span
                style={{
                  fontSize: 12,
                  padding: '2px 9px',
                  borderRadius: 20,
                  background:
                    rec.severidad === 'Crítica'
                      ? COLORS.DANGER_BG
                      : COLORS.WARN_BG,
                  color:
                    rec.severidad === 'Crítica'
                      ? COLORS.DANGER_FG
                      : COLORS.WARN_FG,
                  display: 'inline-block',
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {rec.severidad}
              </span>
            )}

            <p
              style={{
                margin: '2px 0 6px',
                fontSize: 13,
                color: 'var(--text-sec)',
                lineHeight: 1.4,
              }}
            >
              {rec.notas || 'Sin notas'}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-sec)' }}>
              📍 {rec.lat.toFixed(3)}, {Math.abs(rec.lng).toFixed(3)} · ⛰{' '}
              {rec.altitud} m · {rec.fecha} {rec.hora}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
