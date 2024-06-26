import { AccountManager } from "./account-manager";
import { printEmptyLine, printErrorLine, printHeadline, printLine } from "./console-output";

export async function deleteAccount(args: string[], accountManager: AccountManager) {
  if (args.length < 1) {
    printErrorLine("Please specify site and username or provide a search query.");
    return;
  }

  const accounts = accountManager.listAccount(args);

  if (accounts.length < 1) {
    printErrorLine(`Query "${args.join(" ")}" doesn't match any account.`);
    return;
  }
  if (accounts.length > 1) {
    printErrorLine(`Query "${args.join(" ")}" matches more than 1 account:`);

    for (const account of accounts) {
      printHeadline(`${account.site} - ${account.username}`);
      if (account.message) {
        printLine(account.message);
      }
      printEmptyLine();
    }

    return;
  }

  const site = accounts[0].site;
  const username = accounts[0].username;

  accountManager.deleteAccount(site, username);
}
