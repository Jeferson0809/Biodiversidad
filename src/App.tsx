import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- DATA INICIAL ---
const SPECIES = [
  { id: 1, nombre_comun: 'Frailejón', nombre_cientifico: 'Espeletia grandiflora', estado: 'Vulnerable' },
  { id: 2, nombre_comun: 'Cóndor de los Andes', nombre_cientifico: 'Vultur gryphus', estado: 'Casi amenazado' },
  { id: 3, nombre_comun: 'Oso de anteojos', nombre_cientifico: 'Tremarctos ornatus', estado: 'Vulnerable' },
];

const DEGRADATION_TYPES = ['Minería ilegal', 'Pastoreo excesivo', 'Quema', 'Tala', 'Contaminación hídrica'];

const INITIAL_RECORDS = [
  { id: 1, tipo: 'especie', especie: 'Frailejón', lat: 7.112, lng: -72.831, altitud: 3420, fecha: '2026-05-08', hora: '09:14', sync: 'sync', notas: 'Estado saludable' },
];

// --- SISTEMA DE ESTILOS PARA MODO OSCURO ---
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
    .leaflet-container { background: var(--bg-main); border-radius: 12px; }
  `}</style>
);

// --- COMPONENTES DE INTERFAZ ---
function Badge({ status }) {
  const styles = {
    sync: { bg: '#e9f7f1', color: '#0f6e56', label: '✓ Sincronizado' },
    pending: { bg: '#fef3dc', color: '#854f0b', label: '⏳ Pendiente' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
      {s.label}
    </span>
  );
}

// --- PANTALLA DE PIN (RNF3) ---
function PinPadScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const CORRECT_PIN = '1234'; 
  const handleKey = (n) => {
    if (pin.length < 4) {
      const next = pin + n;
      setPin(next);
      if (next === CORRECT_PIN) setTimeout(onUnlock, 300);
      else if (next.length === 4) setTimeout(() => setPin(''), 500);
    }
  };
  return (
    <div style={{ height: '100%', background: '#111', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 64, height: 64, background: '#1d9e75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>🌿</div>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Santurbán App</h2>
      <p style={{ color: '#aaa', marginBottom: 32 }}>Ingrese PIN de seguridad (RNF3)</p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < pin.length ? 'white' : '#333' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['1','2','3','4','5','6','7','8','9','C','0'].map(k => (
          <button key={k} onClick={() => k === 'C' ? setPin('') : handleKey(k)} style={{ width: 64, height: 64, borderRadius: 32, border: 'none', background: '#2c2c2e', color: 'white', fontSize: 24 }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL ---
export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [tab, setTab] = useState('dashboard');
  
  // Persistencia y Modo Oscuro 
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('records')) || INITIAL_RECORDS);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('records', JSON.stringify(records));
  }, [darkMode, records]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'registros', label: 'Registros', icon: '🌿' },
  ];

  return (
    <div data-theme={darkMode ? 'dark' : 'light'} style={{ minHeight: '100vh', background: '#d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlobalStyles />
      <div style={{ width: 375, height: 750, background: '#1a1a1a', borderRadius: 48, padding: '12px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ background: isLocked ? '#111' : 'var(--bg-main)', borderRadius: 38, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {isLocked ? (
            <PinPadScreen onUnlock={() => setIsLocked(false)} />
          ) : (
            <>
              {/* Header con Toggle de Modo Oscuro */}
              <div style={{ background: '#1d9e75', padding: '40px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: 'white', fontSize: 18, margin: 0 }}>Santurbán</h1>
                <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

              {/* Contenido Dinámico */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {tab === 'dashboard' && (
                  <>
                    <h3 style={{ color: 'var(--text-main)', fontSize: 14 }}>Mapa del Páramo</h3>
                    <div style={{ height: 250, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                      <MapContainer center={[7.11, -72.83]} zoom={12} style={{ height: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {records.map(r => <CircleMarker key={r.id} center={[r.lat, r.lng]} radius={6} color="#1d9e75" />)}
                      </MapContainer>
                    </div>
                  </>
                )}
                {tab === 'registros' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {records.map(r => (
                      <div key={r.id} style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--text-main)' }}>{r.especie || 'Degradación'}</strong>
                          <Badge status={r.sync} />
                        </div>
                        <p style={{ color: 'var(--text-sec)', fontSize: 12 }}>{r.notas}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navegación Inferior */}
              <div style={{ background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-around', padding: '12px 0 20px', borderTop: '1px solid var(--border)' }}>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setTab(item.id)} style={{ background: 'none', border: 'none', color: tab === item.id ? '#1d9e75' : 'var(--text-sec)' }}>
                    <div style={{ fontSize: 20 }}>{item.icon}</div>
                    <div style={{ fontSize: 10 }}>{item.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
