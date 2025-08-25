import React, { useEffect, useState } from 'react';
import api from './utils/api';
import Layout from '../components/Layout/Layout';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Change this to your actual admin email
  const allowedAdminEmail = 'admin@example.com';

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchUsers();
      fetchNotes();
    }
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.users);
    } catch {}
    setLoading(false);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/notes');
      setNotes(res.data.notes);
    } catch {}
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/admin/analytics');
      setAnalytics(res.data);
    } catch {}
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/api/admin/users/${id}`);
    fetchUsers();
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/api/admin/notes/${id}`);
    fetchNotes();
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail.trim().toLowerCase() === allowedAdminEmail) {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Invalid admin email.');
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-900 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter admin email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Login as Admin</button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab==='users'?'bg-blue-600 text-white':'bg-gray-200'}`}>Users</button>
          <button onClick={() => setTab('notes')} className={`px-4 py-2 rounded ${tab==='notes'?'bg-blue-600 text-white':'bg-gray-200'}`}>Notes</button>
          <button onClick={() => setTab('analytics')} className={`px-4 py-2 rounded ${tab==='analytics'?'bg-blue-600 text-white':'bg-gray-200'}`}>Analytics</button>
        </div>
        {tab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {loading ? <p>Loading...</p> : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'notes' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            {loading ? <p>Loading...</p> : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Title</th>
                    <th className="p-2">Uploader</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map(n => (
                    <tr key={n._id} className="border-t">
                      <td className="p-2">{n.title}</td>
                      <td className="p-2">{n.uploader}</td>
                      <td className="p-2">{n.price}</td>
                      <td className="p-2">
                        <button onClick={() => handleDeleteNote(n._id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Site Analytics</h2>
            <ul className="list-disc ml-6">
              <li>Total Users: {analytics.userCount}</li>
              <li>Total Notes: {analytics.noteCount}</li>
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
