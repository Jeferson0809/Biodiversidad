import { useState } from 'react';

const SPECIES = [
  {
    id: 1,
    nombre_comun: 'Frailejón',
    nombre_cientifico: 'Espeletia grandiflora',
    estado: 'Vulnerable',
  },
  {
    id: 2,
    nombre_comun: 'Cóndor de los Andes',
    nombre_cientifico: 'Vultur gryphus',
    estado: 'Casi amenazado',
  },
  {
    id: 3,
    nombre_comun: 'Oso de anteojos',
    nombre_cientifico: 'Tremarctos ornatus',
    estado: 'Vulnerable',
  },
  {
    id: 4,
    nombre_comun: 'Puma',
    nombre_cientifico: 'Puma concolor',
    estado: 'Preocupación menor',
  },
  {
    id: 5,
    nombre_comun: 'Danta de montaña',
    nombre_cientifico: 'Tapirus pinchaque',
    estado: 'En peligro',
  },
  {
    id: 6,
    nombre_comun: 'Colibrí del páramo',
    nombre_cientifico: 'Oxypogon guerinii',
    estado: 'Vulnerable',
  },
];

const DEGRADATION_TYPES = [
  'Minería ilegal',
  'Pastoreo excesivo',
  'Quema',
  'Tala',
  'Contaminación hídrica',
];

const INITIAL_RECORDS = [
  {
    id: 1,
    tipo: 'especie',
    especie: 'Frailejón',
    lat: 7.112,
    lng: -72.831,
    altitud: 3420,
    fecha: '2026-05-08',
    hora: '09:14',
    expedicion: 'EXP-001',
    notas: 'Colonia de 40+ ejemplares, estado saludable',
    sync: 'sync',
    severidad: null,
    degradacion: null,
  },
  {
    id: 2,
    tipo: 'degradacion',
    especie: null,
    lat: 7.098,
    lng: -72.845,
    altitud: 3210,
    fecha: '2026-05-08',
    hora: '11:32',
    expedicion: 'EXP-001',
    notas: 'Evidencia de pastoreo bovino en zona protegida',
    sync: 'sync',
    severidad: 'Alta',
    degradacion: 'Pastoreo excesivo',
  },
  {
    id: 3,
    tipo: 'especie',
    especie: 'Oso de anteojos',
    lat: 7.125,
    lng: -72.819,
    altitud: 3580,
    fecha: '2026-05-09',
    hora: '06:45',
    expedicion: 'EXP-002',
    notas: 'Rastros frescos, posible hembra con cría',
    sync: 'pending',
    severidad: null,
    degradacion: null,
  },
  {
    id: 4,
    tipo: 'degradacion',
    especie: null,
    lat: 7.087,
    lng: -72.862,
    altitud: 2980,
    fecha: '2026-05-09',
    hora: '14:20',
    expedicion: 'EXP-002',
    notas: 'Maquinaria abandonada, residuos de mercurio',
    sync: 'pending',
    severidad: 'Crítica',
    degradacion: 'Minería ilegal',
  },
  {
    id: 5,
    tipo: 'especie',
    especie: 'Colibrí del páramo',
    lat: 7.135,
    lng: -72.808,
    altitud: 3710,
    fecha: '2026-05-10',
    hora: '08:00',
    expedicion: 'EXP-003',
    notas: 'Avistamiento en floración de Espeletia',
    sync: 'queue',
    severidad: null,
    degradacion: null,
  },
];

const EXPEDITIONS = [
  {
    id: 'EXP-001',
    guardabosque: 'Carlos Pérez',
    fecha: '2026-05-08',
    ruta: 'Ruta Norte - Sector Angostura',
    registros: 2,
    km: 14.2,
    estado: 'Completada',
  },
  {
    id: 'EXP-002',
    guardabosque: 'María López',
    fecha: '2026-05-09',
    ruta: 'Ruta Sur - Sector La Baja',
    registros: 2,
    km: 18.7,
    estado: 'Completada',
  },
  {
    id: 'EXP-003',
    guardabosque: 'Juan Torres',
    fecha: '2026-05-10',
    ruta: 'Ruta Central - Cumbre',
    registros: 1,
    km: 9.3,
    estado: 'En progreso',
  },
];

