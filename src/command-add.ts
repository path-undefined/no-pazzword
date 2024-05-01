import { parseArgs } from "node:util";

import { askForInput, askForSecret } from "./console-input";
import { getRandomString } from "./random-string";
import { AccountManager } from "./account-manager";

export async function addAccount(args: string[], accountManager: AccountManager) {
  const options = {
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
  let password: string = "";
  let message: string;

  site = values["site"] || (await askForInput("Site: "));
  username = values["username"] || (await askForInput("Username: "));

  if (values["password"]) {
    password = await askForSecret("Password (or empty for random password): ");
  }
  if (!password) {
    password = getRandomString();
  }

  message = values["message"] || (await askForInput("Message: "));

  accountManager.addAccount({
    site, username, password, message,
    updatedAt: Date.now(),
  });
}
