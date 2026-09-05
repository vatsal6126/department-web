import React, { useState } from 'react';
import { ExternalLink, Clock, Users, FlaskConical, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { useContentStore } from '../lib/store';
import { LiquidGlassCard } from '../components/LiquidGlassCard';

export const Courses: React.FC = () => {
  const { courses, laboratories } = useContentStore();
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[number] | null>(null);

  return (
    <main className="page-container">
      <SectionHeader
        badge="Academic Programs"
        title="Curriculum & Degree Offerings"
        subtitle="Comprehensive GTU-accredited programs designed for modern chemical process industries."
      />

      <div className="courses-list" style={{ maxWidth: 880, margin: '0 auto 4rem' }}>
        <div className="course-summary-grid">
        {courses.map((course, i) => (
          <Reveal key={course.title} delay={i * 0.09}>
            <LiquidGlassCard className="course-summary-card" onClick={() => setSelectedCourse(course)} role="button" tabIndex={0}>
              <span className={`badge-tag ${course.altTag ? 'alt' : ''}`}>{course.tag}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span className="course-summary-link">View course details <ArrowRight size={15} /></span>
            </LiquidGlassCard>
          </Reveal>
        ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="detail-modal-backdrop" role="presentation" onClick={() => setSelectedCourse(null)}>
          <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="course-detail-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedCourse(null)} aria-label="Close course details"><X size={18} /></button>
            <div className="course-header-meta">
              <span className={`badge-tag ${selectedCourse.altTag ? 'alt' : ''}`}>{selectedCourse.tag}</span>
              <span className="course-pill"><Clock size={12} /> {selectedCourse.duration}</span>
              <span className="course-pill intake"><Users size={12} /> {selectedCourse.intake}</span>
            </div>
            <h2 id="course-detail-title">{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>
            {selectedCourse.keySubjects && <div className="subjects-container">
              <span className="subjects-label">Core Focus Modules:</span>
              <div className="subjects-tags">{selectedCourse.keySubjects.map((sub) => <span key={sub} className="subject-tag"><CheckCircle2 size={12} /> {sub}</span>)}</div>
            </div>}
            <a href={selectedCourse.gtuSchemeUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
              View GTU Syllabus Scheme <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* Laboratories & Infrastructure Section */}
      <SectionHeader
        badge="Hands-on Infrastructure"
        title="Departmental Laboratories"
        subtitle="State-of-the-art pilot plants, analytical instruments, and simulation facilities."
      />

      <div className="summary-grid" style={{ maxWidth: 880, margin: '0 auto' }}>
        {laboratories.map((lab, i) => (
          <Reveal key={lab.name} delay={i * 0.08}>
            <LiquidGlassCard className="lab-card">
              <FlaskConical className="card-icon" size={24} />
              <h3>{lab.name}</h3>
              <p>{lab.desc}</p>
            </LiquidGlassCard>
          </Reveal>
        ))}
      </div>
    </main>
  );
};