const GRID_CELLS = (() => {
  const cells = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 18; c++) {
      let intensity = 0;
      INITIAL_RECORDS.forEach((rec) => {
        const normLat = (rec.lat - 7.08) / (7.14 - 7.08);
        const normLng = (rec.lng - -72.87) / (-72.8 - -72.87);
        const cellR = 11 - Math.floor(normLat * 12);
        const cellC = Math.floor(normLng * 18);
        const dr = Math.abs(r - cellR);
        const dc = Math.abs(c - cellC);
        const dist = Math.sqrt(dr * dr + dc * dc);
        if (dist < 3.5) {
          const contrib = rec.tipo === 'degradacion' ? 2 : 1;
          intensity += contrib * Math.exp(-dist * 0.6);
        }
      });
      cells.push({ r, c, intensity });
    }
  }
  return cells;
})();

const maxIntensity = Math.max(...GRID_CELLS.map((c) => c.intensity));

function Badge({ status }) {
  const styles = {
    sync: {
      bg: 'var(--color-background-success)',
      color: 'var(--color-text-success)',
      label: '✓ Sincronizado',
    },
    pending: {
      bg: 'var(--color-background-warning)',
      color: 'var(--color-text-warning)',
      label: '⏳ Pendiente',
    },
    queue: {
      bg: 'var(--color-background-info)',
      color: 'var(--color-text-info)',
      label: '↑ En cola',
    },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 20,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

function SyncBadge({ status }) {
  return <Badge status={status} />;
}

function StatCard({ label, value, sub, color }) {
  return (
    <div
      style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '1rem',
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          margin: '0 0 4px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 26,
          fontWeight: 500,
          margin: '0 0 2px',
          color: color || 'var(--color-text-primary)',
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function HeatMap({ records }) {
  const [hover, setHover] = useState(null);
  const cellW = 34;
  const cellH = 26;
  const w = cellW * 18;
  const h = cellH * 12;

  function cellColor(intensity) {
    if (intensity < 0.05) return 'transparent';
    const ratio = Math.min(intensity / maxIntensity, 1);
    if (ratio < 0.33) return `rgba(30, 158, 117, ${0.15 + ratio * 0.5})`;
    if (ratio < 0.66) return `rgba(239, 159, 39, ${0.3 + ratio * 0.4})`;
    return `rgba(226, 75, 74, ${0.4 + ratio * 0.5})`;
  }

  const markerLat = (lat) =>
    (11 - Math.floor(((lat - 7.08) / 0.06) * 12)) * cellH + cellH / 2;
  const markerLng = (lng) =>
    Math.floor(((-72.87 - lng) / (-72.87 - -72.8)) * 18) * cellW + cellW / 2;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        width={w}
        height={h}
        style={{
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          display: 'block',
          maxWidth: '100%',
        }}
        viewBox={`0 0 ${w} ${h}`}
      >
        <rect width={w} height={h} fill="var(--color-background-secondary)" />
        {GRID_CELLS.map((cell, i) => (
          <rect
            key={i}
            x={cell.c * cellW}
            y={cell.r * cellH}
            width={cellW}
            height={cellH}
            fill={cellColor(cell.intensity)}
            stroke="none"
          />
        ))}
        {[...Array(13)].map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * cellH}
            x2={w}
            y2={i * cellH}
            stroke="var(--color-border-tertiary)"
            strokeWidth={0.5}
          />
        ))}
        {[...Array(19)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * cellW}
            y1={0}
            x2={i * cellW}
            y2={h}
            stroke="var(--color-border-tertiary)"
            strokeWidth={0.5}
          />
        ))}
        {records.map((rec, i) => {
          const cx = markerLng(rec.lng);
          const cy = markerLat(rec.lat);
          const isHovered = hover === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 9 : 6}
                fill={rec.tipo === 'especie' ? '#1d9e75' : '#d85a30'}
                stroke="white"
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={8}
                fill="white"
                fontWeight={700}
              >
                {rec.tipo === 'especie' ? 'E' : 'D'}
              </text>
              {isHovered && (
                <g>
                  <rect
                    x={cx + 10}
                    y={cy - 20}
                    width={130}
                    height={36}
                    rx={4}
                    fill="var(--color-background-primary)"
                    stroke="var(--color-border-secondary)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={cx + 16}
                    y={cy - 7}
                    fontSize={10}
                    fill="var(--color-text-primary)"
                    fontWeight={500}
                  >
                    {rec.tipo === 'especie' ? rec.especie : rec.degradacion}
                  </text>
                  <text
                    x={cx + 16}
                    y={cy + 7}
                    fontSize={9}
                    fill="var(--color-text-secondary)"
                  >
                    {rec.altitud}m asl · {rec.fecha}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        <g>
          <text x={8} y={h - 6} fontSize={9} fill="var(--color-text-secondary)">
            7.080°N
          </text>
          <text x={8} y={14} fontSize={9} fill="var(--color-text-secondary)">
            7.140°N
          </text>
          <text
            x={w - 60}
            y={h - 6}
            fontSize={9}
            fill="var(--color-text-secondary)"
          >
            72.800°W
          </text>
        </g>
      </svg>
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 10,
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#1d9e75',
              display: 'inline-block',
            }}
          />
          Especie nativa
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#d85a30',
              display: 'inline-block',
            }}
          />
          Foco de degradación
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 10,
              background: 'rgba(226,75,74,0.7)',
              display: 'inline-block',
              borderRadius: 2,
            }}
          />
          Zona crítica
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 10,
              background: 'rgba(239,159,39,0.55)',
              display: 'inline-block',
              borderRadius: 2,
            }}
          />
          Zona media
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 10,
              background: 'rgba(30,158,117,0.35)',
              display: 'inline-block',
              borderRadius: 2,
            }}
          />
          Zona baja
        </span>
      </div>
    </div>
  );
}

