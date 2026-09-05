import React, { useMemo, useState } from 'react';
import { Download, AlertCircle, Calendar, Filter } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { useContentStore } from '../lib/store';
import { LiquidGlassCard } from '../components/LiquidGlassCard';

export const Notices: React.FC = () => {
  const { notices } = useContentStore();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  // Dynamically extract categories from all notices (supports any custom category created by admin)
  const categories = useMemo(() => {
    const set = new Set<string>();
    notices.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return ['All', ...Array.from(set)];
  }, [notices]);

  const filteredNotices = selectedCat === 'All'
    ? notices
    : notices.filter((n) => n.category === selectedCat);

  return (
    <main className="page-container">
      <SectionHeader
        badge="Official Announcements"
        title="Department Notice Board"
        subtitle="Stay up to date with schedules, submissions, and GTU circulars."
      />

      {/* Category Filter Pills (Dynamically populated) */}
      <div className="notice-filter-bar" style={{ maxWidth: 850, margin: '0 auto 2rem' }}>
        <div className="filter-heading"><Filter size={14} /><span>Browse by category</span></div>
        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="notice-list" style={{ maxWidth: 850, margin: '0 auto' }}>
        {filteredNotices.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No notices found in this category.</p>
          </div>
        ) : (
          filteredNotices.map((note, i) => (
            <Reveal key={`${note.title}-${i}`} delay={i * 0.08}>
              <LiquidGlassCard className={`notice-item ${note.isUrgent ? 'urgent' : ''}`}>
                <div className="notice-header-row">
                  <div className="notice-tags">
                    <span className="badge-tag notice-category-tag">{note.category}</span>
                    {note.isUrgent && (
                      <span className="badge-tag urgent notice-urgent-tag">
                        <AlertCircle size={11} /> URGENT
                      </span>
                    )}
                    </div>
                  <span className="notice-date">
                    <Calendar size={12} /> {note.date}
                  </span>
                </div>

                <h4>{note.title}</h4>
                <p>{note.description}</p>

                {note.downloadUrl && (
                  <div className="notice-actions">
                    <a
                      href={note.downloadUrl}
                      target={note.downloadUrl.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="link-btn"
                      style={{ marginTop: '0.8rem' }}
                    >
                      <Download size={13} /> Download Notice PDF / Circular
                    </a>
                  </div>
                )}
              </LiquidGlassCard>
            </Reveal>
          ))
        )}
      </div>
    </main>
  );
};