import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeetRun.fun - Running Meetups for Your Community',
  description: 'Discover and submit running meetups in your area. From 5Ks to trail runs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-primary">
              MeetRun<span className="text-accent">.fun</span>
            </a>
            <div className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-primary">Meetups</a>
              <a href="/submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Submit a Meetup
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t bg-white mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            MeetRun.fun — Built with Next.js, NestJS, and deployed on Coolify
          </div>
        </footer>
      </body>
    </html>
  );
}
