import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg)' }}>
      {/* Global warm background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#C2410C]/8 via-[#D97706]/5 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#0F766E]/8 via-[#0F766E]/4 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#C2410C]/3 to-[#0F766E]/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        {/* Subtle warm grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C2410C08_1px,transparent_1px),linear-gradient(to_bottom,#C2410C08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <Header />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
      <Footer />
      <ToastContainer />
    </div>
  );
}