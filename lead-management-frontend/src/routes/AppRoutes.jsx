import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import AllLeads from '../pages/AllLeads/AllLeads';
import LeadDetails from '../pages/LeadDetails/LeadDetails';
import UserManagement from '../pages/UserManagement/UserManagement';
import Reports from '../pages/Reports/Reports';
import TelecallerDashboard from '../pages/TelecallerDashboard/TelecallerDashboard';
import Reminder from '../pages/Reminder/Reminder';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="Admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<AllLeads />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route
          path="/telecaller"
          element={
            <ProtectedRoute requiredRole="Telecaller">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TelecallerDashboard />} />
          <Route path="leads" element={<AllLeads />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="reminder" element={<Reminder />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

