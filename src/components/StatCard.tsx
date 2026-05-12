interface Props {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

export function StatCard({ label, value, sub, color }: Props) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: 12,
        padding: '12px 14px',
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
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 24,
          fontWeight: 600,
          margin: '0 0 2px',
          color: color || 'var(--text-main)',
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, color: 'var(--text-sec)', margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}
