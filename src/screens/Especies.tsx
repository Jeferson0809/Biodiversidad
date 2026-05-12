import type { RegistroBiologico } from '../types';
import { SPECIES } from '../mockData';
import { COLORS } from '../theme';

const ESTADO_COLORS: Record<
  string,
  { bg: string; color: string }
> = {
  'En peligro': { bg: COLORS.DANGER_BG, color: COLORS.DANGER_FG },
  Vulnerable: { bg: COLORS.WARN_BG, color: COLORS.WARN_FG },
  'Casi amenazado': { bg: COLORS.INFO_BG, color: COLORS.INFO_FG },
  'Preocupación menor': { bg: COLORS.OK_BG, color: COLORS.OK_FG },
};

interface Props {
  records: RegistroBiologico[];
}

export function Especies({ records }: Props) {
  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SPECIES.map((s) => {
          const count = records.filter(
            (r) => r.especie === s.nombre_comun,
          ).length;
          const ec = ESTADO_COLORS[s.estado] ?? {
            bg: '#f0f0f0',
            color: '#888',
          };
          return (
            <div
              key={s.id}
              style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: '0 0 2px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  {s.nombre_comun}
                </p>
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: 12,
                    color: 'var(--text-sec)',
                    fontStyle: 'italic',
                  }}
                >
                  {s.nombre_cientifico}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: ec.bg,
                    color: ec.color,
                    fontWeight: 700,
                  }}
                >
                  {s.estado}
                </span>
              </div>
              <div style={{ textAlign: 'right', paddingLeft: 12 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.INFO_FG,
                  }}
                >
                  {count}
                </p>
                <p
                  style={{ margin: 0, fontSize: 11, color: 'var(--text-sec)' }}
                >
                  avistamientos
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
