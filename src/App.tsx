import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SPECIES = [
  { id: 1, nombre_comun: "Frailejón", nombre_cientifico: "Espeletia grandiflora", estado: "Vulnerable" },
  { id: 2, nombre_comun: "Cóndor de los Andes", nombre_cientifico: "Vultur gryphus", estado: "Casi amenazado" },
  { id: 3, nombre_comun: "Oso de anteojos", nombre_cientifico: "Tremarctos ornatus", estado: "Vulnerable" },
  { id: 4, nombre_comun: "Danta de montaña", nombre_cientifico: "Tapirus pinchaque", estado: "En peligro" },
  { id: 5, nombre_comun: "Puma", nombre_cientifico: "Puma concolor", estado: "Preocupación menor" },
  { id: 6, nombre_comun: "Colibrí del páramo", nombre_cientifico: "Oxypogon guerinii", estado: "Vulnerable" },
];

const DEGRADATION_TYPES = ["Minería ilegal", "Pastoreo excesivo", "Quema", "Tala", "Contaminación hídrica"];

const INITIAL_RECORDS = [
  { id: 1, tipo: "especie", especie: "Frailejón", lat: 7.112, lng: -72.831, altitud: 3420, precision: 4, fecha: "2026-05-08", hora: "09:14", expedicion: "EXP-001", notas: "Colonia de 40+ ejemplares", sync: "sync", severidad: null, degradacion: null },
  { id: 2, tipo: "degradacion", especie: null, lat: 7.098, lng: -72.845, altitud: 3210, precision: 12, fecha: "2026-05-08", hora: "11:32", expedicion: "EXP-001", notas: "Evidencia de pastoreo bovino", sync: "sync", severidad: "Alta", degradacion: "Pastoreo excesivo" },
  { id: 3, tipo: "especie", especie: "Oso de anteojos", lat: 7.125, lng: -72.819, altitud: 3580, precision: 5, fecha: "2026-05-09", hora: "06:45", expedicion: "EXP-002", notas: "Rastros frescos", sync: "pending", severidad: null, degradacion: null },
];

const EXPEDITIONS = [
  { id: "EXP-001", guardabosque: "Carlos P.", fecha: "2026-05-08", ruta: "Sector Angostura", estado: "Completada" },
  { id: "EXP-002", guardabosque: "María L.", fecha: "2026-05-09", ruta: "Sector La Baja", estado: "Pausada" },
  { id: "EXP-003", guardabosque: "Juan T.", fecha: "2026-05-10", ruta: "Ruta Central", estado: "En progreso" },
];

const GRID_CELLS = (() => {
  const cells: any[] = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 18; c++) {
      let intensity = 0;
      INITIAL_RECORDS.forEach(rec => {
        const normLat = (rec.lat - 7.080) / (7.140 - 7.080);
        const normLng = (rec.lng - -72.870) / (-72.800 - -72.870);
        const cellR = 11 - Math.floor(normLat * 12);
        const cellC = Math.floor(normLng * 18);
        const dr = Math.abs(r - cellR);
        const dc = Math.abs(c - cellC);
        const dist = Math.sqrt(dr * dr + dc * dc);
        if (dist < 3.5) {
          const contrib = rec.tipo === "degradacion" ? 2 : 1;
          intensity += contrib * Math.exp(-dist * 0.6);
        }
      });
      cells.push({ r, c, intensity });
    }
  }
  return cells;
})();

const maxIntensity = Math.max(...GRID_CELLS.map((c: any) => c.intensity));

// ─── STYLES (DARK MODE & 48DP RULE) ──────────────────────────────────────────

const theme = {
  bgApp: "#000000",
  bgCard: "#1C1C1E",
  bgInput: "#2C2C2E",
  textMain: "#FFFFFF",
  textMuted: "#A1A1AA",
  primary: "#34D399", // High contrast green
  danger: "#F87171",  // High contrast red
  warning: "#FBBF24",
  border: "#333333"
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", fontSize: 14, 
  padding: "12px", border: `1px solid ${theme.border}`, 
  borderRadius: 8, background: theme.bgInput, color: theme.textMain,
  minHeight: "48px" // RNF2: Usabilidad 48x48dp
};

