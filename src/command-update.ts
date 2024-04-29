import { parseArgs } from "node:util";
import { askForInput, askForSecret } from "./console-input";
import { AccountManager } from "./account-manager";
import { getRandomString } from "./random-string";
import { printEmptyLine, printErrorLine, printHeadline, printLine } from "./console-output";

export async function updateAccount(args: string[], accountManager: AccountManager) {
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
    "password": {
      type: "boolean" as const,
      short: "p",
    },
    "message": {
      type: "string" as const,
      short: "m",
    },
  };

  const argsParseResult = parseArgs({
    args,
    options,
  });

  const values = argsParseResult.values;
  let site: string;
  let username: string;
  let password: string;
  let message: string;

  if (values["site"] && values["username"]) {
    site = values["site"] || (await askForInput("Site: "));
    username = values["username"] || (await askForInput("Username: "));
  } else if (values["query"]) {
    const accounts = accountManager.listAccount(values["query"]);

    if (accounts.length < 1) {
      printErrorLine(`Query "${values["query"]}" doesn't match any account.`);
      return;
    }
    if (accounts.length > 1) {
      printErrorLine(`Query "${values["query"]}" matches more than 1 account.`);

      for (const account of accounts) {
        printHeadline(`${account.site} - ${account.username}`);
        if (account.message) {
          printLine(account.message);
        }
        printEmptyLine();
      }

      return;
    }

    site = accounts[0].site;
    username = accounts[0].username;
  } else {
    printErrorLine("Please specify site and username or provide a search query.");
  }

  if (values["password"]) {
    password = await askForSecret("Password (or empty for random password): ");
  }
  if (!password) {
    password = getRandomString();
  }

  message = values["message"];

  accountManager.updateAccount(site, username, {
    password,
    message,
    updatedAt: Date.now()
  });
}
