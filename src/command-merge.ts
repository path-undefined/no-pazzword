import { askForInput, askForSecret } from "./console-input";
import { AccountManager } from "./account-manager";
import { printEmptyLine, printErrorLine, printLine } from "./console-output";

export async function mergeAccount(args: string[], accountManager: AccountManager) {
  if (args.length < 1) {
    printErrorLine("Please specify site and username or provide a search query.");
    return;
  }

  const externalAccountFilePath = args[0];
  const externalMainPassword = await askForSecret(`Main password for ${externalAccountFilePath}: `);

  printEmptyLine();

  const externalAccountManager = new AccountManager(externalAccountFilePath, externalMainPassword);

  const externalAccounts = externalAccountManager.listAccount([]);

  for (const externalAccount of externalAccounts) {
    const existingAccount = accountManager.getAccount(externalAccount.site, externalAccount.username);

    if (!existingAccount) {
      accountManager.addAccount(externalAccount);
      continue;
    }

    if (existingAccount.password === externalAccount.password
      && existingAccount.message === externalAccount.message) {
      continue;
    }

    printLine(`Account for site "${externalAccount.site}" with user "${externalAccount.username}" are different.`);
    printLine(`The account in the external file is ${externalAccount.updatedAt > existingAccount.updatedAt ? "newer" : "older"}.`);
    const overwrite = await askForInput("Do you want to use the account in the external file to overwrite the existing one? (Y/n): ");

    if (["Y", "y", ""].includes(overwrite)) {
      accountManager.deleteAccount(existingAccount.site, existingAccount.username);
      accountManager.addAccount(externalAccount);
      printLine("The account has been overwritten by the external account.");
    } else {
      printLine("The existing account has been kept.");
    }
  }

  printLine(`Finished merging accounts from ${externalAccountFilePath}`);
}
