import { INITIAL_PROMPT } from "@/lib/constants";

export default function Initial({
  handleInitial,
}: {
  handleInitial: (text: string) => void;
}) {
  return (
    <div className="text-center flex-1 flex flex-col gap-5 items-center justify-center text-neutral-500">
      <div>
        <h1 className="text-4xl font-bold font-mono">Welcome back Jee!</h1>
      </div>
      <ul className="grid grid-cols-2 gap-3 list-none">
        {INITIAL_PROMPT.map((item) => {
          return (
            <li key={item}>
              <button
                onClick={() => handleInitial(item)}
                className="text-base font-sans font-medium px-1 rounded-md hover:underline cursor-pointer"
                type="button"
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
