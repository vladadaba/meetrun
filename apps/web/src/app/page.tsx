const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Meetup {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants?: number;
}

const categoryLabels: Record<string, string> = {
  FIVE_K: '5K',
  TEN_K: '10K',
  HALF_MARATHON: 'Half Marathon',
  MARATHON: 'Marathon',
  TRAIL: 'Trail',
  SOCIAL: 'Social Run',
  TRAINING: 'Training',
};

async function getMeetups(): Promise<Meetup[]> {
  try {
    const res = await fetch(`${API_URL}/meetups`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const meetups = await getMeetups();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Running Meetups</h1>
        <p className="text-gray-600">Find your next run or submit your own meetup for the community.</p>
      </div>

      {meetups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No upcoming meetups yet.</p>
          <a href="/submit" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Be the first to submit one!
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {categoryLabels[meetup.category] || meetup.category}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{meetup.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{meetup.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📍 {meetup.location}</span>
                <span>📅 {new Date(meetup.date).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</span>
                {meetup.maxParticipants && <span>👥 Max {meetup.maxParticipants}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
