import React, { useState } from 'react';
import { Mail, MapPin, Award, BookOpen, X } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { useContentStore } from '../lib/store';
import { LiquidGlassCard } from '../components/LiquidGlassCard';

export const Department: React.FC = () => {
  const { faculty } = useContentStore();
  const [selectedFaculty, setSelectedFaculty] = useState<(typeof faculty)[number] | null>(null);

  return (
    <main className="page-container">
      <SectionHeader
        badge="Faculty Directory"
        title="Our Professors & Mentors"
        subtitle="Experienced educators and researchers driving chemical academic excellence for over 50 years."
      />

      <div className="faculty-grid">
        {faculty.map((fac, i) => (
          <Reveal key={`${fac.name}-${i}`} delay={i * 0.08} style={{ height: '100%' }}>
            <LiquidGlassCard className="faculty-card" onClick={() => setSelectedFaculty(fac)} role="button" tabIndex={0}>
              <img src={fac.image} alt={fac.name} className="faculty-img" loading="lazy" decoding="async" />
              <h3>{fac.name}</h3>
              <p className="role">{fac.role}</p>
              <a href={`mailto:${fac.email}`} className="email" onClick={(event) => event.stopPropagation()}>
                <Mail size={13} /> {fac.email}
              </a>
            </LiquidGlassCard>
          </Reveal>
        ))}
      </div>
      {selectedFaculty && (
        <div className="detail-modal-backdrop" role="presentation" onClick={() => setSelectedFaculty(null)}>
          <div className="detail-modal faculty-detail-modal" role="dialog" aria-modal="true" aria-labelledby="faculty-detail-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedFaculty(null)} aria-label="Close staff details"><X size={18} /></button>
            <div className="faculty-detail-layout">
              <img src={selectedFaculty.image} alt={selectedFaculty.name} className="faculty-detail-img" />
              <div className="faculty-detail-content">
                <h2 id="faculty-detail-title">{selectedFaculty.name}</h2>
                <p className="role">{selectedFaculty.role}</p>
                <div className="faculty-detail-line"><Award size={15} /> {selectedFaculty.qualification}</div>
                <div className="faculty-detail-line"><BookOpen size={15} /> {selectedFaculty.specialization}</div>
                <div className="faculty-detail-line"><MapPin size={15} /> {selectedFaculty.office}</div>
                <div className="faculty-detail-line">Experience: {selectedFaculty.experience}</div>
                <a href={`mailto:${selectedFaculty.email}`} className="link-btn"><Mail size={14} /> {selectedFaculty.email}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};