import Markdown from "react-markdown";

export default function Conversation({
  conversation,
  handleCopy,
  handleInitialInput,
  isCopy,
}: {
  conversation: Message[];
  handleCopy: (item: string) => void;
  handleInitialInput: (text: string) => void;
  isCopy: boolean;
}) {
  return conversation.map((m, i) => {
    if (m.role === "system") return null;
    return m.role === "user" ? (
      <div key={i} className="w-full flex flex-col gap-2 items-end my-5">
        <button
          className="flex flex-col items-center px-4 py-2 max-w-2xl bg-light rounded-l-lg rounded-tr-2xl text-foreground whitespace-pre-wrap"
          onClick={() => handleInitialInput(m.content)}
        >
          {m.content}
        </button>
      </div>
    ) : (
      <div key={i} className="w-full flex flex-col gap-2 items-start pb-20">
        <div className="flex flex-col max-w-4xl text-foreground whitespace-pre-wrap relative">
          <Markdown
            components={{
              pre: ({ children }) => {
                return (
                  <div className="flex flex-col bg-light my-2 h-full rounded-md max-w-4xl overflow-x-scroll relative">
                    <button
                      type="button"
                      onClick={() => handleCopy("" + children)}
                      className="self-end sticky top-0 bg-primary p-2 rounded-bl-lg"
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
