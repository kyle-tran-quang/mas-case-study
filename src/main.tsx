import { createRoot } from 'react-dom/client'
import App from './App'

// No StrictMode: the scene engine starts once and attaches window listeners, so a dev double-mount would run it twice.
createRoot(document.getElementById('root')!).render(<App />)
