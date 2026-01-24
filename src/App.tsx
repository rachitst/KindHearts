import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ShopkeeperDashboardApp from "./pages/dashboards/shopkeeper_dashboard/App";
import InstituteDashboardApp from "./pages/dashboards/institute_dashboard/App";
import RoleSelection from "./pages/RoleSelection";
import DonorDashboardApp from "./pages/dashboards/donor_dashboard/App";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardApp from "./pages/dashboards/admin_dashboard/App";
// Replace with your actual Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Dashboard selection */}
          <Route path="/dashboard" element={<RoleSelection />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard/donor/*"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboardApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/shopkeeper/*"
            element={
              <ProtectedRoute allowedRoles={["shopkeeper"]}>
                <ShopkeeperDashboardApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/institute/*"
            element={
              <ProtectedRoute allowedRoles={["institute"]}>
                <InstituteDashboardApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboardApp />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
