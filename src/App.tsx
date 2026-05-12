import { useEffect, useState } from 'react';
import { GlobalStyles } from './components/GlobalStyles';
import { PinPadScreen } from './components/PinPadScreen';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './screens/Dashboard';
import { Registros } from './screens/Registros';
import { Expediciones } from './screens/Expediciones';
import { ExpedicionDetalle } from './screens/ExpedicionDetalle';
import { Especies } from './screens/Especies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_RECORDS, INITIAL_EXPEDITIONS } from './mockData';
import { COLORS } from './theme';
import type { Expedicion, RegistroBiologico, Tab } from './types';

const SCREEN_TITLE: Record<Tab, string> = {
  dashboard: 'Dashboard',
  registros: 'Registros',
  expediciones: 'Expediciones',
  especies: 'Catálogo',
};

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [time, setTime] = useState('');

  // Persistencia versionada (v2 purga entradas corruptas del bug de fecha array)
  const [records, setRecords] = useLocalStorage<RegistroBiologico[]>(
    'santurban_records',
    INITIAL_RECORDS,
  );
  const [expeditions, setExpeditions] = useLocalStorage<Expedicion[]>(
    'santurban_expeditions',
    INITIAL_EXPEDITIONS,
  );
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    'santurban_theme',
    false,
  );

  // Reloj del status bar
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    update();
    const t = setInterval(update, 30_000);
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

  // Al cambiar de tab, salir del detalle de expedición
  function handleTabChange(t: Tab) {
    setTab(t);
    setSelectedExpId(null);
  }

  const selectedExp = selectedExpId
    ? expeditions.find((e) => e.id === selectedExpId) ?? null
    : null;

  const topBarTitle = selectedExp
    ? selectedExp.nombre
    : SCREEN_TITLE[tab];

  return (
    // Fondo gris del escritorio
    <div
      data-theme={darkMode ? 'dark' : 'light'}
      style={{
        minHeight: '100vh',
        background: '#c8c8c8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <GlobalStyles />

      {/* Marco físico del teléfono */}
      <div
        style={{
          width: 375,
          background: '#1a1a1a',
          borderRadius: 48,
          padding: '12px',
          boxShadow: '0 32px 90px rgba(0,0,0,0.55)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Botones hardware izquierda */}
        {[120, 165, 232].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              left: -4,
              top,
              width: 4,
              height: top === 165 || top === 232 ? 56 : 32,
              background: '#333',
              borderRadius: '4px 0 0 4px',
            }}
          />
        ))}
        {/* Botón hardware derecha */}
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
              background: isLocked ? '#111' : COLORS.PRIMARY,
              padding: '10px 20px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.3s',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>
              {time}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'white' }}>●●●</span>
              <span style={{ fontSize: 11, color: 'white' }}>WiFi</span>
              <span style={{ fontSize: 11, color: 'white' }}>🔋</span>
            </div>
          </div>

          {/* ── PANTALLA BLOQUEADA ── */}
          {isLocked ? (
            <PinPadScreen onUnlock={() => setIsLocked(false)} />
          ) : (
            <>
              {/* Top bar con título y controles */}
              <TopBar
                title={topBarTitle}
                subtitle="Páramo de Santurbán"
                darkMode={darkMode}
                onToggleDark={() => setDarkMode((v) => !v)}
                pendingCount={pendingCount}
                syncProgress={syncProgress}
                onSync={handleSync}
                onBack={
                  selectedExp
                    ? () => setSelectedExpId(null)
                    : undefined
                }
              />

              {/* Toast de notificación */}
              {notification && (
                <div
                  style={{
                    background: '#1a1a1a',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '10px 18px',
                    textAlign: 'center',
                  }}
                >
                  {notification}
                </div>
              )}

              {/* Barra de progreso de sync */}
              {syncProgress !== null && (
                <div style={{ height: 3, background: 'var(--border)' }}>
                  <div
                    style={{
                      height: 3,
                      width: `${syncProgress}%`,
                      background: COLORS.PRIMARY_DARK,
                      transition: 'width 0.4s',
                    }}
                  />
                </div>
              )}

              {/* Banner de pendientes */}
              {pendingCount > 0 && syncProgress === null && (
                <div
                  style={{
                    background: COLORS.WARN_BG,
                    padding: '8px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 12, color: COLORS.WARN_FG, fontWeight: 600 }}>
                    {pendingCount} registro{pendingCount > 1 ? 's' : ''} pendiente
                    {pendingCount > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleSync}
                    style={{
                      fontSize: 12,
                      padding: '4px 12px',
                      borderRadius: 20,
                      background: COLORS.WARN_FG,
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    Sincronizar
                  </button>
                </div>
              )}

              {/* Contenido scrollable */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  background: 'var(--bg-main)',
                  paddingTop: 12,
                }}
              >
                {/* Detalle de expedición (overlay sobre la tab de expediciones) */}
                {selectedExp ? (
                  <ExpedicionDetalle
                    expedicion={selectedExp}
                    records={records}
                    onVolver={() => setSelectedExpId(null)}
                  />
                ) : (
                  <>
                    {tab === 'dashboard' && (
                      <Dashboard records={records} expeditions={expeditions} />
                    )}
                    {tab === 'registros' && (
                      <Registros
                        records={records}
                        setRecords={setRecords}
                        expeditions={expeditions}
                        showNotif={showNotif}
                      />
                    )}
                    {tab === 'expediciones' && (
                      <Expediciones
                        expeditions={expeditions}
                        setExpeditions={setExpeditions}
                        showNotif={showNotif}
                        onSelectExp={(id) => setSelectedExpId(id)}
                      />
                    )}
                    {tab === 'especies' && <Especies records={records} />}
                  </>
                )}
              </div>

              {/* Bottom navigation */}
              <BottomNav tab={tab} onChange={handleTabChange} />
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
