import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/layout/Logo';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../constants';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', bloodGroup: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-ink/60">You can use both Patient and Donor mode once you're in.</p>

          {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-critical">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input id="name" required className="input" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" required className="input" value={form.email} onChange={update('email')} />
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
            </div>
            <div>
              <label className="label" htmlFor="bloodGroup">
                Blood group (optional)
              </label>
              <select id="bloodGroup" className="input" value={form.bloodGroup} onChange={update('bloodGroup')}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input"
                value={form.password}
                onChange={update('password')}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rose-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
