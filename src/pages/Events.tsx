import React from 'react';
import { Calendar, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { useContentStore } from '../lib/store';
import { LiquidGlassCard } from '../components/LiquidGlassCard';

export const Events: React.FC = () => {
  const { events } = useContentStore();

  return (
    <main className="page-container">
      <SectionHeader
        badge="Activities & Exposure"
        title="Departmental Events & Symposiums"
        subtitle="Connecting classroom theory with industrial practices, safety workshops, and research trends."
      />

      <div className="notice-list" style={{ maxWidth: 850, margin: '0 auto' }}>
        {events.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No events scheduled currently.</p>
          </div>
        ) : (
          [...events].sort((a, b) => Number(b.status === 'Upcoming') - Number(a.status === 'Upcoming')).map((ev, i) => {
            const isUpcoming = ev.status === 'Upcoming';
            return (
              <Reveal key={`${ev.title}-${i}`} delay={i * 0.08}>
                <LiquidGlassCard className="event-card">
                  <div className="event-meta-row">
                    <div className="event-tags">
                      <span className="badge-tag">{ev.tag}</span>
                      <span className={`status-pill ${isUpcoming ? 'upcoming' : 'completed'}`}>
                        {isUpcoming ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                        {ev.status}
                      </span>
                      </div>
                    <span className="event-date">
                      <Calendar size={13} /> {ev.date}
                    </span>
                  </div>

                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>

                  <div className="event-venue">
                    <MapPin size={13} /> <strong>Venue:</strong> {ev.venue}
                  </div>
                </LiquidGlassCard>
              </Reveal>
            );
          })
        )}
      </div>
    </main>
  );
};
