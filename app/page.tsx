import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Student Hub</h1>
      <p className="text-slate-400 mb-8">
        Keep track of your courses and homework in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/courses"
          className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
        >
          <p className="text-lg font-semibold">Courses</p>
          <p className="text-sm text-slate-400">View and manage your courses.</p>
        </Link>
        <Link
          href="/homework"
          className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
        >
          <p className="text-lg font-semibold">Homework</p>
          <p className="text-sm text-slate-400">Track what's due and mark it done.</p>
        </Link>
      </div>
    </div>
  );
}
