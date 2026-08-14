import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext.jsx';
export const authService = 'http://localhost:1000'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<GoogleOAuthProvider clientId="203133689137-v7rnptgffrcd28cmsrjg1r73f0ojs5u5.apps.googleusercontent.com"><AppProvider><App/></AppProvider></GoogleOAuthProvider>
  </StrictMode>,
)
