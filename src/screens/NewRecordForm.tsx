import { useState, type CSSProperties } from 'react';
import type {
  Expedicion,
  Severidad,
  SyncState,
  TipoRegistro,
} from '../types';
import {
  DEGRADATION_TYPES,
  RIESGO_TYPES,
  SEVERIDADES,
  SPECIES,
} from '../mockData';
import { COLORS, TOUCH } from '../theme';

interface SaveData {
  tipo: TipoRegistro;
  especie: string | null;
  degradacion: string | null;
  severidad: Severidad | null;
  lat: number;
  lng: number;
  altitud: number;
  notas: string;
  expedicion: string;
  sync: SyncState;
}

interface Props {
  onSave: (data: SaveData) => void;
  onCancel: () => void;
  expeditions: Expedicion[];
}

const inpStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  fontSize: 15,
  padding: '10px 12px',
  border: '0.5px solid var(--border)',
  borderRadius: 10,
  background: 'var(--bg-main)',
  color: 'var(--text-main)',
  minHeight: 44,
};

export function NewRecordForm({ onSave, onCancel, expeditions }: Props) {
  const [tipo, setTipo] = useState<TipoRegistro>('especie');

  // FIX B1: SPECIES es array → tomar el primer nombre_comun.
  const [especie, setEspecie] = useState<string>(SPECIES[0].nombre_comun);

  // FIX B2: DEGRADATION_TYPES es array → tomar el primer string.
  const [degradacion, setDegradacion] = useState<string>(DEGRADATION_TYPES[0]);
  const [riesgo, setRiesgo] = useState<string>(RIESGO_TYPES[0]);

  const [severidad, setSeveridad] = useState<Severidad>('Media');
  const [lat, setLat] = useState('7.110');
  const [lng, setLng] = useState('-72.830');
  const [altitud, setAltitud] = useState('3400');
  const [notas, setNotas] = useState('');

  // FIX B3: expeditions es array → [0]?.id
  const [expedicion, setExpedicion] = useState<string>(
    expeditions[0]?.id ?? '',
  );
  const [offline, setOffline] = useState(false);

  // FIX B7: si no hay expediciones, deshabilitar guardado.
  const sinExpediciones = expeditions.length === 0;

  const submit = () => {
    onSave({
      tipo,
      especie: tipo === 'especie' ? especie : null,
      degradacion:
        tipo === 'degradacion' ? degradacion : tipo === 'riesgo' ? riesgo : null,
      severidad: tipo === 'especie' ? null : severidad,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      altitud: parseInt(altitud, 10),
      notas,
      expedicion,
      sync: offline ? 'queue' : 'pending',
    });
  };

  const tipoButtons: { id: TipoRegistro; label: string }[] = [
    { id: 'especie', label: '🌿 Especie' },
    { id: 'degradacion', label: '⚠️ Degradación' },
    { id: 'riesgo', label: '🚨 Riesgo' },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <p
        style={{
          margin: '0 0 10px',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-main)',
        }}
      >
        Nuevo registro biológico
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {tipoButtons.map((t) => (
          <button
            key={t.id}
            onClick={() => setTipo(t.id)}
            className="touch-pill"
            style={{
              flex: 1,
              fontSize: 13,
              padding: '8px 4px',
              borderRadius: 10,
              border:
                tipo === t.id
                  ? `1.5px solid ${COLORS.PRIMARY_DARK}`
                  : '0.5px solid var(--border)',
              background:
                tipo === t.id ? COLORS.PRIMARY_LIGHT : 'var(--bg-main)',
              color: tipo === t.id ? COLORS.PRIMARY : 'var(--text-sec)',
              cursor: 'pointer',
              fontWeight: tipo === t.id ? 700 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tipo === 'especie' ? (
        <select
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          style={{ ...inpStyle, marginBottom: 10 }}
        >
          {SPECIES.map((s) => (
            <option key={s.id} value={s.nombre_comun}>
              {s.nombre_comun}
            </option>
          ))}
        </select>
      ) : (
        <>
          <select
            value={tipo === 'degradacion' ? degradacion : riesgo}
            onChange={(e) =>
              tipo === 'degradacion'
                ? setDegradacion(e.target.value)
                : setRiesgo(e.target.value)
            }
            style={{ ...inpStyle, marginBottom: 10 }}
          >
            {(tipo === 'degradacion' ? DEGRADATION_TYPES : RIESGO_TYPES).map(
              (d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ),
            )}
          </select>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {SEVERIDADES.map((s) => (
              <button
                key={s}
                onClick={() => setSeveridad(s)}
                className="touch-pill"
                style={{
                  flex: 1,
                  fontSize: 13,
                  padding: '8px 0',
                  borderRadius: 10,
                  border:
                    severidad === s
                      ? `1.5px solid ${COLORS.ACCENT_ORANGE}`
                      : '0.5px solid var(--border)',
                  background:
                    severidad === s ? '#faece7' : 'var(--bg-main)',
                  color:
                    severidad === s ? '#993c1d' : 'var(--text-sec)',
                  cursor: 'pointer',
                  fontWeight: severidad === s ? 700 : 500,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Lat"
          inputMode="decimal"
          style={inpStyle}
        />
        <input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Lng"
          inputMode="decimal"
          style={inpStyle}
        />
        <input
          value={altitud}
          onChange={(e) => setAltitud(e.target.value)}
          placeholder="Alt (m)"
          inputMode="numeric"
          style={inpStyle}
        />
      </div>

      {/* Foto placeholder — la captura real está fuera de alcance frontend */}
      <div
        style={{
          background: 'var(--bg-main)',
          border: '1px dashed var(--border)',
          borderRadius: 10,
          padding: '14px 10px',
          textAlign: 'center',
          color: 'var(--text-sec)',
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        📷 Foto (placeholder — captura real fuera de alcance)
      </div>

      <select
        value={expedicion}
        onChange={(e) => setExpedicion(e.target.value)}
        disabled={sinExpediciones}
        style={{ ...inpStyle, marginBottom: 10 }}
      >
        {sinExpediciones ? (
          <option value="">— sin expediciones —</option>
        ) : (
          expeditions.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.id} — {ex.nombre}
            </option>
          ))
        )}
      </select>

      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={3}
        placeholder="Notas de campo..."
        style={{ ...inpStyle, resize: 'none', marginBottom: 10 }}
      />

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--text-sec)',
        }}
      >
        <input
          type="checkbox"
          checked={offline}
          onChange={(e) => setOffline(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        Simular modo offline (encolar)
      </label>

      {sinExpediciones && (
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 12,
            color: COLORS.WARN_FG,
            background: COLORS.WARN_BG,
            padding: '8px 10px',
            borderRadius: 8,
          }}
        >
          Crea una expedición antes de registrar hallazgos.
        </p>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          className="touch-cta"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 10,
            border: '0.5px solid var(--border)',
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: TOUCH.FONT_ACTION,
            fontWeight: 600,
          }}
        >
          Cancelar
        </button>
        <button
          onClick={submit}
          disabled={sinExpediciones}
          className="touch-cta"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            background: sinExpediciones ? '#888' : COLORS.PRIMARY_DARK,
            color: 'white',
            fontWeight: 700,
            cursor: sinExpediciones ? 'not-allowed' : 'pointer',
            fontSize: TOUCH.FONT_ACTION,
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
