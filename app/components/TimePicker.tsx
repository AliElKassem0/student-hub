"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  value: string; // "HH:MM" (24h) or ""
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

function splitValue(value: string) {
  const [hour = "", minute = ""] = value.split(":");
  return { hour, minute };
}

export default function TimePicker({ value, onChange, placeholder = "Pick a time", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourColumnRef = useRef<HTMLDivElement>(null);

  // Derived from the prop rather than mirrored in state, so the field always
  // matches whatever the parent holds (including resets after adding a course).
  const { hour, minute } = splitValue(value);

  useEffect(() => {
    if (!open) return;

    // Bring the chosen hour into view instead of always starting at 00.
    const selected = hourColumnRef.current?.querySelector("[data-selected='true']");
    selected?.scrollIntoView({ block: "center" });

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

  function pickHour(nextHour: string) {
    // Picking an hour alone almost always means "on the hour".
    onChange(`${nextHour}:${minute || "00"}`);
  }

  function pickMinute(nextMinute: string) {
    onChange(`${hour || "00"}:${nextMinute}`);
  }

  const columnClasses =
    "themed-scrollbar max-h-48 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-1";
  const optionClasses = (isSelected: boolean) =>
    `w-full rounded-md py-1.5 text-center text-sm transition ${
      isSelected ? "bg-blue-600 font-medium text-white" : "text-slate-200 hover:bg-slate-700"
    }`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-left text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={value ? "text-slate-100" : "text-slate-400"}>{value || placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-48 rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-center text-xs font-medium text-slate-500">Hour</p>
              <div ref={hourColumnRef} className={columnClasses}>
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    data-selected={h === hour}
                    onClick={() => pickHour(h)}
                    className={optionClasses(h === hour)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 text-center text-xs font-medium text-slate-500">Minute</p>
              <div className={columnClasses}>
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => pickMinute(m)}
                    className={optionClasses(m === minute)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-700 pt-2">
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
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-sm font-medium text-blue-400 hover:bg-blue-500/10"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
