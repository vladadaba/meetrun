'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function SubmitMeetupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get('title'),
      description: form.get('description'),
      date: new Date(form.get('date') as string).toISOString(),
      location: form.get('location'),
      category: form.get('category'),
      submitterName: form.get('submitterName'),
      submitterEmail: form.get('submitterEmail'),
      maxParticipants: form.get('maxParticipants')
        ? Number(form.get('maxParticipants'))
        : undefined,
    };

    try {
      const res = await fetch(`${API_URL}/meetups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Failed to submit meetup. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meetup Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Your meetup is pending review. We'll email you once it's approved.
        </p>
        <a href="/" className="text-primary hover:underline">Back to meetups</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a Running Meetup</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meetup Title</label>
          <input name="title" required placeholder="Saturday Morning 5K"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" required rows={3} placeholder="Tell runners what to expect..."
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input name="date" type="datetime-local" required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
              <option value="FIVE_K">5K</option>
              <option value="TEN_K">10K</option>
              <option value="HALF_MARATHON">Half Marathon</option>
              <option value="MARATHON">Marathon</option>
              <option value="TRAIL">Trail</option>
              <option value="SOCIAL">Social Run</option>
              <option value="TRAINING">Training</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input name="location" required placeholder="Ada Ciganlija, Belgrade"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants (optional)</label>
          <input name="maxParticipants" type="number" min="1" placeholder="50"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input name="submitterName" required placeholder="Marko Petrovic"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input name="submitterEmail" type="email" required placeholder="marko@example.com"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Submit Meetup
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your meetup will be reviewed by an admin before being published.
        </p>
      </form>
    </div>
  );
}
