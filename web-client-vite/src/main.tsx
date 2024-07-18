import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter basename='/'>
      <HelmetProvider>
        <App />
      </HelmetProvider>
      <Toaster />
    </BrowserRouter>
  // </React.StrictMode>,
)
