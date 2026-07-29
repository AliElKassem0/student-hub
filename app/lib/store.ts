"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Course = { id: number; name: string; time: string; room: string };
export type Homework = {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  done: boolean;
};

type Listener = () => void;

// Stable empty values. useSyncExternalStore compares snapshots by identity, so
// returning a fresh [] on every read would loop forever.
const EMPTY_COURSES: Course[] = [];
const EMPTY_HOMEWORK: Homework[] = [];

const listeners = new Map<string, Set<Listener>>();

// Parsing on every read would also return a new array each time, so the last
// parse is cached and reused until the underlying JSON string actually changes.
const parsed = new Map<string, { raw: string | null; value: unknown }>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

let watchingWindow = false;

function watchOtherTabs() {
  if (watchingWindow) return;
  watchingWindow = true;

  // Fires only in tabs that didn't make the change, which is exactly the
  // case our own emit() doesn't cover.
  window.addEventListener("storage", (event) => {
    if (event.key) emit(event.key);
    else listeners.forEach((_, key) => emit(key)); // localStorage.clear()
  });
}

function subscribe(key: string, listener: Listener) {
  watchOtherTabs();

  let forKey = listeners.get(key);
  if (!forKey) {
    forKey = new Set();
    listeners.set(key, forKey);
  }
  forKey.add(listener);

  return () => {
    forKey.delete(listener);
  };
}

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);

  const cached = parsed.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      // Corrupt entry: fall back rather than crashing the page.
    }
  }

  parsed.set(key, { raw, value });
  return value;
}

function useStore<T>(key: string, empty: T) {
  const value = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    useCallback(() => read(key, empty), [key, empty]),
    useCallback(() => empty, [empty]),
  );

  const setValue = useCallback(
    (next: T) => {
      const raw = JSON.stringify(next);
      localStorage.setItem(key, raw);
      // Prime the cache so the next read returns this exact reference.
      parsed.set(key, { raw, value: next });
      emit(key);
    },
    [key],
  );

  return [value, setValue] as const;
}

export function useCourses() {
  return useStore<Course[]>("courses", EMPTY_COURSES);
}

export function useHomework() {
  return useStore<Homework[]>("homework", EMPTY_HOMEWORK);
}

/**
 * False during the server render and the first client render, true afterwards.
 * Lets a component tell "no data yet" apart from "genuinely empty" without
 * setting state from an effect.
 */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
