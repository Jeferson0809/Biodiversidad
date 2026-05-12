import { useState, type CSSProperties } from 'react';
import type { Expedicion, TipoTerreno } from '../types';
import { COLORS, TOUCH } from '../theme';

const TERRENOS: TipoTerreno[] = [
  'Páramo',
  'Bosque alto andino',
  'Humedal',
  'Roca',
  'Mixto',
];

interface Props {
  expeditions: Expedicion[];
  onSave: (exp: Expedicion) => void;
  onCancel: () => void;
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

const today = new Date().toISOString().split('T')[0]; // FIX B5: sólo la fecha

export function NewExpedicionForm({ expeditions, onSave, onCancel }: Props) {
  const [nombre, setNombre] = useState('');
  const [zona, setZona] = useState('');
  const [fecha, setFecha] = useState(today);
  const [tipoTerreno, setTipoTerreno] = useState<TipoTerreno>('Páramo');
  const [guardabosque, setGuardabosque] = useState('');
  const [ruta, setRuta] = useState('');

  function save() {
    // FIX B6: id generado de forma segura, sin colisiones
    const maxNum = expeditions.reduce((acc, e) => {
      const n = parseInt(e.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? acc : Math.max(acc, n);
    }, 0);
    const newId = `EXP-${String(maxNum + 1).padStart(3, '0')}`;

    onSave({
      id: newId,
      nombre: nombre.trim() || 'Expedición sin nombre',
      zona: zona.trim() || 'Zona sin especificar',
      fecha, // siempre YYYY-MM-DD (fix B5)
      tipoTerreno,
      guardabosque: guardabosque.trim() || 'Sin asignar',
      ruta: ruta.trim() || 'Ruta sin nombre',
      registros: 0,
      km: 0,
      estado: 'En progreso',
    });
  }

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
          margin: '0 0 12px',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-main)',
        }}
      >
        Nueva expedición
      </p>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la expedición *"
        style={{ ...inpStyle, marginBottom: 10 }}
      />
      <input
        value={zona}
        onChange={(e) => setZona(e.target.value)}
        placeholder="Zona / sector (ej: Sector A — 3.200 msnm)"
        style={{ ...inpStyle, marginBottom: 10 }}
      />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={{ ...inpStyle, marginBottom: 10 }}
      />
      <select
        value={tipoTerreno}
        onChange={(e) => setTipoTerreno(e.target.value as TipoTerreno)}
        style={{ ...inpStyle, marginBottom: 10 }}
      >
        {TERRENOS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        value={guardabosque}
        onChange={(e) => setGuardabosque(e.target.value)}
        placeholder="Guardabosque responsable"
        style={{ ...inpStyle, marginBottom: 10 }}
      />
      <input
        value={ruta}
        onChange={(e) => setRuta(e.target.value)}
        placeholder="Ruta / descripción de camino"
        style={{ ...inpStyle, marginBottom: 14 }}
      />

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
          onClick={save}
          className="touch-cta"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            background: COLORS.INFO_FG,
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: TOUCH.FONT_ACTION,
          }}
        >
          Iniciar
        </button>
      </div>
    </div>
  );
}
