import { useState } from 'react';
import { COLORS } from '../theme';

const MAX_LENGTH = 4;
const CORRECT_PIN = '1234';

export function PinPadScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length >= MAX_LENGTH) return;
    const newPin = pin + num;
    setPin(newPin);
    if (newPin.length === MAX_LENGTH) {
      if (newPin === CORRECT_PIN) {
        setTimeout(onUnlock, 300);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 400);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'C'];

  return (
    <div
      style={{
        flex: 1,
        background: '#111',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: COLORS.PRIMARY_DARK,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 16,
        }}
      >
        🌿
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>
        Santurbán App
      </h2>
      <p
        style={{
          margin: '0 0 28px',
          fontSize: 13,
          color: error ? '#ff5b50' : '#ccc',
        }}
      >
        {error ? 'PIN Incorrecto' : 'Ingrese PIN de seguridad (demo: 1234)'}
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
        {[...Array(MAX_LENGTH)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: error ? '#ff5b50' : i < pin.length ? 'white' : '#333',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          width: 240,
        }}
      >
        {keys.map((key, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
            {key ? (
              <button
                onClick={() => (key === 'C' ? setPin('') : handleNumberClick(key))}
                aria-label={key === 'C' ? 'Borrar' : `Tecla ${key}`}
                style={{
                  width: 64,
                  height: 64,
                  background: '#2c2c2e',
                  border: 'none',
                  borderRadius: 32,
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {key}
              </button>
            ) : (
              <div style={{ width: 64, height: 64 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
