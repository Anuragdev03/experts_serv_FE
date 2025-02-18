import './App.css'
import RouteWrapper from './routes';
import '@mantine/core/styles.css';
import "@mantine/notifications/styles.css";
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import { AuthProvider } from './authProvider/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <RouteWrapper />
    </AuthProvider>
  )
}

export default App
