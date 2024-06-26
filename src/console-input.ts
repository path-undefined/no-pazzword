import { read } from "read";
import { printEmptyLine } from "./console-output";

export async function askForInput(question: string): Promise<string> {
  return await read({ prompt: question });
}

export async function askForSecret(question: string): Promise<string> {
  const result = await read({ prompt: question, silent: true });
  printEmptyLine();

  return result;
}
