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
      default: "",
    },
  };

  const argsParseResult = parseArgs({
    args,
    options,
  });
  
  const values = argsParseResult.values;
  let password: string;

  if (!values.site) {
    values.site = await askForInput("Site: ");
  }

  if (!values.username) {
    values.username = await askForInput("Username: ");
  }

  if (values["password"]) {
    password = await askForSecret("Password:");
  } else {
    password = getRandomString();
  }

  accountManager.addAccount({
    site: values.site,
    username: values.username,
    password,
    message: values.message,
    updatedAt: Date.now(),
  });
}
