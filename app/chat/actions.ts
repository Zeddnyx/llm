"use server";
import { ollama } from "ollama-ai-provider";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function continueConversation(history: Message[]) {
  const stream = createStreamableValue();
  const model = ollama("qwen:1.8b");

  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })().then(() => { });

  return {
    messages: history,
    newMessage: stream.value,
  };
}
