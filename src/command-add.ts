import { askForInput, askForSecret } from "./console-input";
import { getRandomString } from "./random-string";
import { AccountManager } from "./account-manager";

export async function addAccount(args: string[], accountManager: AccountManager) {
  let site: string;
  let username: string;
  let password: string = "";
  let message: string;

  site = await askForInput("Site: ");
  username = await askForInput("Username: ");

  const randomPassword = await askForInput("Generate random password? (Y/n): ");
  if (["Y", "y", ""].includes(randomPassword)) {
    password = getRandomString();
  } else {
    password = await askForSecret("Password: ");
  }

  message = await askForInput("Message: ");

  accountManager.addAccount({
    site,
    username,
    password,
    message,
    updatedAt: Date.now(),
  });
}
