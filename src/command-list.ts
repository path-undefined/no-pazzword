import { AccountManager } from "./account-manager";
import { printHeadline, printEmptyLine, printLine } from "./console-output";

export async function listAccount(args: string[], accountManager: AccountManager) {
  const accounts = accountManager.listAccount(args);

  for (const account of accounts) {
    printHeadline(`${account.site} - ${account.username}`);
    if (account.message) {
      printLine(account.message);
    }
    printEmptyLine();
  }
}
