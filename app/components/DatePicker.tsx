"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// Build "YYYY-MM-DD" from a Date without going through UTC (toISOString would
// shift the day for anyone east or west of Greenwich).
function toKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatLabel(key: string) {
  const date = fromKey(key);
  if (!date) return "";
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

// Monday-first offset for the 1st of the month.
function leadingBlanks(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export default function DatePicker({ value, onChange, placeholder = "Pick a date", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => fromKey(value) ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Reopening on an existing value should land on that month, not wherever
  // the user browsed to last time.
  useEffect(() => {
    if (open) setView(fromKey(value) ?? new Date());
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toKey(new Date());

  function pick(day: number) {
    onChange(toKey(new Date(year, month, day)));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setView(new Date(year, month + delta, 1));
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-left text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={value ? "text-slate-100" : "text-slate-400"}>
          {value ? formatLabel(value) : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            >
              ‹
            </button>
            <p className="text-sm font-semibold text-slate-100">
              {MONTHS[month]} {year}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-700 hover:text-blue-400"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="py-1 text-xs font-medium text-slate-500">
                {weekday}
              </span>
            ))}

            {Array.from({ length: leadingBlanks(year, month) }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const key = toKey(new Date(year, month, day));
              const isSelected = key === value;
              const isToday = key === todayKey;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => pick(day)}
                  className={`rounded-md py-1.5 text-sm transition ${
                    isSelected
                      ? "bg-blue-600 font-medium text-white"
                      : isToday
                        ? "text-blue-400 ring-1 ring-blue-500/50 hover:bg-slate-700"
                        : "text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-700 pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(todayKey);
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-sm font-medium text-blue-400 hover:bg-blue-500/10"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
