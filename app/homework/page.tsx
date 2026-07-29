"use client";

import { useState } from "react";
import DatePicker, { formatLabel } from "../components/DatePicker";
import { useCourses, useHomework, type Homework } from "../lib/store";

const fieldClasses =
  "rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function HomeworkPage() {
  const [courses] = useCourses();
  const [homework, setHomework] = useHomework();

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // One item is editable at a time; its draft values live here.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCourseId, setEditCourseId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  function startEdit(hw: Homework) {
    setEditingId(hw.id);
    setEditCourseId(String(hw.courseId));
    setEditTitle(hw.title);
    setEditDescription(hw.description);
    setEditDueDate(hw.dueDate);
  }

  function saveEdit() {
    if (editTitle.trim() === "" || editCourseId === "") return;

    setHomework(
      homework.map((hw) =>
        hw.id === editingId
          ? {
              ...hw,
              courseId: Number(editCourseId),
              title: editTitle,
              description: editDescription,
              dueDate: editDueDate,
            }
          : hw,
      ),
    );
    setEditingId(null);
  }

  function addHomework() {
    if (title.trim() === "" || courseId === "") return;

    setHomework([
      ...homework,
      { id: Date.now(), courseId: Number(courseId), title, description, dueDate, done: false },
    ]);

    setTitle("");
    setDescription("");
    setDueDate("");
  }

  function deleteHomework(id: number) {
    setHomework(homework.filter((hw) => hw.id !== id));
  }

  function toggleDone(id: number) {
    setHomework(
      homework.map((hw) => (hw.id === id ? { ...hw, done: !hw.done } : hw))
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Homework</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="flex-1 min-w-[140px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 min-w-[140px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="flex-1 min-w-[140px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Due date"
          className="min-w-[160px]"
        />
        <button
          onClick={addHomework}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Add homework
        </button>
      </div>

      {homework.length === 0 ? (
        <p className="text-slate-400">No homework yet. Add your first one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {homework.map((hw) => {
            const course = courses.find((c) => c.id === hw.courseId);

            if (editingId === hw.id) {
              return (
                <div
                  key={hw.id}
                  className="flex flex-wrap gap-2 rounded-lg border border-blue-500 bg-slate-800 p-4 shadow-sm"
                >
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className={`flex-1 min-w-[140px] ${fieldClasses}`}
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className={`flex-1 min-w-[140px] ${fieldClasses}`}
                  />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className={`flex-1 min-w-[140px] ${fieldClasses}`}
                  />
                  <DatePicker
                    value={editDueDate}
                    onChange={setEditDueDate}
                    placeholder="Due date"
                    className="min-w-[160px]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-slate-600 px-4 py-2 font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={hw.id}
                className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={hw.done}
                  onChange={() => toggleDone(hw.id)}
                  className="mt-1 h-4 w-4"
                />
                <div className="flex-1">
                  <p className={`font-semibold ${hw.done ? "line-through text-slate-500" : ""}`}>
                    {hw.title}
                  </p>
                  <p className="text-sm text-slate-400">
                    {course ? course.name : "Unknown course"}
                    {hw.dueDate && ` · due ${formatLabel(hw.dueDate)}`}
                  </p>
                  {hw.description && (
                    <p className="mt-1 text-sm text-slate-300">{hw.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(hw)}
                    className="rounded-md px-3 py-1 text-sm font-medium text-blue-400 hover:bg-blue-500/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHomework(hw.id)}
                    className="rounded-md px-3 py-1 text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}