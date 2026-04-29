import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── Global warm background blobs (fixed, behind everything) ────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Top-right warm coral blob */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(194,65,12,0.08) 0%, rgba(217,119,6,0.05) 50%, transparent 100%)',
            transform: 'translate(33%, -33%)',
          }}
        />

        {/* Bottom-left teal blob */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(15,118,110,0.08) 0%, rgba(15,118,110,0.04) 50%, transparent 100%)',
            transform: 'translate(-33%, 33%)',
          }}
        />

        {/* Centre ambient blend */}
        <div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(194,65,12,0.03) 0%, rgba(15,118,110,0.03) 100%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Subtle warm grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(194,65,12,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(194,65,12,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
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