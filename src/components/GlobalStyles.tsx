import { COLORS } from '../theme';

export function GlobalStyles() {
  return (
    <style>{`
      :root {
        --bg-main: #f2f2f7;
        --bg-card: #ffffff;
        --text-main: #111111;
        --text-sec: #555555; /* contraste subido (antes #777) */
        --border: #d8d8dc;
        --primary: ${COLORS.PRIMARY};
        --primary-dark: ${COLORS.PRIMARY_DARK};
        --primary-light: ${COLORS.PRIMARY_LIGHT};
      }
      [data-theme='dark'] {
        --bg-main: #1c1c1e;
        --bg-card: #2c2c2e;
        --text-main: #f2f2f7;
        --text-sec: #c4c4c8; /* contraste subido (antes #aaa) */
        --border: #3a3a3c;
      }
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; }
      button { font-family: inherit; }
      .leaflet-container {
        background: var(--bg-main);
        border-radius: 12px;
        z-index: 1;
      }
      /* Hit-area mínima en controles táctiles */
      .touch-cta { min-height: 52px; min-width: 52px; }
      .touch-nav { min-height: 56px; }
      .touch-pill { min-height: 36px; }
    `}</style>
  );
}