function NewRecordForm({ onSave, onCancel, expeditions }) {
  const [tipo, setTipo] = useState('especie');
  const [especie, setEspecie] = useState('');
  const [degradacion, setDegradacion] = useState('');
  const [severidad, setSeveridad] = useState('Media');
  const [lat, setLat] = useState('7.110');
  const [lng, setLng] = useState('-72.830');
  const [altitud, setAltitud] = useState('3400');
  const [notas, setNotas] = useState('');
  const [expedicion, setExpedicion] = useState(expeditions[0]?.id || '');
  const [offline, setOffline] = useState(false);

  function handleSave() {
    const rec = {
      id: Date.now(),
      tipo,
      especie: tipo === 'especie' ? especie || SPECIES[0].nombre_comun : null,
      degradacion:
        tipo === 'degradacion' ? degradacion || DEGRADATION_TYPES[0] : null,
      severidad: tipo === 'degradacion' ? severidad : null,
      lat: parseFloat(lat) || 7.11,
      lng: parseFloat(lng) || -72.83,
      altitud: parseInt(altitud) || 3400,
      notas,
      expedicion,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      sync: offline ? 'queue' : 'pending',
    };
    onSave(rec);
  }

  const input = { width: '100%', boxSizing: 'border-box' };
  const row = { marginBottom: 14 };
  const label = {
    display: 'block',
    fontSize: 12,
    color: 'var(--color-text-secondary)',
    marginBottom: 4,
  };

  return (
    <div
      style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.25rem',
      }}
    >
      <h3 style={{ margin: '0 0 1rem', fontSize: 15, fontWeight: 500 }}>
        Nuevo registro biológico
      </h3>

      <div style={row}>
        <span style={label}>Tipo de registro</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['especie', 'degradacion'].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 13,
                background:
                  tipo === t
                    ? 'var(--color-background-success)'
                    : 'transparent',
                color:
                  tipo === t
                    ? 'var(--color-text-success)'
                    : 'var(--color-text-secondary)',
                border:
                  tipo === t
                    ? '1px solid var(--color-border-success)'
                    : '0.5px solid var(--color-border-secondary)',
              }}
            >
              {t === 'especie' ? '🌿 Especie nativa' : '⚠️ Foco degradación'}
            </button>
          ))}
        </div>
      </div>

      {tipo === 'especie' ? (
        <div style={row}>
          <label style={label}>Especie observada</label>
          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            style={input}
          >
            {SPECIES.map((s) => (
              <option key={s.id} value={s.nombre_comun}>
                {s.nombre_comun} — {s.nombre_cientifico}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div style={row}>
            <label style={label}>Tipo de degradación</label>
            <select
              value={degradacion}
              onChange={(e) => setDegradacion(e.target.value)}
              style={input}
            >
              {DEGRADATION_TYPES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div style={row}>
            <label style={label}>Severidad</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Baja', 'Media', 'Alta', 'Crítica'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeveridad(s)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    background:
                      severidad === s
                        ? s === 'Crítica'
                          ? 'var(--color-background-danger)'
                          : s === 'Alta'
                          ? 'var(--color-background-warning)'
                          : 'var(--color-background-info)'
                        : 'transparent',
                    color:
                      severidad === s
                        ? s === 'Crítica'
                          ? 'var(--color-text-danger)'
                          : s === 'Alta'
                          ? 'var(--color-text-warning)'
                          : 'var(--color-text-info)'
                        : 'var(--color-text-secondary)',
                    border: '0.5px solid var(--color-border-secondary)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
          ...row,
        }}
      >
        <div>
          <label style={label}>Latitud</label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            step="0.001"
            style={input}
          />
        </div>
        <div>
          <label style={label}>Longitud</label>
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            step="0.001"
            style={input}
          />
        </div>
        <div>
          <label style={label}>Altitud (m)</label>
          <input
            type="number"
            value={altitud}
            onChange={(e) => setAltitud(e.target.value)}
            style={input}
          />
        </div>
      </div>

      <div style={row}>
        <label style={label}>Expedición</label>
        <select
          value={expedicion}
          onChange={(e) => setExpedicion(e.target.value)}
          style={input}
        >
          {expeditions.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.id} — {ex.ruta}
            </option>
          ))}
        </select>
      </div>

      <div style={row}>
        <label style={label}>Notas de campo</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          style={{ ...input, resize: 'vertical' }}
          placeholder="Descripción detallada del hallazgo..."
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <input
          type="checkbox"
          id="offline"
          checked={offline}
          onChange={(e) => setOffline(e.target.checked)}
        />
        <label
          htmlFor="offline"
          style={{
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          Simular modo offline (guardar en cola de sincronización)
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '8px 20px' }}>
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 20px',
            background: 'var(--color-background-success)',
            color: 'var(--color-text-success)',
            border: '1px solid var(--color-border-success)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          Guardar registro
        </button>
      </div>
    </div>
  );
}

