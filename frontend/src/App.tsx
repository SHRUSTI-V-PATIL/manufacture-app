import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManufacturingOrdersPage from './pages/ManufacturingOrdersPage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import WorkCentersPage from './pages/WorkCentersPage';
import StockLedgerPage from './pages/StockLedgerPage';
import BOMPage from './pages/BOMPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Box className="app-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="manufacturing-orders" element={<ManufacturingOrdersPage />} />
            <Route path="work-orders" element={<WorkOrdersPage />} />
            <Route path="work-centers" element={<WorkCentersPage />} />
            <Route path="stock-ledger" element={<StockLedgerPage />} />
            <Route path="bom" element={<BOMPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
