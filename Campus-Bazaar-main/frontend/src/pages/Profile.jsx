
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import api from './utils/api';
import { showError } from '../components/Common/Toast';
import getErrorMessage from './utils/getErrorMessage';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import NoteCard from '../components/Notes/NoteCard';
import NoteModal from '../components/Notes/NoteModal';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/me');
      setProfile(res.data.user);
    } catch (err) {
      showError(getErrorMessage(err) || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Fetch uploaded notes
    api.get('/api/notes/user/uploaded')
      .then(res => setUploadedNotes(res.data.notes || []))
      .catch(() => setUploadedNotes([]));
  }, []);

  return (
    <Layout>
      <ErrorBoundary>
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <span className="text-gray-400 text-lg">Loading...</span>
          </div>
        ) : !profile ? (
          <p className="text-gray-700 dark:text-gray-300">No profile data.</p>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold mb-6 text-blue-700 dark:text-blue-300 tracking-tight">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
            </div>
            <h2 className="text-xl mb-3 text-gray-900 dark:text-white">Your Uploaded Notes</h2>
            {uploadedNotes.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {uploadedNotes.map(note => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    user={profile}
                    onClick={() => setSelectedNote(note)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No uploaded notes yet.</p>
            )}
            {/* Note Modal for viewing/downloading note */}
            <NoteModal
              isOpen={!!selectedNote}
              onClose={() => setSelectedNote(null)}
              note={selectedNote}
              user={profile}
              onDelete={async (id) => {
                try {
                  await api.delete(`/api/notes/${id}`);
                  setUploadedNotes(prev => prev.filter(n => n._id !== id));
                  setSelectedNote(null);
                } catch (err) {
                  showError(getErrorMessage(err) || 'Delete failed');
                }
              }}
            />
          </>
        )}
      </ErrorBoundary>
    </Layout>
  );
}
