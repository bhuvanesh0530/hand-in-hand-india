import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BeneficiaryPage from './pages/BeneficiaryPage';
import BeneficiaryProfile from './pages/BeneficiaryProfile';
import DistrictPage from './pages/DistrictPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBeneficiaries from './pages/admin/AdminBeneficiaries';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
          <Route path="/categories/:categoryId" element={<Layout><BeneficiaryPage /></Layout>} />
          <Route path="/beneficiary/:id" element={<Layout><BeneficiaryProfile /></Layout>} />
          <Route path="/districts" element={<Layout><DistrictPage /></Layout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/beneficiaries" element={<AdminBeneficiaries />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}