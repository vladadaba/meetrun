import { useEffect, useState } from 'react';
import { useAuth } from '../auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Meetup {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  submitterName: string;
  submitterEmail: string;
  createdAt: string;
}

export default function MeetupReview() {
  const { token } = useAuth();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    fetch(`${API_URL}/meetups/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setMeetups(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, [token]);

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
    await fetch(`${API_URL}/meetups/${id}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    fetchPending();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Meetups</h1>
      {meetups.length === 0 ? (
        <p className="text-gray-500">No meetups pending review.</p>
      ) : (
        <div className="space-y-4">
          {meetups.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{m.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{m.location}</span>
                    <span>{new Date(m.date).toLocaleDateString()}</span>
                    <span>by {m.submitterName} ({m.submitterEmail})</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(m.id, 'APPROVE')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(m.id, 'REJECT')}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
