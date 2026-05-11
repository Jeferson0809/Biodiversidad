import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ─── DATA INICIAL ────────────────────────────────────────────────────────────

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
    nombre_comun: 'Danta de montaña',
    nombre_cientifico: 'Tapirus pinchaque',
    estado: 'En peligro',
  },
  {
    id: 5,
    nombre_comun: 'Puma',
    nombre_cientifico: 'Puma concolor',
    estado: 'Preocupación menor',
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
];

// ─── ESTILOS GLOBALES (MODO OSCURO) ──────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    :root {
      --bg-main: #f2f2f7;
      --bg-card: #ffffff;
      --text-main: #111111;
      --text-sec: #777777;
      --border: #e8e8e8;
    }
    [data-theme='dark'] {
      --bg-main: #1c1c1e;
      --bg-card: #2c2c2e;
      --text-main: #f2f2f7;
      --text-sec: #aaaaaa;
      --border: #3a3a3c;
    }
    .leaflet-container {
      background: var(--bg-main);
      border-radius: 12px;
      z-index: 1;
    }
  `}</style>
);

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Badge({ status }: { status: string }) {
  const styles: any = {
    sync: { bg: '#e9f7f1', color: '#0f6e56', label: '✓ Sincronizado' },
    pending: { bg: '#fef3dc', color: '#854f0b', label: '⏳ Pendiente' },
    queue: { bg: '#e8f2fc', color: '#185fa5', label: '↑ En cola' },
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

function StatCard({ label, value, sub, color }: any) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: 10,
        padding: '10px 12px',
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: 'var(--text-sec)',
          margin: '0 0 4px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 500,
          margin: '0 0 2px',
          color: color || 'var(--text-main)',
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 10, color: 'var(--text-sec)', margin: 0 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function RealMap({ records }: { records: any[] }) {
  if (typeof window === 'undefined') return null; // Evitar errores de SSR en Next.js

  return (
    <div
      style={{
        height: 300,
        width: '100%',
        marginBottom: 16,
        border: '0.5px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={[7.11, -72.83]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {records.map((rec) => (
          <CircleMarker
            key={rec.id}
            center={[rec.lat, rec.lng]}
            radius={7}
            pathOptions={{
              color: 'white',
              weight: 1.5,
              fillColor: rec.tipo === 'especie' ? '#1d9e75' : '#d85a30',
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <strong>
                {rec.tipo === 'especie'
                  ? '🌿 ' + rec.especie
                  : '⚠️ ' + rec.degradacion}
              </strong>
              <br />
              {rec.notas || 'Sin notas'}
              <br />
              <span style={{ fontSize: 10, color: 'gray' }}>
                {rec.lat}, {rec.lng}
              </span>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function NewRecordForm({ onSave, onCancel, expeditions }: any) {
  const [tipo, setTipo] = useState('especie');
  const [especie, setEspecie] = useState(SPECIES.nombre_comun);
  const [degradacion, setDegradacion] = useState(DEGRADATION_TYPES);
  const [severidad, setSeveridad] = useState('Media');
  const [lat, setLat] = useState('7.110');
  const [lng, setLng] = useState('-72.830');
  const [altitud, setAltitud] = useState('3400');
  const [notas, setNotas] = useState('');
  const [expedicion, setExpedicion] = useState(expeditions?.id || '');
  const [offline, setOffline] = useState(false);

  const inpStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    fontSize: 12,
    padding: '6px 8px',
    border: '0.5px solid var(--border)',
    borderRadius: 8,
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <p
        style={{
          margin: '0 0 8px',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-main)',
        }}
      >
        Nuevo registro biológico
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {['especie', 'degradacion'].map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            style={{
              flex: 1,
              fontSize: 11,
              padding: '5px 0',
              borderRadius: 8,
              border:
                tipo === t
                  ? '1.5px solid #1d9e75'
                  : '0.5px solid var(--border)',
              background: tipo === t ? '#e9f7f1' : 'var(--bg-main)',
              color: tipo === t ? '#0f6e56' : 'var(--text-sec)',
              cursor: 'pointer',
            }}
          >
            {t === 'especie' ? '🌿 Especie' : '⚠️ Degradación'}
          </button>
        ))}
      </div>

      {tipo === 'especie' ? (
        <select
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          style={{ ...inpStyle, marginBottom: 8 }}
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
            value={degradacion}
            onChange={(e) => setDegradacion(e.target.value)}
            style={{ ...inpStyle, marginBottom: 8 }}
          >
            {DEGRADATION_TYPES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {['Baja', 'Media', 'Alta', 'Crítica'].map((s) => (
              <button
                key={s}
                onClick={() => setSeveridad(s)}
                style={{
                  flex: 1,
                  fontSize: 10,
                  padding: '4px 0',
                  borderRadius: 6,
                  border:
                    severidad === s
                      ? '1.5px solid #d85a30'
                      : '0.5px solid var(--border)',
                  background: severidad === s ? '#faece7' : 'var(--bg-main)',
                  color: severidad === s ? '#993c1d' : 'var(--text-sec)',
                  cursor: 'pointer',
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
          gap: 6,
          marginBottom: 8,
        }}
      >
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Lat"
          style={inpStyle}
        />
        <input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Lng"
          style={inpStyle}
        />
        <input
          value={altitud}
          onChange={(e) => setAltitud(e.target.value)}
          placeholder="Alt (m)"
          style={inpStyle}
        />
      </div>

      <select
        value={expedicion}
        onChange={(e) => setExpedicion(e.target.value)}
        style={{ ...inpStyle, marginBottom: 8 }}
      >
        {expeditions.map((ex: any) => (
          <option key={ex.id} value={ex.id}>
            {ex.id} — {ex.ruta}
          </option>
        ))}
      </select>
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={2}
        placeholder="Notas de campo..."
        style={{ ...inpStyle, resize: 'none', marginBottom: 8 }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
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
          style={{ fontSize: 11, color: 'var(--text-sec)' }}
        >
          Simular modo offline
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 8,
            border: '0.5px solid var(--border)',
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Cancelar
        </button>
        <button
          onClick={() =>
            onSave({
              tipo,
              especie,
              degradacion,
              severidad,
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              altitud: parseInt(altitud),
              notas,
              expedicion,
              sync: offline ? 'queue' : 'pending',
            })
          }
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 8,
            border: 'none',
            background: '#1d9e75',
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function ScreenDashboard({ records, expeditions }: any) {
  const pendingCount = records.filter((r: any) => r.sync !== 'sync').length;
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
          color="#185fa5"
        />
        <StatCard
          label="Especies"
          value={records.filter((r: any) => r.tipo === 'especie').length}
          sub="avistadas"
          color="#0f6e56"
        />
        <StatCard
          label="Focos"
          value={records.filter((r: any) => r.tipo === 'degradacion').length}
          sub="detectados"
          color="#854f0b"
        />
        <StatCard
          label="Expediciones"
          value={expeditions.length}
          sub={`${
            expeditions.filter((e: any) => e.estado === 'En progreso').length
          } activas`}
          color="#533ab7"
        />
      </div>
      <p
        style={{
          fontSize: 10,
          color: 'var(--text-sec)',
          margin: '0 0 6px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Mapa Interactivo — Santurbán
      </p>

      {/* Nuevo Mapa de Leaflet */}
      <RealMap records={records} />

      <p
        style={{
          fontSize: 10,
          color: 'var(--text-sec)',
          margin: '14px 0 6px',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Degradación por tipo
      </p>
      {DEGRADATION_TYPES.map((tipo) => {
        const count = records.filter((r: any) => r.degradacion === tipo).length;
        const pct = records.length > 0 ? (count / records.length) * 100 : 0;
        return (
          <div
            key={tipo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: 'var(--text-sec)',
                width: 120,
                flexShrink: 0,
              }}
            >
              {tipo}
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                background: 'var(--border)',
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
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                color: 'var(--text-sec)',
                width: 14,
                textAlign: 'right',
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

function ScreenRegistros({ records, setRecords, expeditions, showNotif }: any) {
  const [filter, setFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const filtered =
    filter === 'todos'
      ? records
      : records.filter((r: any) => r.tipo === filter);

  function handleSave(data: any) {
    const rec = {
      id: Date.now(),
      ...data,
      fecha: new Date().toISOString().split('T'),
      hora: new Date().toTimeString().slice(0, 5),
    };
    setRecords((prev: any[]) => [rec, ...prev]);
    setShowForm(false);
    showNotif('Registro guardado');
  }

  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['todos', 'especie', 'degradacion'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 10,
                padding: '4px 10px',
                borderRadius: 20,
                border: '0.5px solid var(--border)',
                background: filter === f ? '#1d9e75' : 'var(--bg-card)',
                color: filter === f ? 'white' : 'var(--text-sec)',
                cursor: 'pointer',
              }}
            >
              {f === 'todos' ? 'Todos' : f === 'especie' ? 'Especies' : 'Focos'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            fontSize: 12,
            padding: '6px 14px',
            borderRadius: 20,
            background: '#1d9e75',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
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
        {filtered.map((rec: any) => (
          <div
            key={rec.id}
            style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-main)',
                }}
              >
                {rec.tipo === 'especie' ? '🌿 ' : '⚠️ '}
                {rec.tipo === 'especie' ? rec.especie : rec.degradacion}
              </span>
              <Badge status={rec.sync} />
            </div>
            {rec.severidad && (
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 7px',
                  borderRadius: 20,
                  background:
                    rec.severidad === 'Crítica' ? '#fcebeb' : '#fef3dc',
                  color: rec.severidad === 'Crítica' ? '#a32d2d' : '#854f0b',
                  display: 'inline-block',
                  marginBottom: 4,
                }}
              >
                {rec.severidad}
              </span>
            )}
            <p
              style={{
                margin: '2px 0 4px',
                fontSize: 11,
                color: 'var(--text-sec)',
                lineHeight: 1.4,
              }}
            >
              {rec.notas || 'Sin notas'}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text-sec)' }}>
              📍 {rec.lat?.toFixed(3)},{Math.abs(rec.lng ?? 0).toFixed(3)} · ⛰{' '}
              {rec.altitud}m · {rec.fecha} {rec.hora}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenExpediciones({ expeditions, setExpeditions, showNotif }: any) {
  const [showForm, setShowForm] = useState(false);
  const [ruta, setRuta] = useState('');
  const [gb, setGb] = useState('');
  const inpStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    fontSize: 12,
    padding: '6px 8px',
    border: '0.5px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-main)',
    background: 'var(--bg-main)',
  };

  function save() {
    setExpeditions((prev: any[]) => [
      {
        id: `EXP-00${prev.length + 4}`,
        guardabosque: gb || 'Sin asignar',
        fecha: new Date().toISOString().split('T'),
        ruta: ruta || 'Ruta sin nombre',
        registros: 0,
        km: 0,
        estado: 'En progreso',
      },
      ...prev,
    ]);
    setShowForm(false);
    setRuta('');
    setGb('');
    showNotif('Expedición iniciada');
  }

  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 10,
        }}
      >
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            fontSize: 12,
            padding: '6px 14px',
            borderRadius: 20,
            background: '#185fa5',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + Nueva
        </button>
      </div>
      {showForm && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <input
            value={gb}
            onChange={(e) => setGb(e.target.value)}
            placeholder="Guardabosque responsable"
            style={{ ...inpStyle, marginBottom: 8 }}
          />
          <input
            value={ruta}
            onChange={(e) => setRuta(e.target.value)}
            placeholder="Ruta / sector"
            style={{ ...inpStyle, marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: '0.5px solid var(--border)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={save}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#185fa5',
                color: 'white',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Iniciar
            </button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {expeditions.map((exp: any) => (
          <div
            key={exp.id}
            style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              padding: '10px 12px',
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
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-main)',
                }}
              >
                {exp.id}
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background:
                    exp.estado === 'En progreso' ? '#fef3dc' : '#e9f7f1',
                  color: exp.estado === 'En progreso' ? '#854f0b' : '#0f6e56',
                  fontWeight: 500,
                }}
              >
                {exp.estado}
              </span>
            </div>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 11,
                color: 'var(--text-sec)',
              }}
            >
              {exp.ruta}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text-sec)' }}>
              👤 {exp.guardabosque} · 📅 {exp.fecha} · 📸 {exp.registros} reg.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenEspecies({ records }: { records: any[] }) {
  return (
    <div style={{ padding: '0 12px 80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SPECIES.map((s) => {
          const count = records.filter(
            (r: any) => r.especie === s.nombre_comun
          ).length;
          const estadoColor: any = {
            'En peligro': { bg: '#fcebeb', color: '#a32d2d' },
            Vulnerable: { bg: '#fef3dc', color: '#854f0b' },
            'Casi amenazado': { bg: '#e8f2fc', color: '#185fa5' },
            'Preocupación menor': { bg: '#e9f7f1', color: '#0f6e56' },
          };
          const ec = estadoColor[s.estado] || { bg: '#f0f0f0', color: '#888' };
          return (
            <div
              key={s.id}
              style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 2px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-main)',
                  }}
                >
                  {s.nombre_comun}
                </p>
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: 10,
                    color: 'var(--text-sec)',
                    fontStyle: 'italic',
                  }}
                >
                  {s.nombre_cientifico}
                </p>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: ec.bg,
                    color: ec.color,
                    fontWeight: 500,
                  }}
                >
                  {s.estado}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 500,
                    color: '#185fa5',
                  }}
                >
                  {count}
                </p>
                <p
                  style={{ margin: 0, fontSize: 10, color: 'var(--text-sec)' }}
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

// ─── PIN PAD SCREEN (RNF3) ───────────────────────────────────────────────────

function PinPadScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const MAX_LENGTH = 4;
  const CORRECT_PIN = '1234';

  const handleNumberClick = (num: string) => {
    if (pin.length < MAX_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === MAX_LENGTH) {
        if (newPin === CORRECT_PIN) setTimeout(onUnlock, 300);
        else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 400);
        }
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'C'];

  return (
    <div
      style={{
        height: 690,
        background: '#111',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: '#1d9e75',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 16,
        }}
      >
        🌿
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600 }}>
        Santurbán App
      </h2>
      <p
        style={{
          margin: '0 0 32px',
          fontSize: 12,
          color: error ? '#ff3b30' : '#aaa',
        }}
      >
        {error ? 'PIN Incorrecto' : 'Ingrese PIN de seguridad (RNF3)'}
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
        {[...Array(MAX_LENGTH)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: error ? '#ff3b30' : i < pin.length ? 'white' : '#333',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: 240,
        }}
      >
        {keys.map((key, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
            {key ? (
              <button
                onClick={() =>
                  key === 'C' ? setPin('') : handleNumberClick(key)
                }
                style={{
                  width: 64,
                  height: 64,
                  background: '#2c2c2e',
                  border: 'none',
                  borderRadius: 32,
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {key}
              </button>
            ) : (
              <div style={{ width: 64, height: 64 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANDROID FRAME & APP LOGIC ───────────────────────────────────────────────

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [time, setTime] = useState('');

  // 1. Lógica de Persistencia Local (LocalStorage)
  const [records, setRecords] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('santurban_records');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_RECORDS;
  });

  const [expeditions, setExpeditions] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('santurban_expeditions');
      if (saved) return JSON.parse(saved);
    }
    return EXPEDITIONS;
  });

  // 2. Lógica del Modo Oscuro persistente
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('santurban_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('santurban_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('santurban_expeditions', JSON.stringify(expeditions));
  }, [expeditions]);

  useEffect(() => {
    localStorage.setItem('santurban_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const pendingCount = records.filter((r) => r.sync !== 'sync').length;

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }

  function handleSync() {
    if (pendingCount === 0) return showNotif('Todo sincronizado ✓');
    setSyncProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSyncProgress(Math.round((step / pendingCount) * 100));
      if (step >= pendingCount) {
        clearInterval(interval);
        setRecords((prev) => prev.map((r) => ({ ...r, sync: 'sync' })));
        setSyncProgress(null);
        showNotif(`${pendingCount} registros sincronizados ✓`);
      }
    }, 600);
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'registros', label: 'Registros', icon: '🌿' },
    { id: 'expediciones', label: 'Expediciones', icon: '🧭' },
    { id: 'especies', label: 'Catálogo', icon: '📋' },
  ];

  const screenTitle: any = {
    dashboard: 'Dashboard',
    registros: 'Registros',
    expediciones: 'Expediciones',
    especies: 'Catálogo',
  };

  return (
    <div
      data-theme={darkMode ? 'dark' : 'light'}
      style={{
        minHeight: '100vh',
        background: '#d0d0d0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
      }}
    >
      <GlobalStyles />

      <div
        style={{
          width: 375,
          background: '#1a1a1a',
          borderRadius: 48,
          padding: '12px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Botones de hardware del celular */}
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: 120,
            width: 4,
            height: 32,
            background: '#333',
            borderRadius: '4px 0 0 4px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: 165,
            width: 4,
            height: 56,
            background: '#333',
            borderRadius: '4px 0 0 4px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: 232,
            width: 4,
            height: 56,
            background: '#333',
            borderRadius: '4px 0 0 4px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -4,
            top: 150,
            width: 4,
            height: 72,
            background: '#333',
            borderRadius: '0 4px 4px 0',
          }}
        />

        {/* Pantalla */}
        <div
          style={{
            background: isLocked ? '#111' : 'var(--bg-main)',
            borderRadius: 38,
            overflow: 'hidden',
            position: 'relative',
            height: 724,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              background: isLocked ? '#111' : '#1d9e75',
              padding: '10px 20px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.3s',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>
              {time}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'white' }}>●●●</span>
              <span style={{ fontSize: 11, color: 'white' }}>WiFi</span>
              <span style={{ fontSize: 11, color: 'white' }}>🔋</span>
            </div>
          </div>

          {isLocked ? (
            <PinPadScreen onUnlock={() => setIsLocked(false)} />
          ) : (
            <>
              {/* App top bar */}
              <div
                style={{
                  background: '#1d9e75',
                  padding: '0 16px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {screenTitle[tab]}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    Páramo de Santurbán
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    title="Cambiar tema"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: 18,
                      cursor: 'pointer',
                    }}
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </button>
                  <button
                    onClick={handleSync}
                    title="Sincronizar"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: 20,
                      padding: '5px 10px',
                      color: 'white',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {syncProgress !== null
                      ? `${syncProgress}%`
                      : `↑ ${pendingCount}`}
                  </button>
                </div>
              </div>

              {notification && (
                <div
                  style={{
                    background: '#222',
                    color: 'white',
                    fontSize: 12,
                    padding: '8px 16px',
                    textAlign: 'center',
                  }}
                >
                  {notification}
                </div>
              )}

              {syncProgress !== null && (
                <div style={{ height: 3, background: 'var(--border)' }}>
                  <div
                    style={{
                      height: 3,
                      width: `${syncProgress}%`,
                      background: '#1d9e75',
                      transition: 'width 0.4s',
                    }}
                  />
                </div>
              )}

              {pendingCount > 0 && syncProgress === null && (
                <div
                  style={{
                    background: '#fef3dc',
                    padding: '6px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#854f0b' }}>
                    {pendingCount} registro{pendingCount > 1 ? 's' : ''}{' '}
                    pendiente{pendingCount > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleSync}
                    style={{
                      fontSize: 10,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: '#854f0b',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sincronizar
                  </button>
                </div>
              )}

              {/* Scrollable content */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  background: 'var(--bg-main)',
                  paddingTop: 12,
                }}
              >
                {tab === 'dashboard' && (
                  <ScreenDashboard
                    records={records}
                    expeditions={expeditions}
                  />
                )}
                {tab === 'registros' && (
                  <ScreenRegistros
                    records={records}
                    setRecords={setRecords}
                    expeditions={expeditions}
                    showNotif={showNotif}
                  />
                )}
                {tab === 'expediciones' && (
                  <ScreenExpediciones
                    expeditions={expeditions}
                    setExpeditions={setExpeditions}
                    showNotif={showNotif}
                  />
                )}
                {tab === 'especies' && <ScreenEspecies records={records} />}
              </div>

              {/* Bottom nav */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderTop: '0.5px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '8px 0 4px',
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 12px',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: tab === item.id ? '#1d9e75' : 'var(--text-sec)',
                        fontWeight: tab === item.id ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </span>
                    {tab === item.id && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#1d9e75',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Android home bar */}
          <div
            style={{
              background: isLocked ? '#111' : 'var(--bg-card)',
              display: 'flex',
              justifyContent: 'center',
              padding: '10px 0',
              transition: 'background 0.3s',
            }}
          >
            <div
              style={{
                width: 120,
                height: 4,
                background: isLocked ? '#555' : 'var(--border)',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
