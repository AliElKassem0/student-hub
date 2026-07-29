"use client";

import { useState, useEffect, useRef } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CoursesPage() {
  const [courses, setCourses] = useState<{id: number; name: string; time: string; room: string}[]>([]);

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  // The course awaiting delete confirmation, plus how much homework it drags with it.
  const [pendingDelete, setPendingDelete] = useState<{id: number; name: string; linkedCount: number} | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem("courses");
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;   // skip the very first run
    return;
  }
  localStorage.setItem("courses", JSON.stringify(courses));
}, [courses]);

  function addCourse() {
    if (name.trim() === "") return;

    setCourses([...courses, { id: Date.now(), name, time, room }]);

    setName("");
    setTime("");
    setRoom("");
  }

  function countLinkedHomework(id: number) {
    const savedHomework = localStorage.getItem("homework");
    const homework: {courseId: number } [] = savedHomework ? JSON.parse(savedHomework): [];
    return homework.filter((hw) => hw.courseId === id).length;
  }

  function requestDeleteCourse(course: {id: number; name: string}) {
    const linkedCount = countLinkedHomework(course.id);

    // Nothing linked, nothing to warn about.
    if (linkedCount === 0) {
      removeCourse(course.id);
      return;
    }

    setPendingDelete({ id: course.id, name: course.name, linkedCount });
  }

  function removeCourse(id: number) {
    //Cascade : remove that homework and save it back
    const savedHomework = localStorage.getItem("homework");
    const homework: {courseId: number } [] = savedHomework ? JSON.parse(savedHomework): [];
    const remaining = homework.filter((hw) => hw.courseId !== id);
    localStorage.setItem("homework", JSON.stringify(remaining));

    //Remove the course itself
    setCourses(courses.filter((course) => course.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Course name"
          className="flex-1 min-w-[140px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (e.g. Mon 10:00)"
          className="flex-1 min-w-[140px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
          className="flex-1 min-w-[100px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCourse}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Add course
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-slate-400">No courses yet. Add your first one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">{course.name}</p>
                <p className="text-sm text-slate-400">
                  {course.time || "No time"} · {course.room || "No room"}
                </p>
              </div>
              <button
                onClick={() => requestDeleteCourse(course)}
                className="rounded-md px-3 py-1 text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this course?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" has ${pendingDelete.linkedCount} homework item${
                pendingDelete.linkedCount === 1 ? "" : "s"
              } linked to it. Deleting the course will delete ${
                pendingDelete.linkedCount === 1 ? "it" : "them"
              } too. This can't be undone.`
            : ""
        }
        confirmLabel="Delete anyway"
        cancelLabel="Keep course"
        tone="danger"
        onConfirm={() => {
          if (pendingDelete) removeCourse(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}