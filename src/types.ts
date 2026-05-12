// Dominio: Páramo de Santurbán — monitoreo de biodiversidad

export type TipoRegistro = 'especie' | 'degradacion' | 'riesgo';
export type SyncState = 'sync' | 'pending' | 'queue';
export type Severidad = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type EstadoExpedicion = 'En progreso' | 'Completada' | 'Cancelada';
export type TipoTerreno =
  | 'Páramo'
  | 'Bosque alto andino'
  | 'Humedal'
  | 'Roca'
  | 'Mixto';
export type Tab = 'dashboard' | 'registros' | 'expediciones' | 'especies';

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  estado:
    | 'En peligro'
    | 'Vulnerable'
    | 'Casi amenazado'
    | 'Preocupación menor';
}

export interface RegistroBiologico {
  id: number;
  tipo: TipoRegistro;
  especie: string | null;
  degradacion: string | null;
  severidad: Severidad | null;
  lat: number;
  lng: number;
  altitud: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  expedicion: string; // EXP-001
  notas: string;
  sync: SyncState;
  foto?: string; // placeholder
}

export interface Expedicion {
  id: string; // EXP-001
  nombre: string;
  zona: string;
  guardabosque: string;
  fecha: string; // YYYY-MM-DD
  ruta: string;
  tipoTerreno: TipoTerreno;
  registros: number;
  km: number;
  estado: EstadoExpedicion;
}

// ── Aliases del brief (compatibilidad) ─────────────────────────────────────
// El brief sugiere tipos con literales en español "Especie nativa" / "Foco de
// degradación" / "Riesgo ambiental". Mantenemos los enums internos cortos
// ('especie' | 'degradacion' | 'riesgo') y mapeamos con esta tabla.
export const TIPO_LABEL: Record<TipoRegistro, string> = {
  especie: 'Especie nativa',
  degradacion: 'Foco de degradación',
  riesgo: 'Riesgo ambiental',
};
