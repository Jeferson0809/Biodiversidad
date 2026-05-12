import { Badge } from '../components/Badge';
import type { Expedicion, RegistroBiologico } from '../types';
import { COLORS } from '../theme';

interface Props {
  expedicion: Expedicion;
  records: RegistroBiologico[];
  onVolver: () => void;
}

export function ExpedicionDetalle({ expedicion, records, onVolver }: Props) {
  const propios = records.filter((r) => r.expedicion === expedicion.id);

  return (
    <div style={{ padding: '0 12px 80px' }}>
      {/* Header de la expedición */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border)',
          borderRadius: 14,
          padding: '14px',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-main)',
              flex: 1,
            }}
          >
            {expedicion.nombre}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              background:
                expedicion.estado === 'En progreso'
                  ? COLORS.WARN_BG
                  : COLORS.OK_BG,
              color:
                expedicion.estado === 'En progreso'
                  ? COLORS.WARN_FG
                  : COLORS.OK_FG,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {expedicion.estado}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 12px',
            fontSize: 12,
            color: 'var(--text-sec)',
          }}
        >
          <span>📍 {expedicion.zona}</span>
          <span>🏔 {expedicion.tipoTerreno}</span>
          <span>📅 {expedicion.fecha}</span>
          <span>👤 {expedicion.guardabosque}</span>
          <span>🛣 {expedicion.ruta}</span>
          <span>📸 {propios.length} registros</span>
        </div>
      </div>

      {/* Lista de registros de esta expedición */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-sec)',
          margin: '0 0 8px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Registros capturados
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {propios.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-sec)',
              fontSize: 13,
              padding: '24px 0',
            }}
          >
            Sin registros en esta expedición aún.
          </p>
        )}
        {propios.map((rec) => (
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

      {/* Botón Volver */}
      <button
        onClick={onVolver}
        className="touch-cta"
        style={{
          marginTop: 20,
          width: '100%',
          padding: '14px',
          borderRadius: 12,
          border: `1.5px solid ${COLORS.PRIMARY_DARK}`,
          background: 'transparent',
          color: COLORS.PRIMARY_DARK,
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        ← Volver a expediciones
      </button>
    </div>
  );
}
