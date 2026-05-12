import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { RegistroBiologico, Severidad, TipoRegistro } from '../types';
import { COLORS } from '../theme';

// "Capa de calor" aproximada — sin instalar leaflet.heat. Escalamos radio y
// opacidad según tipo+severidad para que zonas críticas resalten visualmente.
// Para un heatmap real (gradient continuo) la opción sería añadir la dep
// `leaflet.heat`; se omite para respetar la restricción de no agregar libs.

const SEVERIDAD_RADIUS: Record<Severidad, number> = {
  Baja: 8,
  Media: 11,
  Alta: 15,
  Crítica: 20,
};

const TIPO_COLOR: Record<TipoRegistro, string> = {
  especie: COLORS.PRIMARY_DARK, // verde
  degradacion: COLORS.ACCENT_ORANGE, // naranja
  riesgo: COLORS.DANGER_FG, // rojo
};

interface Props {
  records: RegistroBiologico[];
}

export function Mapa({ records }: Props) {
  return (
    <div
      style={{
        height: 300,
        width: '100%',
        marginBottom: 16,
        border: '0.5px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={[7.11, -72.83]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {records.map((rec) => {
          const radius = rec.severidad ? SEVERIDAD_RADIUS[rec.severidad] : 7;
          const fillOpacity = rec.tipo === 'especie' ? 0.7 : 0.85;
          return (
            <CircleMarker
              key={rec.id}
              center={[rec.lat, rec.lng]}
              radius={radius}
              pathOptions={{
                color: 'white',
                weight: 1.5,
                fillColor: TIPO_COLOR[rec.tipo],
                fillOpacity,
              }}
            >
              <Popup>
                <strong>
                  {rec.tipo === 'especie'
                    ? '🌿 ' + (rec.especie ?? 'Especie')
                    : rec.tipo === 'riesgo'
                      ? '🚨 ' + (rec.degradacion ?? 'Riesgo')
                      : '⚠️ ' + (rec.degradacion ?? 'Degradación')}
                </strong>
                <br />
                {rec.notas || 'Sin notas'}
                <br />
                <span style={{ fontSize: 11, color: 'gray' }}>
                  {rec.lat.toFixed(4)}, {rec.lng.toFixed(4)} · {rec.altitud} m
                </span>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
