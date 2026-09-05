import React from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ badge, title, subtitle }) => {
  return (
    <Reveal className="section-header">
      {badge && <span className="badge">{badge}</span>}
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div className="section-line" />
    </Reveal>
  );
};