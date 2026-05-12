import { COLORS } from '../theme';

interface Props {
  title: string;
  subtitle: string;
  darkMode: boolean;
  onToggleDark: () => void;
  pendingCount: number;
  syncProgress: number | null;
  onSync: () => void;
  onBack?: () => void;
}

export function TopBar({
  title,
  subtitle,
  darkMode,
  onToggleDark,
  pendingCount,
  syncProgress,
  onSync,
  onBack,
}: Props) {
  return (
    <div
      style={{
        background: COLORS.PRIMARY,
        padding: '4px 14px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Volver"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: 'white',
              borderRadius: 999,
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ←
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={onToggleDark}
          title="Cambiar tema"
          aria-label="Cambiar tema"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: 'none',
            borderRadius: 999,
            width: 36,
            height: 36,
            fontSize: 18,
            cursor: 'pointer',
            color: 'white',
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={onSync}
          title="Sincronizar"
          aria-label="Sincronizar"
          style={{
            background: 'rgba(255,255,255,0.22)',
            border: 'none',
            borderRadius: 999,
            padding: '6px 12px',
            minHeight: 36,
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {syncProgress !== null ? `${syncProgress}%` : `↑ ${pendingCount}`}
        </button>
      </div>
    </div>
  );
}
