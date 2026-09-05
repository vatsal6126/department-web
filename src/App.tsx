import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { WatermarkEngine } from './components/WatermarkEngine';
import { RouterProvider, useRouter } from './lib/router';
import type { Route } from './lib/router';
import { ContentStoreProvider } from './lib/store';
import { Courses } from './pages/Courses';
import { Department } from './pages/Department';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Notices } from './pages/Notices';
import { More } from './pages/More';
import { AdminLogin } from './pages/AdminLogin';

const PAGES: Record<Route, React.ComponentType> = {
  '/': Home,
  '/courses': Courses,
  '/department': Department,
  '/events': Events,
  '/notices': Notices,
  '/admin-login': AdminLogin,
  '/more': More,
};

const MainContent: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const Component = PAGES[currentRoute];
  const shouldReduceMotion = useReducedMotion();

  const requiresLogin = currentRoute === '/more';

  useEffect(() => {
    if (requiresLogin) navigate('/admin-login');
  }, [requiresLogin, navigate]);

  if (requiresLogin) {
    return null;
  }

  if (shouldReduceMotion) {
    return <Component />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentRoute}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Component />
      </motion.div>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <ContentStoreProvider>
      <RouterProvider>
        {/* WatermarkEngine is placed here at the absolute root */}
        <WatermarkEngine />
        <Navbar />
        <MainContent />
        <Footer />
      </RouterProvider>
    </ContentStoreProvider>
  );
};

export default App;