const btnStyle: React.CSSProperties = {
  minHeight: "48px", minWidth: "48px", borderRadius: 8, // RNF2: Usabilidad 48x48dp
  border: "none", fontWeight: 600, cursor: "pointer", 
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ status }: { status: string }) {
  const styles: any = {
    sync:    { bg: "rgba(52, 211, 153, 0.2)", color: theme.primary, label: "✓ Sincronizado" },
    pending: { bg: "rgba(251, 191, 36, 0.2)", color: theme.warning, label: "⏳ Pendiente" },
    queue:   { bg: "rgba(96, 165, 250, 0.2)", color: "#60A5FA", label: "↑ En cola" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 12, padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, color }: any) {
  return (
    <div style={{ background: theme.bgCard, borderRadius: 10, padding: "12px", border: `1px solid ${theme.border}` }}>
      <p style={{ fontSize: 11, color: theme.textMuted, margin: "0 0 4px", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, margin: "0 0 2px", color: color || theme.textMain }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: theme.textMuted, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function NewRecordForm({ onSave, onCancel, expeditions }: any) {
  const [tipo, setTipo] = useState("especie");
  const [especie, setEspecie] = useState(SPECIES.nombre_comun);
  const [degradacion, setDegradacion] = useState(DEGRADATION_TYPES);
  const [severidad, setSeveridad] = useState("Media");
  const [notas, setNotas] = useState("");
  const [expedicion, setExpedicion] = useState(expeditions?.id || "");

  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: theme.textMain }}>Nuevo Registro Georreferenciado</p>
      
      {/* Sensor Mock Data (RF2) */}
      <div style={{ background: "#222", padding: 8, borderRadius: 8, marginBottom: 12, fontSize: 11, color: theme.primary, fontFamily: "monospace" }}>
        <span>📍 GPS Activo: ±3.2m precisión</span><br/>
        <span>⛰ Barómetro: 3420m (Calibrado)</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["especie", "degradacion"].map(t => (
          <button key={t} onClick={() => setTipo(t)} 
            style={{ ...btnStyle, flex: 1, 
              background: tipo === t ? theme.primary : theme.bgInput, 
              color: tipo === t ? "#000" : theme.textMain,
              border: tipo === t ? "none" : `1px solid ${theme.border}` }}>
            {t === "especie" ? "🌿 Especie" : "⚠️ Foco"}
          </button>
        ))}
      </div>

      {tipo === "especie" ? (
        <select value={especie} onChange={e => setEspecie(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
          {SPECIES.map(s => <option key={s.id} value={s.nombre_comun}>{s.nombre_comun}</option>)}
        </select>
      ) : (
        <>
          <select value={degradacion} onChange={e => setDegradacion(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
            {DEGRADATION_TYPES.map(d => <option key={d}>{d}</option>)}
          </select>
          <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 4px" }}>Severidad</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {["Baja", "Media", "Alta", "Crítica"].map(s => (
              <button key={s} onClick={() => setSeveridad(s)} 
                style={{ ...btnStyle, flex: 1, fontSize: 12,
                  background: severidad === s ? theme.danger : theme.bgInput, 
                  color: severidad === s ? "#000" : theme.textMain }}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <select value={expedicion} onChange={e => setExpedicion(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
        {expeditions.map((ex: any) => <option key={ex.id} value={ex.id}>{ex.id} — {ex.ruta}</option>)}
      </select>

      <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3} placeholder="Notas de campo..." style={{ ...inputStyle, resize: "none", marginBottom: 16 }} />

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ ...btnStyle, flex: 1, background: theme.bgInput, color: theme.textMain, border: `1px solid ${theme.border}` }}>Cancelar</button>
        <button onClick={() => onSave({ tipo, especie, degradacion, severidad, lat: 7.110, lng: -72.830, altitud: 3420, precision: 3, notas, expedicion, sync: "pending" })}
          style={{ ...btnStyle, flex: 1, background: theme.primary, color: "#000" }}>Guardar Registro</button>
      </div>
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function ScreenDashboard({ records, expeditions }: any) {
  const pendingCount = records.filter((r: any) => r.sync !== "sync").length;
  
  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <StatCard label="Registros" value={records.length} sub={`${pendingCount} offline`} color="#60A5FA" />
        <StatCard label="Especies" value={records.filter((r: any) => r.tipo === "especie").length} sub="avistadas" color={theme.primary} />
        <StatCard label="Focos" value={records.filter((r: any) => r.tipo === "degradacion").length} sub="detectados" color={theme.danger} />
        <StatCard label="Expediciones" value={expeditions.length} sub="Activas" color={theme.warning} />
      </div>
      
      <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 8px", textTransform: "uppercase", fontWeight: 600 }}>Mapa de calor Offline</p>
      <div style={{ background: "#111", border: `1px solid ${theme.border}`, borderRadius: 8, height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMuted, fontSize: 12 }}>
        [Mapa Geoespacial Renderizado]
      </div>
    </div>
  );
}

function ScreenRegistros({ records, setRecords, expeditions, showNotif }: any) {
  const [showForm, setShowForm] = useState(false);

  function handleSave(data: any) {
    const rec = { id: Date.now(), ...data, fecha: new Date().toISOString().split("T"), hora: new Date().toTimeString().slice(0, 5) };
    setRecords((prev: any[]) => [rec, ...prev]);
    setShowForm(false);
    showNotif("Registro cifrado y guardado localmente");
  }

  return (
    <div style={{ padding: "0 16px 80px" }}>
      <button onClick={() => setShowForm(v => !v)} style={{ ...btnStyle, width: "100%", background: theme.primary, color: "#000", marginBottom: 16 }}>
        + Capturar Nuevo Registro
      </button>
      
      {showForm && <NewRecordForm onSave={handleSave} onCancel={() => setShowForm(false)} expeditions={expeditions} />}
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {records.map((rec: any) => (
          <div key={rec.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: theme.textMain }}>{rec.tipo === "especie" ? "🌿 " : "⚠️ "}{rec.tipo === "especie" ? rec.especie : rec.degradacion}</span>
              <Badge status={rec.sync} />
            </div>
            {rec.severidad && <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: theme.danger, color: "#000", display: "inline-block", marginBottom: 8, fontWeight: 600 }}>{rec.severidad}</span>}
            <p style={{ margin: "0 0 8px", fontSize: 13, color: theme.textMuted }}>{rec.notas || "Sin notas"}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#777", fontFamily: "monospace" }}>
              LAT: {rec.lat} LNG: {rec.lng} | ALT: {rec.altitud}m | ±{rec.precision}m<br/>
              {rec.fecha} {rec.hora}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenExpediciones({ expeditions, setExpeditions, showNotif }: any) {
  function toggleEstado(id: string, current: string) {
    const next = current === "En progreso" ? "Pausada" : current === "Pausada" ? "En progreso" : "Completada";
    setExpeditions((prev: any[]) => prev.map(e => e.id === id ? { ...e, estado: next } : e));
    showNotif(`Expedición ${next}`);
  }

  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {expeditions.map((exp: any) => (
          <div key={exp.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: theme.textMain }}>{exp.id}</span>
              <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 4, background: exp.estado === "En progreso" ? theme.primary : theme.bgInput, color: exp.estado === "En progreso" ? "#000" : theme.textMain, fontWeight: 600 }}>{exp.estado}</span>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: theme.textMuted }}>{exp.ruta} • Resp: {exp.guardabosque}</p>
            
            {exp.estado !== "Completada" && (
              <button onClick={() => toggleEstado(exp.id, exp.estado)} style={{ ...btnStyle, width: "100%", background: theme.bgInput, color: theme.textMain, border: `1px solid ${theme.border}` }}>
                {exp.estado === "En progreso" ? "⏸ Pausar Tracking GPS" : "▶️ Reanudar Tracking"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  
  const handleInput = (val: string) => {
    const newPin = pin + val;
    setPin(newPin);
    if (newPin.length === 4) setTimeout(onLogin, 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 24 }}>🌿</div>
      <h2 style={{ color: theme.textMain, margin: "0 0 8px" }}>Santurbán App</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 32 }}>Ingrese PIN de seguridad (RNF3)</p>
      
      <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: i < pin.length ? theme.primary : theme.bgInput, border: `1px solid ${theme.border}` }} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, width: "100%", maxWidth: 280 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "C"].map((num, i) => (
          <button key={i} onClick={() => num === "C" ? setPin("") : num !== "" && pin.length < 4 ? handleInput(num.toString()) : null}
            style={{ ...btnStyle, background: num === "" ? "transparent" : theme.bgInput, color: theme.textMain, fontSize: 24, height: 64 }}>
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [records, setRecords] = useState<any[]>(INITIAL_RECORDS);
  const [expeditions, setExpeditions] = useState<any[]>(EXPEDITIONS);
  const [notification, setNotification] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const pendingCount = records.filter(r => r.sync !== "sync").length;

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function handleSync() {
    if (pendingCount === 0) { showNotif("Base de datos local sincronizada ✓"); return; }
    setSyncProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSyncProgress(Math.round((step / pendingCount) * 100));
      if (step >= pendingCount) {
        clearInterval(interval);
        setRecords(prev => prev.map(r => ({ ...r, sync: "sync" })));
        setSyncProgress(null);
        showNotif(`Carga asíncrona completada. Checksum validado ✓`);
      }
    }, 800);
  }

  const navItems = [
    { id: "dashboard", label: "Panel", icon: "📊" },
    { id: "registros", label: "Captura", icon: "📸" },
    { id: "expediciones", label: "Rutas", icon: "🧭" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ width: 375, height: 812, background: theme.bgApp, borderRadius: 40, overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", border: "8px solid #111" }}>
        
        {/* Status Bar */}
        <div style={{ padding: "14px 24px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.bgApp }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.textMain }}>{time}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 12, color: theme.textMain }}>GPS</span>
            <span style={{ fontSize: 12, color: theme.textMain }}>🔋 85%</span>
          </div>
        </div>

        {!isAuthenticated ? (
          <AuthScreen onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <>
            {/* Top Bar */}
            <div style={{ padding: "10px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.bgApp, borderBottom: `1px solid ${theme.border}` }}>
              <div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.textMain }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                <p style={{ margin: 0, fontSize: 11, color: theme.textMuted }}>Modo Offline-First Activado</p>
              </div>
              <button onClick={handleSync} style={{ ...btnStyle, minWidth: "auto", padding: "0 16px", background: "rgba(52, 211, 153, 0.1)", color: theme.primary, border: `1px solid ${theme.primary}` }}>
                {syncProgress !== null ? `${syncProgress}%` : `↑ Sync (${pendingCount})`}
              </button>
            </div>

            {/* Notification */}
            {notification && (
              <div style={{ position: "absolute", top: 80, left: 16, right: 16, background: theme.primary, color: "#000", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: "center", zIndex: 10 }}>
                {notification}
              </div>
            )}

            {/* Content Area */}
            <div style={{ height: 630, overflowY: "auto", background: theme.bgApp, paddingTop: 16 }}>
              {tab === "dashboard" && <ScreenDashboard records={records} expeditions={expeditions} />}
              {tab === "registros" && <ScreenRegistros records={records} setRecords={setRecords} expeditions={expeditions} showNotif={showNotif} />}
              {tab === "expediciones" && <ScreenExpediciones expeditions={expeditions} setExpeditions={setExpeditions} showNotif={showNotif} />}
            </div>

            {/* Bottom Nav */}
            <div style={{ position: "absolute", bottom: 0, width: "100%", background: theme.bgCard, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-around", padding: "12px 0 24px" }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)} 
                  style={{ ...btnStyle, flexDirection: "column", background: "transparent", color: tab === item.id ? theme.primary : theme.textMuted, flex: 1 }}>
                  <span style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</span>
                  <span style={{ fontSize: 11 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
