import { parseArgs } from "node:util";

import { AccountManager } from "./account-manager";
import { printHeadline, printEmptyLine, printLine } from "./console-output";

export async function listAccount(args: string[], accountManager: AccountManager) {
  const options = {
    "query": {
      type: "string" as const,
      short: "q",
      default: "",
    },
  };

  const argsParseResult = parseArgs({
    args,
    options,
  });

  const query = argsParseResult.values["query"] ?? "";

  const accounts = accountManager.listAccount(query);

  for (const account of accounts) {
    printHeadline(`${account.site} - ${account.username}`);
    if (account.message) {
      printLine(account.message);
    }
    printEmptyLine();
  }
}
