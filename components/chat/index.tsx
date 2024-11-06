"use client";
import { continueConversation } from "@/app/chat/actions";
import { CONTEXT_FRONTEND } from "@/lib/constants";
import { readStreamableValue } from "ai/rsc";
import { useRef, useState } from "react";
import Initial from "./initial";
import Conversation from "./conversation";

export default function Home() {
  const [isCopy, setIsCopy] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "system",
      content: CONTEXT_FRONTEND,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const refInput = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
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

  const handleCopy = (item: string) => {
    navigator.clipboard.writeText(item);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 1000);
  };

  const handleInitial = (text: string) => {
    setInput(text);
    refInput.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <main className="flex min-h-dvh relative flex-col items-center justify-start p-24">
      {conversation?.length > 1 ? (
        <Conversation
          conversation={conversation}
          handleCopy={handleCopy}
          isCopy={isCopy}
        />
      ) : (
        <Initial handleInitial={handleInitial} />
      )}
      <div className="w-full h-20 fixed left-0 right-0 bottom-10 transition-all duration-150 group">
        <form
          onSubmit={handleSubmit}
          className="w-full px-3 py-2 flex items-center justify-center"
        >
          <textarea
            ref={refInput}
            id="input"
            className="px-3 py-2 rounded-lg text-foreground max-w-2xl shadow-input"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)}
          />
        </form>
      </div>
    </main>
  );
}
