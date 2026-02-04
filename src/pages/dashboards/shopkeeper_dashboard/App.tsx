import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import MainLayout from './components/Layout/MainLayout';
import RequireAuth from './components/Auth/RequireAuth';
import ShopkeeperPortal from './pages/ShopkeeperPortal';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Import pages
import Dashboard from './pages/Dashboard';
import IncomingOrders from './pages/IncomingOrders';
import OrderProcessing from './pages/OrderProcessing';
import Delivery from './pages/Delivery';
import Payments from './pages/Payments';
import Feedback from './pages/Feedback';

// Import styles
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { currentRoute } = useSelector((state: RootState) => state.navigation);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const renderContent = () => {
    if (!isAuthenticated) {
      return <ShopkeeperPortal />;
    }

    return (
      <RequireAuth>
        <MainLayout>
          {currentRoute === 'dashboard' && <Dashboard />}
          {currentRoute === 'incoming-orders' && <IncomingOrders />}
          {currentRoute === 'order-processing' && <OrderProcessing />}
          {currentRoute === 'delivery' && <Delivery />}
          {currentRoute === 'payments' && <Payments />}
          {currentRoute === 'feedback' && <Feedback />}
        </MainLayout>
      </RequireAuth>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {renderContent()}
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4aed88',
              secondary: '#FFFAEE',
            },
          },
        }}
      />
    </Provider>
  );
};

export default App;
