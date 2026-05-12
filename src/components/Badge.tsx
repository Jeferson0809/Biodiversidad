import type { SyncState } from '../types';
import { COLORS } from '../theme';

const STYLES: Record<SyncState, { bg: string; color: string; label: string }> = {
  sync: { bg: COLORS.OK_BG, color: COLORS.OK_FG, label: '✓ Sincronizado' },
  pending: { bg: COLORS.WARN_BG, color: COLORS.WARN_FG, label: '⏳ Pendiente' },
  queue: { bg: COLORS.INFO_BG, color: COLORS.INFO_FG, label: '↑ En cola' },
};

export function Badge({ status }: { status: SyncState }) {
  const s = STYLES[status] ?? STYLES.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 12,
        padding: '3px 10px',
        borderRadius: 20,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}
