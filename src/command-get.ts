import { parseArgs } from "node:util";

import { AccountManager } from "./account-manager";
import { printEmptyLine, printErrorLine, printHeadline, printLine } from "./console-output";
import { clearClipboard, copyToClipboard } from "./console-command";
import { askForSecret } from "./console-input";

export async function getAccount(args: string[], accountManager: AccountManager) {
  const options = {
    "query": {
      type: "string" as const,
      short: "q",
    },
    "site": {
      type: "string" as const,
      short: "s",
    },
    "username": {
      type: "string" as const,
      short: "u",
    },
  };

  const argsParseResult = parseArgs({
    args,
    options,
  });

  const values = argsParseResult.values;
  let site: string;
  let username: string;

  if (values["site"] && values["username"]) {
    site = values["site"];
    username = values["username"];
  } else if (values["query"]) {
    const accounts = accountManager.listAccount(values["query"]);

    if (accounts.length < 1) {
      printErrorLine(`Query "${values["query"]}" doesn't match any account.`);
    } else if (accounts.length > 1) {
      printErrorLine(`Query "${values["query"]}" matches more than 1 account.`);
      for (const account of accounts) {
        printHeadline(`${account.site} - ${account.username}`);
        if (account.message) {
          printLine(account.message);
        }
        printEmptyLine();
      }
    } else {
      site = accounts[0].site;
      username = accounts[0].username;
    }
  } else {
    printErrorLine("Please specify site and username or provide a search query.");
  }

  const account = accountManager.getAccount(site, username);

  copyToClipboard(account.username);

  printLine("Username copied to clipboard");
  await askForSecret("Press enter key to continue");

  copyToClipboard(account.password);
  printEmptyLine();

  printLine("Password copied to clipboard");
  await askForSecret("Press enter key to continue");

  clearClipboard();
}