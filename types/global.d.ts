declare interface Message {
  role: "user" | "assistant" | 'system';
  content: string;
}
