import { addAccount } from "./command-add";
import { listAccount } from "./command-list";
import { getAccount } from "./command-get";
import { deleteAccount } from "./command-delete";
import { updateAccount } from "./command-update";
import { askForSecret } from "./console-input";
import { AccountManager } from "./account-manager";
import { printEmptyLine, printErrorLine } from "./console-output";

(async function() {
  const accountFilePath = process.env.NO_PAZZWORD_FILE;
  const mainPassword = await askForSecret("Main password: ");

  const accountManager = new AccountManager(accountFilePath, mainPassword);
  accountManager.readAccountFile();

  printEmptyLine();

  const args: string[] = process.argv.slice(2);

  switch(args[0]) {
    case "add":
    case "create":
      await addAccount(args.slice(1), accountManager);
    break;

    case "list":
    case "search":
      await listAccount(args.slice(1), accountManager);
    break;
  
    case "get":
      await getAccount(args.slice(1), accountManager);
    break;
  
    case "delete":
    case "remove":
      await deleteAccount(args.slice(1), accountManager);
    break;

    case "update":
    case "modify":
      await updateAccount(args.slice(1), accountManager);
    break;
  
    default:
      printErrorLine(`Unknown command: ${args[0]}`);
      process.exit();
  }

  accountManager.saveAccountFile();
})();
