import { AppRouter } from './presentation/router/AppRouter';
import { AuthProvider } from './presentation/context/AuthContext';
import { ServerWakeProvider } from './presentation/context/ServerWakeContext';
import { ServerWakeBanner } from './presentation/components/ServerWakeBanner';
import { useEffect } from 'react';
import { set_wake_state_callbacks } from './infrastructure/api/axios_client';
import { use_server_wake } from './presentation/context/ServerWakeContext';

/**
 * Componente interno que conecta el contexto de "despertar servidor" con axios
 * Debe estar dentro de ServerWakeProvider para poder usar el hook
 */
const WakeStateConnector = () => {
    const { set_is_waking_up, set_retry_count } = use_server_wake();

    useEffect(() => {
        set_wake_state_callbacks({
            set_is_waking_up,
            set_retry_count
        });
    }, [set_is_waking_up, set_retry_count]);

    return null;
};

function App() {
  return (
    <ServerWakeProvider>
      <WakeStateConnector />
      <AuthProvider>
        <ServerWakeBanner />
        <AppRouter />
      </AuthProvider>
    </ServerWakeProvider>
  );
}

export default App;
