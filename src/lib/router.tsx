import React, { createContext, useContext, useEffect, useState } from 'react';

export type Route = '/' | '/courses' | '/department' | '/events' | '/notices' | '/admin-login' | '/more';

const ROUTE_TITLES: Record<Route, string> = {
  '/': 'Department of Chemical Engineering | LDCE',
  '/courses': 'Academic Programs | Department of Chemical Engineering',
  '/department': 'Department & Staff | Department of Chemical Engineering',
  '/events': 'Events & Activities | Department of Chemical Engineering',
  '/notices': 'Notice Board | Department of Chemical Engineering',
  '/admin-login': 'Administrator Login | Department of Chemical Engineering',
  '/more': 'Admin CMS & Storage | Department of Chemical Engineering',
};

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '').replace(/\/$/, '');
  const path = hash || '/';
  return (path in ROUTE_TITLES ? path : '/') as Route;
}

interface RouterContextType {
  currentRoute: Route;
  navigate: (to: Route) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentRoute: '/',
  navigate: () => {},
});

// Helper hook kept internal to avoid multi-export refresh warnings
const useInternalRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(parseHash);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleHashChange = () => {
      const route = parseHash();
      setCurrentRoute(route);
      document.title = ROUTE_TITLES[route];
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    document.title = ROUTE_TITLES[parseHash()];

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: Route) => {
    if (currentRoute === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = to === '/' ? '' : to;
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

/* eslint-disable-next-line react-refresh/only-export-components */
export const useRouter = () => useInternalRouter();