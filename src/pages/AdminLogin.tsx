import React, { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useRouter } from '../lib/router';
import { useAuth } from '../lib/auth';

export const AdminLogin: React.FC = () => {
  const { navigate } = useRouter();
  const { signIn, isAdmin, loading, isFirebaseConfigured } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin && !loading) navigate('/more');
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(username, password);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-container admin-login-page">
      <SectionHeader badge="Restricted Area" title="Administrator sign in" subtitle="Sign in to manage live department content." />
      <div className="content-card admin-login-card admin-form">
        <div className="admin-login-icon"><LockKeyhole size={24} /></div>
        {!isFirebaseConfigured && (
          <p className="admin-login-error" role="alert">Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.</p>
        )}
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="form-group">Username<input className="admin-input" value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
          <label className="form-group">Password<input className="admin-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button type="submit" className="btn btn-primary" disabled={submitting || !isFirebaseConfigured}>{submitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Return to website</button>
      </div>
    </main>
  );
};
