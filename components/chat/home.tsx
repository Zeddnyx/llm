"use client";
import { continueConversation } from "@/app/chat/actions";
import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import Markdown from "react-markdown";

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { messages, newMessage } = await continueConversation([
      ...conversation,
      { role: "user", content: input },
    ]);

    let textContent = "";
    setInput("");

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;

      setConversation([
        ...messages,
        { role: "assistant", content: textContent },
      ]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      {conversation?.length ? (
        conversation.map((m, i) => {
          return m.role === "user" ? (
            <div key={i} className="w-full flex flex-col gap-2 items-end">
              <div className="flex flex-col items-center px-4 py-2 max-w-[90%] bg-orange-700/50 rounded-lg text-neutral-200 whitespace-pre-wrap">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          ) : (
            <div key={i} className="w-full flex flex-col gap-2 items-start">
              <span className="px-2">AI</span>
              <div className="flex flex-col max-w-[90%] px-4 py-2 bg-indigo-700/50 rounded-lg text-neutral-200 whitespace-pre-wrap">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center flex-1 flex items-center justify-center text-neutral-500 text-4xl">
          <h1>Local LLM</h1>
        </div>
      )}
      <div className="flex flex-col w-full max-w-lg rounded-lg bg-white/10">
        <form onSubmit={handleSubmit} className="w-full px-3 py-2">
          <input
            className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-lg text-neutral-200"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
    </main>
  );
}
