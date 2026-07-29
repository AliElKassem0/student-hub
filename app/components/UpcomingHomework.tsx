"use client";

import Link from "next/link";
import { formatLabel, parseDateKey } from "./DatePicker";
import { useCourses, useHomework, useHydrated, type Homework } from "../lib/store";

const WINDOW_DAYS = 14;

// Whole days between today and a due date, ignoring clock time so that
// "due later today" still counts as 0 rather than a fraction of a day.
function daysUntil(dueDate: string) {
  const due = parseDateKey(dueDate);
  if (!due) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function relativeLabel(days: number) {
  if (days < 0) return `overdue by ${-days} day${days === -1 ? "" : "s"}`;
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  return `in ${days} days`;
}

function toneClasses(days: number) {
  if (days <= 1) return "bg-red-500/10 text-red-400 ring-red-500/30";
  if (days <= 7) return "bg-amber-500/10 text-amber-400 ring-amber-500/30";
  return "bg-slate-700/50 text-slate-400 ring-slate-600/50";
}

export default function UpcomingHomework() {
  const [courses] = useCourses();
  const [homework, setHomework] = useHomework();
  // localStorage only exists in the browser, so there's nothing to show until
  // the first client render has happened.
  const loaded = useHydrated();

  function toggleDone(id: number) {
    setHomework(homework.map((hw) => (hw.id === id ? { ...hw, done: !hw.done } : hw)));
  }

  const dueSoon = homework
    .filter((hw) => !hw.done && hw.dueDate)
    .map((hw) => ({ hw, days: daysUntil(hw.dueDate) }))
    .filter((entry): entry is { hw: Homework; days: number } => entry.days !== null)
    .filter((entry) => entry.days <= WINDOW_DAYS)
    .sort((a, b) => a.days - b.days);

  return (
    <section className="mb-8 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Due soon</h2>
        <span className="text-sm text-slate-500">next {WINDOW_DAYS} days</span>
      </div>

      {!loaded ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : dueSoon.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nothing due in the next {WINDOW_DAYS} days.{" "}
          <Link href="/homework" className="text-blue-400 hover:underline">
            Add homework
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {dueSoon.map(({ hw, days }) => {
            const course = courses.find((c) => c.id === hw.courseId);
            return (
              <li
                key={hw.id}
                className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={hw.done}
                  onChange={() => toggleDone(hw.id)}
                  aria-label={`Mark "${hw.title}" as done`}
                  className="h-4 w-4 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-100">{hw.title}</p>
                  <p className="truncate text-xs text-slate-400">
                    {course ? course.name : "Unknown course"} · {formatLabel(hw.dueDate)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${toneClasses(days)}`}
                >
                  {relativeLabel(days)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
