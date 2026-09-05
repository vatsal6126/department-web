import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Users, Calendar, Bell, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from '../lib/router';
import type { Route } from '../lib/router';

const ITEM_WIDTH = 62;

const NAV_ITEMS: { label: string; path: Route; icon: LucideIcon }[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'Staff', path: '/department', icon: Users },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Notices', path: '/notices', icon: Bell },
];

export const Navbar: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.path === currentRoute);
  const isCollapsed = isScrolled && !isExpanded;
  const totalDockWidth = NAV_ITEMS.length * ITEM_WIDTH;

  const handleSelect = (path: Route) => {
    navigate(path);
    if (isScrolled) setIsExpanded(false);
  };

  return (
    <header className="glass-dock-header">
      <motion.div
        animate={{
          width: isCollapsed ? 56 : totalDockWidth,
          height: isCollapsed ? 56 : 56,
        }}
        whileTap={{
          scale: [0.95, 1.03, 0.98, 1], 
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 16, 
          mass: 0.7,
        }}
        className={`glass-dock-wrapper glass-dock ${isCollapsed ? 'collapsed' : ''}`}
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>

        <div className="liquidGlass-text">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.button
                key="hamburger"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.12 }}
                className="glass-dock__hamburger-btn"
                onClick={() => setIsExpanded(true)}
                aria-label="Open Navigation"
              >
                <Menu size={24} className="glass-dock__icon" />
              </motion.button>
            ) : (
              <motion.div
                key="nav-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="glass-dock__options"
                style={{ width: `${totalDockWidth}px` }}
              >
                {/* Active Sliding Indicator Pill */}
                {activeIndex >= 0 && (
                  <motion.div
                    className="glass-dock__active-slider"
                    style={{ width: `${ITEM_WIDTH}px` }}
                    animate={{ x: activeIndex * ITEM_WIDTH }}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 24,
                    }}
                  />
                )}

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.path;

                  return (
                    <motion.button
                      key={item.path}
                      whileTap={{ scale: 0.85 }} 
                      className={`glass-dock__item ${isActive ? 'active' : ''}`}
                      title={item.label}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      style={{ width: `${ITEM_WIDTH}px` }}
                      onClick={() => handleSelect(item.path)}
                    >
                      <Icon size={18} className="glass-dock__icon" />
                      <span className="glass-dock__label">{item.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
};