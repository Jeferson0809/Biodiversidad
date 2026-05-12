import { StatCard } from '../components/StatCard';
import { Mapa } from './Mapa';
import type { Expedicion, RegistroBiologico } from '../types';
import { DEGRADATION_TYPES } from '../mockData';
import { COLORS } from '../theme';

interface Props {
  records: RegistroBiologico[];
  expeditions: Expedicion[];
}

export function Dashboard({ records, expeditions }: Props) {
  const pendingCount = records.filter((r) => r.sync !== 'sync').length;

  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <StatCard
          label="Registros"
          value={records.length}
          sub={`${pendingCount} pendientes`}
          color={COLORS.INFO_FG}
        />
        <StatCard
          label="Especies"
          value={records.filter((r) => r.tipo === 'especie').length}
          sub="avistadas"
          color={COLORS.PRIMARY_DARK}
        />
        <StatCard
          label="Focos"
          value={records.filter((r) => r.tipo === 'degradacion').length}
          sub="detectados"
          color={COLORS.WARN_FG}
        />
        <StatCard
          label="Expediciones"
          value={expeditions.length}
          sub={`${expeditions.filter((e) => e.estado === 'En progreso').length} activas`}
          color="#533ab7"
        />
      </div>

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-sec)',
          margin: '0 0 6px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Mapa interactivo — Santurbán
      </p>
      <Mapa records={records} />

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-sec)',
          margin: '14px 0 8px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Degradación por tipo
      </p>
      {DEGRADATION_TYPES.map((tipo) => {
        const count = records.filter((r) => r.degradacion === tipo).length;
        const pct = records.length > 0 ? (count / records.length) * 100 : 0;
        return (
          <div
            key={tipo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-sec)',
                width: 130,
                flexShrink: 0,
              }}
            >
              {tipo}
            </span>
            <div
              style={{
                flex: 1,
                height: 7,
                background: 'var(--border)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: count > 0 ? COLORS.ACCENT_ORANGE : 'transparent',
                  borderRadius: 4,
                  transition: 'width 0.4s',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-sec)',
                width: 16,
                textAlign: 'right',
                fontWeight: 600,
              }}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
