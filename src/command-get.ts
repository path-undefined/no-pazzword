import { AccountManager } from "./account-manager";
import { clearClipboard, copyToClipboard } from "./console-command";
import { askForSecret } from "./console-input";
import { printEmptyLine, printErrorLine, printHeadline, printLine } from "./console-output";

export async function getAccount(args: string[], accountManager: AccountManager) {
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

  const account = accounts[0];

  printHeadline(`${account.site} - ${account.username}`);
  if (account.message) {
    printLine(account.message);
  }
  printEmptyLine();

  copyToClipboard(account.username);

  printLine("Username copied to clipboard");
  await askForSecret("Press enter key to continue");

  copyToClipboard(account.password);
  printEmptyLine();

  printLine("Password copied to clipboard");
  await askForSecret("Press enter key to continue");

  clearClipboard();
}
