import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import RequestMonitoringPage from './pages/RequestMonitoringPage';
import ShopkeeperSelectionPage from './pages/ShopkeeperSelectionPage';
import TransactionsPage from './pages/TransactionsPage';
import FeedbackPage from './pages/FeedbackPage';
import ReportsPage from './pages/ReportsPage';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UserManagementPage />;
      case 'requests':
        return <RequestMonitoringPage />;
      case 'shopkeepers':
        return <ShopkeeperSelectionPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;