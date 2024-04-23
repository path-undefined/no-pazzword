import { execSync } from "node:child_process";

export function copyToClipboard(content: string) {
  execSync(`echo -n '${content}' | clip.exe`);
}

export function clearClipboard() {
  execSync(`echo -n '' | clip.exe`)
}
