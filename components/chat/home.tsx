"use client";
import { continueConversation } from "@/app/chat/actions";
import { INITIAL_PROMPT } from "@/lib/constants";
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
              <div className="flex flex-col items-center px-4 py-2 max-w-[90%] bg-darker rounded-lg text-foreground whitespace-pre-wrap">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          ) : (
            <div key={i} className="w-full flex flex-col gap-2 items-start">
              <div className="flex flex-col max-w-[90%] text-foreground whitespace-pre-wrap">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center flex-1 flex flex-col gap-5 items-center justify-center text-neutral-500">
          <div>
            <h1 className="text-4xl">Welcome back, Zedd</h1>
            <h3 className="text-xl">How can I help you?</h3>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {INITIAL_PROMPT.map((item, id) => {
              return (
                <li
                  key={item}
                  onClick={() => setInput(item)}
                  className="text-base px-1 rounded-md hover:underline cursor-pointer"
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex flex-col w-full max-w-lg rounded-lg bg-white/10">
        <form onSubmit={handleSubmit} className="w-full px-3 py-2">
          <textarea
            id="input"
            className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-lg text-neutral-200"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event: any) => {
              if (event.key === "Enter") {
                if (event.shiftKey) {
                  return;
                } else {
                  handleSubmit(event);
                }
              }
            }}
          />
        </form>
      </div>
    </main>
  );
}
