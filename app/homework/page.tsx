"use client";

import { useState, useEffect } from "react";

type Course = { id: number; name: string; time: string; room: string };
type Homework = { id: number; courseId: number; title: string; description: string; dueDate: string };

export default function HomeworkPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) setCourses(JSON.parse(savedCourses));

    const savedHomework = localStorage.getItem("homework");
    if (savedHomework) setHomework(JSON.parse(savedHomework));
  }, []);

  useEffect(() => {
    localStorage.setItem("homework", JSON.stringify(homework));
  }, [homework]);

  function addHomework() {
    if (title.trim() === "" || courseId === "") return;

    setHomework([
      ...homework,
      { id: Date.now(), courseId: Number(courseId), title, description, dueDate },
    ]);

    setTitle("");
    setDescription("");
    setDueDate("");
  }

  function deleteHomework(id: number) {
    setHomework(homework.filter((hw) => hw.id !== id));
  }

  return (
    <div>
      <h1>Homework</h1>

      <div>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={addHomework}>Add homework</button>
      </div>

      {homework.map((hw) => {
        const course = courses.find((c) => c.id === hw.courseId);
        return (
          <div key={hw.id}>
            <strong>{hw.title}</strong> — {course ? course.name : "Unknown course"} — due {hw.dueDate}
            <div>{hw.description}</div>
            <button onClick={() => deleteHomework(hw.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}