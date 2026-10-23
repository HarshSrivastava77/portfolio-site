import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

console.log('%cHi, fellow engineer.%c\nType /critic anywhere on the page.', 'font:600 15px Poppins,sans-serif;background:#E5A8F5;color:#000;padding:4px 8px;border-radius:6px', 'font:13px Poppins,sans-serif');
