"use client";

import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import TimePicker from "../components/TimePicker";
import { useCourses, useHomework } from "../lib/store";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CoursesPage() {
  const [courses, setCourses] = useCourses();
  const [homework, setHomework] = useHomework();

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  // The course awaiting delete confirmation, plus how much homework it drags with it.
  const [pendingDelete, setPendingDelete] = useState<{id: number; name: string; linkedCount: number} | null>(null);

  function addCourse() {
    if (name.trim() === "") return;

    // Keep storing the slot as one string ("Mon 10:00") so courses saved
    // before this change still display correctly.
    const slot = [day, time].filter(Boolean).join(" ");

    setCourses([...courses, { id: Date.now(), name, time: slot, room }]);

    setName("");
    setDay("");
    setTime("");
    setRoom("");
  }

  function requestDeleteCourse(course: {id: number; name: string}) {
    const linkedCount = homework.filter((hw) => hw.courseId === course.id).length;

    // Nothing linked, nothing to warn about.
    if (linkedCount === 0) {
      removeCourse(course.id);
      return;
    }

    setPendingDelete({ id: course.id, name: course.name, linkedCount });
  }

  function removeCourse(id: number) {
    //Cascade : remove that homework too
    setHomework(homework.filter((hw) => hw.courseId !== id));

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
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="min-w-[110px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Day</option>
          {WEEKDAYS.map((weekday) => (
            <option key={weekday} value={weekday}>
              {weekday}
            </option>
          ))}
        </select>
        <TimePicker value={time} onChange={setTime} placeholder="Time" className="min-w-[120px]" />
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