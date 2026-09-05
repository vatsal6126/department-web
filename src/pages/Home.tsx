import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, Users, Calendar, Bell } from 'lucide-react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { LiquidGlassHero } from '../components/LiquidGlassHero';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { STATS } from '../data/content';
import { useRouter } from '../lib/router';
import type { Route } from '../lib/router';

const HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: 'Academic Excellence',
    desc: 'Offering GTU accredited B.E. and M.E. programs designed to prepare engineers for modern chemical industries.',
    linkText: 'Learn More',
    route: '/courses' as Route,
  },
  {
    icon: Users,
    title: 'Expert Faculty',
    desc: 'Distinguished professors and researchers dedicated to guiding students in advanced chemical engineering domains.',
    linkText: 'Meet Faculty',
    route: '/department' as Route,
  },
  {
    icon: Calendar,
    title: 'Seminars & Events',
    desc: 'Regular workshops, industrial visits, guest lectures, and technical symposiums hosted throughout the year.',
    linkText: 'View Schedule',
    route: '/events' as Route,
  },
  {
    icon: Bell,
    title: 'Official Updates',
    desc: 'Stay informed with current circulars, examination timetables, and departmental notices.',
    linkText: 'Read Notices',
    route: '/notices' as Route,
  },
];

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  const parsed = useMemo(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return null;
    return { num: parseInt(match[1], 10), suffix: match[2] };
  }, [value]);

  React.useEffect(() => {
    if (!isInView || !parsed || shouldReduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, parsed.num, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(val) {
        node.textContent = `${Math.round(val)}${parsed.suffix}`;
      },
    });
    return () => controls.stop();
  }, [isInView, parsed, shouldReduceMotion]);

  return (
    <LiquidGlassCard className="stat-item" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h3 ref={ref}>{value}</h3>
      <p>{label}</p>
    </LiquidGlassCard>
  );
};

export const Home: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <>
      <LiquidGlassHero />

      <section className="stats">
        {STATS.map((st, i) => (
          <Reveal key={st.label} delay={i * 0.08}>
            <StatItem value={st.value} label={st.label} />
          </Reveal>
        ))}
      </section>

      <section className="summary-section">
        <SectionHeader
          title="Department Highlights"
          subtitle="Comprehensive overview of our core academic and research initiatives."
        />
        <div className="summary-grid">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.08} style={{ height: '100%' }}>
                <LiquidGlassCard className="summary-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Icon className="card-icon" size={24} />
                  <h3>{item.title}</h3>
                  <p style={{ flexGrow: 1 }}>{item.desc}</p>
                  <a
                    href={`#${item.route}`}
                    className="link-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.route);
                    }}
                  >
                    {item.linkText} <ArrowRight size={14} />
                  </a>
                </LiquidGlassCard>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
};