"use client";

import { useState, useEffect, useRef } from "react";

type Message = { id: number; from: "you" | "bot"; text: string };

// First match wins, so put the specific patterns above the vague ones.
const RULES: { pattern: RegExp; replies: string[] }[] = [
  {
    pattern: /\b(hi|hey|hello|yo|hallo|salut)\b/i,
    replies: [
      "Hello. I am HubBot. I am not very good.",
      "Hi. Please lower your expectations before continuing.",
    ],
  },
  {
    pattern: /\b(who|what) (are|r) (you|u)\b|\bhubbot\b/i,
    replies: [
      "I am roughly forty if-statements in a trench coat.",
      "Legally I am not allowed to call myself artificial intelligence.",
    ],
  },
  {
    pattern: /\b(homework|assignment|task|essay)\b/i,
    replies: [
      "Have you considered simply not having any?",
      "I checked. It is still there.",
      "Homework is temporary. So is everything, if you think about it long enough.",
    ],
  },
  {
    pattern: /\b(exam|test|quiz|midterm|final)\b/i,
    replies: [
      "Statistically, most people survive these.",
      "I believe in you. I have no evidence, but I believe.",
    ],
  },
  {
    pattern: /\b(late|overdue|deadline|due|tomorrow)\b/i,
    replies: [
      "Deadlines are a social construct. Unfortunately, so is your grade.",
      "The red ones on the home page are red for a reason.",
    ],
  },
  {
    pattern: /\b(bug|broken|error|crash|not working|doesn'?t work)\b/i,
    replies: [
      "Have you tried turning it off and on again? The homework, not the laptop.",
      "Works on my machine. My machine is the same machine.",
      "I have forwarded this to the technical department. He is asleep.",
    ],
  },
  {
    pattern: /\b(data|lost|delete|deleted|gone|backup)\b/i,
    replies: [
      "Your data lives in localStorage, which is a browser's version of a pinky promise.",
      "Nothing is lost. Some things are simply no longer present.",
    ],
  },
  {
    pattern: /\b(help|support|please|urgent)\b/i,
    replies: ["Same.", "You and me both.", "Have you tried the emergency hotline? Do not."],
  },
  {
    pattern: /\b(police|110|112)\b/i,
    replies: ["Please do not.", "That number is for real emergencies. This is not one."],
  },
  {
    pattern: /\b(thanks|thank you|danke|ty)\b/i,
    replies: ["Don't.", "I did nothing. Genuinely nothing.", "You are welcome, undeservedly."],
  },
  {
    pattern: /\?$/,
    replies: [
      "Excellent question. Moving on.",
      "I have considered your question carefully and have decided against answering it.",
    ],
  },
];

const FALLBACKS = [
  "Interesting. Wrong, but interesting.",
  "I have escalated this to myself.",
  "Let me look into that. ...I have looked into it. No.",
  "Understood. Taking no action.",
  "That sounds like a you problem, respectfully.",
  "I am going to be honest, I stopped reading halfway through.",
];

function pick(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function replyTo(text: string) {
  const rule = RULES.find((r) => r.pattern.test(text));
  return pick(rule ? rule.replies : FALLBACKS);
}

const GREETING: Message = {
  id: 0,
  from: "bot",
  text: "Welcome to live chat. I am HubBot and I am contractually obliged to respond.",
};

export default function FakeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow the conversation as it grows.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing, open]);

  // Ready to type the moment it opens, and closable with Escape.
  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Don't let a pending reply fire after the page has moved on.
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  function send() {
    const text = draft.trim();
    if (text === "" || typing) return;

    setMessages((current) => [...current, { id: Date.now(), from: "you", text }]);
    setDraft("");
    setTyping(true);

    // The pause is the joke: it looks like hard thinking, then says nothing useful.
    timeout.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, from: "bot", text: replyTo(text) },
      ]);
      setTyping(false);
    }, 900 + Math.random() * 1200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close live chat" : "Open live chat"}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="h-6 w-6">
            <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
          </svg>
        )}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-40 flex w-[calc(100vw-3rem)] max-w-sm flex-col rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-xl transition ${
          open ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <h2 className="text-base font-semibold">Live chat</h2>
        <p className="mb-3 text-xs text-slate-500">
          Not a real AI &mdash; just a pile of if-statements. Nothing here is saved.
        </p>

        <div
          ref={listRef}
          className="themed-scrollbar mb-3 flex h-64 flex-col gap-2 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-3"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.from === "you"
                  ? "self-end bg-blue-600 text-white"
                  : "self-start bg-slate-700 text-slate-100"
              }`}
            >
              {message.text}
            </div>
          ))}

          {typing && (
            <div className="self-start rounded-lg bg-slate-700 px-3 py-2" aria-label="HubBot is typing">
              <span className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type your problem here…"
            className="min-w-0 flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={send}
            disabled={typing}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
