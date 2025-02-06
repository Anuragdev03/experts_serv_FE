import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react'
if (import.meta.env.MODE === "production") {
  disableReactDevTools()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <Notifications />
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
