import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { domAnimation, LazyMotion } from 'framer-motion'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ReportsProvider } from './contexts/ReportsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ReportsProvider>
          <LazyMotion features={domAnimation}>
            <App />
          </LazyMotion>
        </ReportsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
