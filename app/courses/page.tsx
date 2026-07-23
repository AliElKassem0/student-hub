"use client";

import { useState, useEffect } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<{id: number; name: string; time: string; room: string}[]>([]);

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("courses");
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  function addCourse() {
    if (name.trim() === "") return;

    setCourses([...courses, { id: Date.now(), name, time, room }]);

    setName("");
    setTime("");
    setRoom("");
  }

  function deleteCourse(id: number) {
    setCourses(courses.filter((course) => course.id !== id));
  }

  return (
    <div>
      <h1>My Courses</h1>

      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Course name"
        />
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (e.g. Mon 10:00)"
        />
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
        />
        <button onClick={addCourse}>Add course</button>
      </div>

      {courses.map((course) => (
        <div key={course.id}>
          <strong>{course.name}</strong> — {course.time} — {course.room}
          <button onClick={() => deleteCourse(course.id)}> Delete</button>
        </div>
      ))}
    </div>
  );
}