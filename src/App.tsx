import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BeneficiaryPage from './pages/BeneficiaryPage';
import BeneficiaryProfile from './pages/BeneficiaryProfile';
import DistrictPage from './pages/DistrictPage';
import BusinessesPage from './pages/BusinessesPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBeneficiaries from './pages/admin/AdminBeneficiaries';

const ease1: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ease2: [number, number, number, number] = [0.4, 0, 1, 1];

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.38, ease: ease1 } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: ease2 } }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public pages */}
        <Route path="/" element={<Layout><PageWrapper><HomePage /></PageWrapper></Layout>} />
        <Route path="/categories" element={<Layout><PageWrapper><CategoriesPage /></PageWrapper></Layout>} />
        <Route path="/categories/:categoryId" element={<Layout><PageWrapper><BeneficiaryPage /></PageWrapper></Layout>} />
        <Route path="/beneficiary/:id" element={<Layout><PageWrapper><BeneficiaryProfile /></PageWrapper></Layout>} />
        <Route path="/districts" element={<Layout><PageWrapper><DistrictPage /></PageWrapper></Layout>} />
        <Route path="/businesses" element={<Layout><PageWrapper><BusinessesPage /></PageWrapper></Layout>} />

        {/* Admin pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/beneficiaries" element={<AdminBeneficiaries />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}