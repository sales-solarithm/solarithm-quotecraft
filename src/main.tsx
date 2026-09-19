import { Buffer } from 'buffer';

// Ensure global Buffer and global references are available immediately
if (typeof window !== 'undefined') {
  (window as unknown as { Buffer: typeof Buffer; global: typeof window }).Buffer = Buffer;
  (window as unknown as { Buffer: typeof Buffer; global: typeof window }).global = window;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Buffer: typeof Buffer; global: typeof globalThis }).Buffer = Buffer;
  (globalThis as unknown as { Buffer: typeof Buffer; global: typeof globalThis }).global = globalThis;
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

