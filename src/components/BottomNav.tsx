import type { Tab } from '../types';
import { COLORS } from '../theme';

interface NavItem {
  id: Tab;
  label: string;
  icon: string;
}

const ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'registros', label: 'Registros', icon: '🌿' },
  { id: 'expediciones', label: 'Expediciones', icon: '🧭' },
  { id: 'especies', label: 'Catálogo', icon: '📋' },
];

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export function BottomNav({ tab, onChange }: Props) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderTop: '0.5px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 0 4px',
      }}
    >
      {ITEMS.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="touch-nav"
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 10,
              minWidth: 64,
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 12,
                color: active ? COLORS.PRIMARY_DARK : 'var(--text-sec)',
                fontWeight: active ? 700 : 500,
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: active ? COLORS.PRIMARY_DARK : 'transparent',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