function NewExpeditionForm({ onSave, onCancel }) {
  const [ruta, setRuta] = useState('');
  const [guardabosque, setGuardabosque] = useState('');

  function handleSave() {
    const newExp = {
      id: `EXP-00${Math.floor(Math.random() * 900 + 100)}`,
      guardabosque: guardabosque || 'Sin asignar',
      fecha: new Date().toISOString().split('T')[0],
      ruta: ruta || 'Ruta sin nombre',
      registros: 0,
      km: 0,
      estado: 'En progreso',
    };
    onSave(newExp);
  }

  const label = {
    display: 'block',
    fontSize: 12,
    color: 'var(--color-text-secondary)',
    marginBottom: 4,
  };

  return (
    <div
      style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.25rem',
        marginBottom: '1rem',
      }}
    >
      <h3 style={{ margin: '0 0 1rem', fontSize: 15, fontWeight: 500 }}>
        Nueva expedición
      </h3>
      <div style={{ marginBottom: 12 }}>
        <label style={label}>Guardabosque responsable</label>
        <input
          value={guardabosque}
          onChange={(e) => setGuardabosque(e.target.value)}
          placeholder="Nombre completo"
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Ruta / Sector</label>
        <input
          value={ruta}
          onChange={(e) => setRuta(e.target.value)}
          placeholder="Ej: Ruta Norte - Sector Angostura"
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel}>Cancelar</button>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 20px',
            background: 'var(--color-background-info)',
            color: 'var(--color-text-info)',
            border: '1px solid var(--color-border-info)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          Iniciar expedición
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [expeditions, setExpeditions] = useState(EXPEDITIONS);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [showNewExp, setShowNewExp] = useState(false);
  const [filterTipo, setFilterTipo] = useState('todos');
  const [syncProgress, setSyncProgress] = useState(null);
  const [notification, setNotification] = useState(null);

  const pendingCount = records.filter((r) => r.sync !== 'sync').length;
  const especieCount = records.filter((r) => r.tipo === 'especie').length;
  const degradCount = records.filter((r) => r.tipo === 'degradacion').length;
  const criticalCount = records.filter((r) => r.severidad === 'Crítica').length;

  function showNotif(msg, type = 'success') {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function handleSaveRecord(rec) {
    setRecords((prev) => [rec, ...prev]);
    setShowNewRecord(false);
    showNotif(
      `Registro guardado — Estado: ${
        rec.sync === 'queue' ? 'en cola offline' : 'pendiente de sincronización'
      }`
    );
  }

  function handleSaveExp(exp) {
    setExpeditions((prev) => [exp, ...prev]);
    setShowNewExp(false);
    showNotif(`Expedición ${exp.id} iniciada correctamente`, 'info');
  }

  function handleSync() {
    const toSync = records.filter((r) => r.sync !== 'sync').length;
    if (toSync === 0) {
      showNotif('Todo está sincronizado', 'info');
      return;
    }
    setSyncProgress(0);
    let step = 0;
    const total = toSync;
    const interval = setInterval(() => {
      step++;
      setSyncProgress(Math.round((step / total) * 100));
      if (step >= total) {
        clearInterval(interval);
        setRecords((prev) => prev.map((r) => ({ ...r, sync: 'sync' })));
        setSyncProgress(null);
        showNotif(`${total} registros sincronizados exitosamente`);
      }
    }, 600);
  }

  const filteredRecords =
    filterTipo === 'todos'
      ? records
      : records.filter((r) => r.tipo === filterTipo);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registros', label: `Registros (${records.length})` },
    { id: 'expediciones', label: 'Expediciones' },
    { id: 'especies', label: 'Catálogo' },
  ];

  const tabStyle = (id) => ({
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: tab === id ? 500 : 400,
    color:
      tab === id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    background: 'transparent',
    border: 'none',
    borderBottom:
      tab === id
        ? '2px solid var(--color-text-primary)'
        : '2px solid transparent',
    cursor: 'pointer',
    borderRadius: 0,
  });

  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        maxWidth: 760,
        margin: '0 auto',
        padding: '0 0 2rem',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--color-text-primary)',
        }}
      >
        Sistema de Monitoreo
      </h2>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        Páramo de Santurbán · CTeI-SGR-2024
      </p>

      {notification && (
        <div
          style={{
            background:
              notification.type === 'info'
                ? 'var(--color-background-info)'
                : 'var(--color-background-success)',
            color:
              notification.type === 'info'
                ? 'var(--color-text-info)'
                : 'var(--color-text-success)',
            padding: '10px 16px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: 13,
            marginTop: 12,
            border: `0.5px solid ${
              notification.type === 'info'
                ? 'var(--color-border-info)'
                : 'var(--color-border-success)'
            }`,
          }}
        >
          {notification.msg}
        </div>
      )}

      {pendingCount > 0 && (
        <div
          style={{
            background: 'var(--color-background-warning)',
            border: '0.5px solid var(--color-border-warning)',
            borderRadius: 'var(--border-radius-md)',
            padding: '10px 16px',
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--color-text-warning)' }}>
            {pendingCount} registro{pendingCount > 1 ? 's' : ''} pendiente
            {pendingCount > 1 ? 's' : ''} de sincronización
          </span>
          {syncProgress !== null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 120,
                  height: 6,
                  background: 'var(--color-background-secondary)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${syncProgress}%`,
                    height: '100%',
                    background: 'var(--color-text-success)',
                    borderRadius: 4,
                    transition: 'width 0.4s',
                  }}
                />
              </div>
              <span
                style={{ fontSize: 12, color: 'var(--color-text-warning)' }}
              >
                {syncProgress}%
              </span>
            </div>
          ) : (
            <button
              onClick={handleSync}
              style={{
                fontSize: 12,
                padding: '4px 14px',
                color: 'var(--color-text-warning)',
                borderColor: 'var(--color-border-warning)',
              }}
            >
              Sincronizar ahora ↑
            </button>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
          marginTop: 16,
          gap: 0,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            style={tabStyle(t.id)}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: '1.25rem' }}>
        {tab === 'dashboard' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 12,
                marginBottom: '1.5rem',
              }}
            >
              <StatCard
                label="Registros totales"
                value={records.length}
                sub={`${pendingCount} pendientes`}
              />
              <StatCard
                label="Especies avistadas"
                value={especieCount}
                sub="registros biológicos"
                color="var(--color-text-success)"
              />
              <StatCard
                label="Focos detectados"
                value={degradCount}
                sub={`${criticalCount} críticos`}
                color="var(--color-text-warning)"
              />
              <StatCard
                label="Expediciones"
                value={expeditions.length}
                sub={`${
                  expeditions.filter((e) => e.estado === 'En progreso').length
                } activas`}
                color="var(--color-text-info)"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  margin: '0 0 10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Mapa de calor — Sector Santurbán
              </h3>
              <HeatMap records={records} />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  margin: '0 0 10px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Distribución por tipo de degradación
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEGRADATION_TYPES.map((tipo) => {
                  const count = records.filter(
                    (r) => r.degradacion === tipo
                  ).length;
                  const pct =
                    records.length > 0 ? (count / records.length) * 100 : 0;
                  return (
                    <div
                      key={tipo}
                      style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          width: 160,
                          flexShrink: 0,
                        }}
                      >
                        {tipo}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: 'var(--color-background-secondary)',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: count > 0 ? '#d85a30' : 'transparent',
                            borderRadius: 4,
                            transition: 'width 0.4s',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          width: 20,
                          textAlign: 'right',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'registros' && (
          <div>
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                {['todos', 'especie', 'degradacion'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterTipo(f)}
                    style={{
                      fontSize: 12,
                      padding: '4px 14px',
                      borderRadius: 20,
                      background:
                        filterTipo === f
                          ? 'var(--color-background-secondary)'
                          : 'transparent',
                      fontWeight: filterTipo === f ? 500 : 400,
                    }}
                  >
                    {f === 'todos'
                      ? 'Todos'
                      : f === 'especie'
                      ? 'Especies'
                      : 'Degradación'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowNewRecord(true)}
                style={{
                  fontSize: 13,
                  padding: '6px 16px',
                  background: 'var(--color-background-success)',
                  color: 'var(--color-text-success)',
                  border: '1px solid var(--color-border-success)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              >
                + Nuevo registro
              </button>
            </div>

            {showNewRecord && (
              <div style={{ marginBottom: '1rem' }}>
                <NewRecordForm
                  onSave={handleSaveRecord}
                  onCancel={() => setShowNewRecord(false)}
                  expeditions={expeditions}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 15 }}>
                          {rec.tipo === 'especie' ? '🌿' : '⚠️'}
                        </span>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>
                          {rec.tipo === 'especie'
                            ? rec.especie
                            : rec.degradacion}
                        </span>
                        {rec.severidad && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 8px',
                              borderRadius: 20,
                              fontWeight: 500,
                              background:
                                rec.severidad === 'Crítica'
                                  ? 'var(--color-background-danger)'
                                  : rec.severidad === 'Alta'
                                  ? 'var(--color-background-warning)'
                                  : 'var(--color-background-info)',
                              color:
                                rec.severidad === 'Crítica'
                                  ? 'var(--color-text-danger)'
                                  : rec.severidad === 'Alta'
                                  ? 'var(--color-text-warning)'
                                  : 'var(--color-text-info)',
                            }}
                          >
                            {rec.severidad}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: '0 0 6px',
                          fontSize: 13,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {rec.notas || 'Sin notas de campo'}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: 16,
                          fontSize: 12,
                          color: 'var(--color-text-tertiary)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>
                          📍 {rec.lat.toFixed(3)}°N,{' '}
                          {Math.abs(rec.lng).toFixed(3)}°W
                        </span>
                        <span>⛰ {rec.altitud} m asl</span>
                        <span>
                          📅 {rec.fecha} {rec.hora}
                        </span>
                        <span>🧭 {rec.expedicion}</span>
                      </div>
                    </div>
                    <SyncBadge status={rec.sync} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'expediciones' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '1rem',
              }}
            >
              <button
                onClick={() => setShowNewExp(true)}
                style={{
                  fontSize: 13,
                  padding: '6px 16px',
                  background: 'var(--color-background-info)',
                  color: 'var(--color-text-info)',
                  border: '1px solid var(--color-border-info)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              >
                + Nueva expedición
              </button>
            </div>

            {showNewExp && (
              <NewExpeditionForm
                onSave={handleSaveExp}
                onCancel={() => setShowNewExp(false)}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expeditions.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 8,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: 14 }}>
                          {exp.id}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '1px 8px',
                            borderRadius: 20,
                            fontWeight: 500,
                            background:
                              exp.estado === 'En progreso'
                                ? 'var(--color-background-warning)'
                                : 'var(--color-background-success)',
                            color:
                              exp.estado === 'En progreso'
                                ? 'var(--color-text-warning)'
                                : 'var(--color-text-success)',
                          }}
                        >
                          {exp.estado}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: 13,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {exp.ruta}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Guardabosque
                      </p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                        {exp.guardabosque}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 20,
                      fontSize: 12,
                      color: 'var(--color-text-tertiary)',
                      borderTop: '0.5px solid var(--color-border-tertiary)',
                      paddingTop: 8,
                    }}
                  >
                    <span>📅 {exp.fecha}</span>
                    <span>📸 {exp.registros} registros</span>
                    <span>🛤 {exp.km} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'especies' && (
          <div>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                marginTop: 0,
              }}
            >
              Catálogo de especies monitoreadas en el Páramo de Santurbán
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
              }}
            >
              {SPECIES.map((s) => {
                const avistamientos = records.filter(
                  (r) => r.especie === s.nombre_comun
                ).length;
                const estadoColor = {
                  'En peligro': {
                    bg: 'var(--color-background-danger)',
                    color: 'var(--color-text-danger)',
                  },
                  Vulnerable: {
                    bg: 'var(--color-background-warning)',
                    color: 'var(--color-text-warning)',
                  },
                  'Casi amenazado': {
                    bg: 'var(--color-background-info)',
                    color: 'var(--color-text-info)',
                  },
                  'Preocupación menor': {
                    bg: 'var(--color-background-success)',
                    color: 'var(--color-text-success)',
                  },
                }[s.estado] || {
                  bg: 'var(--color-background-secondary)',
                  color: 'var(--color-text-secondary)',
                };
                return (
                  <div
                    key={s.id}
                    style={{
                      background: 'var(--color-background-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: '1rem',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: 14,
                        margin: '0 0 2px',
                      }}
                    >
                      {s.nombre_comun}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-secondary)',
                        margin: '0 0 10px',
                        fontStyle: 'italic',
                      }}
                    >
                      {s.nombre_cientifico}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: estadoColor.bg,
                          color: estadoColor.color,
                          fontWeight: 500,
                        }}
                      >
                        {s.estado}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {avistamientos} avistamiento
                        {avistamientos !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
