import React from 'react';
import { LockKeyhole } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useRouter } from '../lib/router';

export const AdminLogin: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <main className="page-container admin-login-page">
      <SectionHeader
        badge="Restricted Area"
        title="Administrator editing is disabled"
        subtitle="This static website no longer accepts browser-only administrator credentials."
      />
      <div className="content-card admin-login-card admin-form">
        <div className="admin-login-icon"><LockKeyhole size={24} /></div>
        <p className="admin-login-error" role="alert">
          No username or password is configured in the frontend. Add a server-backed
          authentication and content API before enabling administrator editing.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Return to website</button>
      </div>
    </main>
  );
};
