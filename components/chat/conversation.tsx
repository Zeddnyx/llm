import Markdown from "react-markdown";

export default function Conversation({
  conversation,
  handleCopy,
  isCopy,
}: {
  conversation: Message[];
  handleCopy: (item: string) => void;
  isCopy: boolean;
}) {
  return conversation.map((m, i) => {
    if (m.role === "system") return null;
    return m.role === "user" ? (
      <div key={i} className="w-full flex flex-col gap-2 items-end mt-5">
        <div className="flex flex-col items-center px-4 py-2 max-w-[90%] bg-darker rounded-lg text-foreground whitespace-pre-wrap">
          {m.content}
        </div>
      </div>
    ) : (
      <div key={i} className="w-full flex flex-col gap-2 items-start pb-20">
        <div className="flex flex-col max-w-[90%] text-foreground whitespace-pre-wrap relative">
          <Markdown
            components={{
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
  });
}
