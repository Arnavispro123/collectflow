import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <main className="mx-auto max-w-2xl px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            <span className="text-indigo-600">Collect</span>Flow
          </h1>
          <p className="mt-4 text-xl text-gray-600">Never miss a payment again. Automated invoice reminders for freelancers.</p>
        </div>
        <div className="mb-12 grid gap-6 text-left sm:grid-cols-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Track Invoices</h3>
            <p className="mt-1 text-sm text-gray-600">See all your outstanding invoices at a glance.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Auto Reminders</h3>
            <p className="mt-1 text-sm text-gray-600">Automatic email reminders at 3, 7, and 14 days overdue.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Get Alerts</h3>
            <p className="mt-1 text-sm text-gray-600">Escalation alerts when payments are severely overdue.</p>
          </div>
        </div>
        <Link href="/dashboard" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700">
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
