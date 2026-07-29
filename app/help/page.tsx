"use client";

import { useState } from "react";
import FakeChat from "../components/FakeChat";

const REPLIES = [
  "Have you tried turning it off and on again? (The homework, not the laptop.)",
  "Ticket escalated to senior management. Senior management is also me.",
  "Our records show you have unfinished homework. This is unrelated but we felt you should know.",
  "The technical department has read your message and is pretending it did not.",
  "Thank you. Your feedback has been carefully filed under 'later'.",
];

export default function HelpPage() {
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState<{ id: string; reply: string } | null>(null);

  function send() {
    if (message.trim() === "") return;

    setTicket({
      id: `SH-${Math.floor(Math.random() * 9000 + 1000)}`,
      reply: REPLIES[Math.floor(Math.random() * REPLIES.length)],
    });
    setMessage("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Help &amp; Support</h1>
      <p className="text-slate-400 mb-8">
        Get in touch with the Student Hub technical department, or open the live chat in
        the corner for instant unhelpful answers.
      </p>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Meet the technical department</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Head of Engineering</dt>
            <dd className="text-slate-200">Ali</dd>
          </div>
          <div>
            <dt className="text-slate-500">Head of Design</dt>
            <dd className="text-slate-200">Ali</dd>
          </div>
          <div>
            <dt className="text-slate-500">Customer Success Team</dt>
            <dd className="text-slate-200">Ali</dd>
          </div>
          <div>
            <dt className="text-slate-500">Current status</dt>
            <dd className="text-amber-400">Has an exam on Thursday</dd>
          </div>
          <div>
            <dt className="text-slate-500">Average response time</dt>
            <dd className="text-slate-200">3&ndash;5 business years</dd>
          </div>
          <div>
            <dt className="text-slate-500">Office hours</dt>
            <dd className="text-slate-200">Whenever, honestly</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-300">Emergency hotline: 110</p>
          <p className="mt-1 text-sm text-slate-300">
            That is the German police. They have a much better response time than we do
            and are qualified to help with almost anything except this app.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Obviously a joke &mdash; 110 is a real emergency line. Please only call it in a
            real emergency, never about homework.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold">Submit a ticket</h2>
        <p className="mb-4 text-sm text-slate-500">
          Placeholder for now &mdash; nothing you type here is sent anywhere or saved.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Describe your issue in excruciating detail…"
          className="themed-scrollbar w-full resize-y rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={send}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Send to technical department
        </button>

        {ticket && (
          <div className="mt-4 rounded-md border border-blue-500/40 bg-blue-500/10 p-4">
            <p className="text-sm font-medium text-blue-300">
              Ticket {ticket.id} received
            </p>
            <p className="mt-1 text-sm text-slate-300">{ticket.reply}</p>
          </div>
        )}
      </div>

      <FakeChat />
    </div>
  );
}
