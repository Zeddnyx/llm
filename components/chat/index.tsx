"use client";
import { continueConversation } from "@/app/chat/actions";
import { INITIAL_PROMPT, USER_CONTEXT } from "@/lib/constants";
import { readStreamableValue } from "ai/rsc";
import { useRef, useState } from "react";
import Markdown from "react-markdown";

const contextMessage = `you are ${USER_CONTEXT.role
  } proficient in ${USER_CONTEXT.stack.join(
    ", ",
  )}. and focus on ${USER_CONTEXT.preferences.join(", ")}.`;
export default function Home() {
  const [isCopy, setIsCopy] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "system",
      content: contextMessage,
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

  return (
    <main className="flex min-h-dvh relative flex-col items-center justify-start p-24">
      {conversation?.length ? (
        conversation.map((m, i) => {
          return m.role === "user" ? (
            <div key={i} className="w-full flex flex-col gap-2 items-end mt-5">
              <div className="flex flex-col items-center px-4 py-2 max-w-[90%] bg-darker rounded-lg text-foreground whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ) : (
            <div
              key={i}
              className="w-full flex flex-col gap-2 items-start pb-20"
            >
              <div className="flex flex-col max-w-[90%] text-foreground whitespace-pre-wrap relative">
                <Markdown
                  components={{
                    p: ({ children }) => <p className="mt-2">{children}</p>,
                    ol: ({ children }) => (
                      <ol className="flex flex-col gap-1 mb-2">{children}</ol>
                    ),
                    ul: ({ children }) => {
                      return (
                        <ul className="list-inside list-disc mb-2 flex flex-col gap-2">
                          {children}
                        </ul>
                      );
                    },
                    li: ({ children }) => (
                      <li className="my-0 py-0">{children}</li>
                    ),
                    pre: ({ children }) => {
                      return (
                        <div className="flex flex-col  bg-darker my-2 rounded-md">
                          <button
                            type="button"
                            onClick={() => handleCopy(children as string)}
                            className="self-end sticky top-0 bg-background p-2"
                          >
                            {isCopy ? "Copied" : "Copy"}
                          </button>
                          <pre className="w-full overflow-x-auto p-2">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    },
                  }}
                >
                  {m.content}
                </Markdown>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center flex-1 flex flex-col gap-5 items-center justify-center text-neutral-500">
          <div>
            <h1 className="text-4xl font-mono">Welcome back Jee!</h1>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {INITIAL_PROMPT.map((item) => {
              return (
                <li key={item}>
                  <button
                    onClick={() => handleInitial(item)}
                    className="text-base px-1 rounded-md hover:underline cursor-pointer"
                    type="button"
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="w-full h-20 fixed left-0 right-0 bottom-10 transition-all duration-150 group">
        <form
          onSubmit={handleSubmit}
          className="w-full px-3 py-2 flex items-center justify-center"
        >
          <textarea
            ref={refInput}
            id="input"
            className="px-3 py-2 rounded-lg text-neutral-200 max-w-2xl bg-darker"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event: React.KeyboardEvent) => {
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
