import type {
  Especie,
  Expedicion,
  RegistroBiologico,
  Severidad,
} from './types';

export const SPECIES: Especie[] = [
  { id: 1, nombre_comun: 'Frailejón', nombre_cientifico: 'Espeletia grandiflora', estado: 'Vulnerable' },
  { id: 2, nombre_comun: 'Cóndor de los Andes', nombre_cientifico: 'Vultur gryphus', estado: 'Casi amenazado' },
  { id: 3, nombre_comun: 'Oso de anteojos', nombre_cientifico: 'Tremarctos ornatus', estado: 'Vulnerable' },
  { id: 4, nombre_comun: 'Danta de montaña', nombre_cientifico: 'Tapirus pinchaque', estado: 'En peligro' },
  { id: 5, nombre_comun: 'Puma', nombre_cientifico: 'Puma concolor', estado: 'Preocupación menor' },
  { id: 6, nombre_comun: 'Colibrí del páramo', nombre_cientifico: 'Oxypogon guerinii', estado: 'Vulnerable' },
];

export const DEGRADATION_TYPES: string[] = [
  'Minería ilegal',
  'Pastoreo excesivo',
  'Quema',
  'Tala',
  'Contaminación hídrica',
];

export const RIESGO_TYPES: string[] = [
  'Quema reciente',
  'Deslizamiento',
  'Crecida súbita',
  'Avistamiento de cazadores',
];

export const SEVERIDADES: Severidad[] = ['Baja', 'Media', 'Alta', 'Crítica'];

export const INITIAL_RECORDS: RegistroBiologico[] = [
  {
    id: 1,
    tipo: 'especie',
    especie: 'Frailejón',
    degradacion: null,
    severidad: null,
    lat: 7.112,
    lng: -72.831,
    altitud: 3420,
    fecha: '2026-05-08',
    hora: '09:14',
    expedicion: 'EXP-001',
    notas: 'Colonia de 40+ ejemplares, estado saludable',
    sync: 'sync',
  },
  {
    id: 2,
    tipo: 'degradacion',
    especie: null,
    degradacion: 'Pastoreo excesivo',
    severidad: 'Alta',
    lat: 7.098,
    lng: -72.845,
    altitud: 3210,
    fecha: '2026-05-08',
    hora: '11:32',
    expedicion: 'EXP-001',
    notas: 'Evidencia de pastoreo bovino en zona protegida — área aprox. 200 m²',
    sync: 'sync',
  },
  {
    id: 3,
    tipo: 'especie',
    especie: 'Oso de anteojos',
    degradacion: null,
    severidad: null,
    lat: 7.125,
    lng: -72.819,
    altitud: 3580,
    fecha: '2026-05-09',
    hora: '06:45',
    expedicion: 'EXP-002',
    notas: 'Rastros frescos, posible hembra con cría',
    sync: 'pending',
  },
  {
    id: 4,
    tipo: 'riesgo',
    especie: null,
    degradacion: 'Quema reciente',
    severidad: 'Crítica',
    lat: 7.145,
    lng: -72.985,
    altitud: 3460,
    fecha: '2026-05-10',
    hora: '14:02',
    expedicion: 'EXP-002',
    notas: 'Quema reciente detectada en ladera norte — extensión visible 1 ha',
    sync: 'pending',
  },
];

export const INITIAL_EXPEDITIONS: Expedicion[] = [
  {
    id: 'EXP-001',
    nombre: 'Ruta Berlín Norte',
    zona: 'Sector A — 3.200 msnm',
    guardabosque: 'Carlos Pérez',
    fecha: '2026-05-01',
    ruta: 'Ruta Norte - Sector Angostura',
    tipoTerreno: 'Páramo',
    registros: 2,
    km: 14.2,
    estado: 'Completada',
  },
  {
    id: 'EXP-002',
    nombre: 'Quebrada Honda',
    zona: 'Sector C — 3.800 msnm',
    guardabosque: 'María Rojas',
    fecha: '2026-04-28',
    ruta: 'Ruta Quebrada Honda',
    tipoTerreno: 'Bosque alto andino',
    registros: 2,
    km: 9.6,
    estado: 'En progreso',
  },
  {
    id: 'EXP-003',
    nombre: 'Laguna Pajarito',
    zona: 'Sector B — 3.500 msnm',
    guardabosque: 'Andrés Vargas',
    fecha: '2026-04-20',
    ruta: 'Laguna Pajarito vía Cruz',
    tipoTerreno: 'Humedal',
    registros: 0,
    km: 6.1,
    estado: 'Completada',
  },
];
