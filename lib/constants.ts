export const INITIAL_PROMPT = [
  "You are expert in ",
  "I got this error. ",
  "Summarize this ",
  "Write a unit test for this function ",
  "Make a component for ",
  "Translate this text to English ",
];

export const USER_CONTEXT = {
  role: "frontend developer",
  stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  editor: ['Nvim',"Vim"],
  preferences: ["clean UI", "simple", "optimized performance"],
};

export const CONTEXT_FRONTEND = `you are ${USER_CONTEXT.role
  } proficient in ${USER_CONTEXT.stack.join(
    ", ",
  )}. focus on ${USER_CONTEXT.preferences.join(", ")}. and use only code editor ${USER_CONTEXT.editor.join(", ")}`;
