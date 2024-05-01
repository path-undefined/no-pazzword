export function printHeadline(content: string) {
  console.log("\x1b[35m\x1b[1m" + content + "\x1b[0m");
}

export function printLine(content: string) {
  console.log(content);
}

export function printEmptyLine() {
  console.log();
}

export function printErrorLine(content: string) {
  console.log("\x1b[31m\x1b[1m" + "Error: " + content + "\x1b[0m");
}
