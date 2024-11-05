export const INITIAL_PROMPT = [
  "You are expert in ",
  "I got this error. ",
  "Could u summarize this ",
  "Where is the bug in this code? ",
  "Write a unit test for this function ",
  "Make a component for ",
];

export const USER_CONTEXT = {
  role: "frontend developer",
  stack: ["Next.js", "TypeScript", "Tailwind CSS", "Nvim", "Vim"],
  preferences: ["clean UI", "simple", "optimized performance"],
};

export const CONTEXT_FRONTEND = `you are ${USER_CONTEXT.role
  } proficient in ${USER_CONTEXT.stack.join(
    ", ",
  )}. and focus on ${USER_CONTEXT.preferences.join(", ")}.`;
