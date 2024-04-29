import { scryptSync, createCipheriv, createDecipheriv, randomFillSync } from "node:crypto";
import { Buffer } from "node:buffer";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

export type AccountSiteLookup = Record<string, AccountUsernameLookup>;

export type AccountUsernameLookup = Record<string, Account>;

export type Account = {
  site: string;
  username: string;
  password: string;
  updatedAt: number;
  message: string;
};

export class AccountManager {
  private static ENCRYPTION_ALGORITHM = "aes-192-cbc";
  private static ENCRYPTION_SALT = "IbwN2qbstT";

  private accountLookup: AccountSiteLookup = {};

  public constructor(
    private filePath: string,
    private mainPassword: string,
  ) {}

  public readAccountFile() {
    if (!existsSync(this.filePath)) {
      this.accountLookup = {};
      return;
    }

    const fileContent = readFileSync(this.filePath, { encoding: "utf8" });
    const decryptedFileContent = this.decryptContent(fileContent);
    this.accountLookup = JSON.parse(decryptedFileContent);
  }

  public saveAccountFile() {
    const decryptedFileContent = JSON.stringify(this.accountLookup);
    const fileContent = this.encryptContent(decryptedFileContent);
    writeFileSync(this.filePath, fileContent, { encoding: "utf8" });
  }

  public addAccount(account: Account) {
    if (!this.accountLookup[account.site]) {
      this.accountLookup[account.site] = {};
    }

    this.accountLookup[account.site][account.username] = account;
  }

  public updateAccount(site: string, username: string, account: Partial<Account>) {
    this.accountLookup[site][username] = {
      ... this.accountLookup[site][username],
      ... account
    };
  }

  public listAccount(query: string): Account[] {
    const queryWords = query.split(" ");
    const results: Account[] = [];

    for (const usernameLookup of Object.values(this.accountLookup)) {
      for (const account of Object.values(usernameLookup)) {
        if (queryWords.every((word) => 
          account.site.toLocaleUpperCase().includes(word.toLocaleUpperCase()) ||
          account.username.toLocaleUpperCase().includes(word.toLocaleUpperCase())
        )) {
          results.push(account);
        }
      }
    }

    return results;
  }

  public deleteAccount(site: string, username: string) {
    delete this.accountLookup[site][username];
  }

  public getAccount(site: string, username: string): Account {
    return this.accountLookup[site][username];
  }

  private encryptContent(clearText: string): string {
    const key = scryptSync(this.mainPassword, AccountManager.ENCRYPTION_SALT, 24);
    const iv = randomFillSync(Buffer.alloc(16));

    const cipher = createCipheriv(AccountManager.ENCRYPTION_ALGORITHM, key, iv);

    let encrypted = cipher.update(clearText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const ivText = iv.toString("hex");

    return [ivText, encrypted].join(":");
  }

  private decryptContent(secretText: string): string {
    const key = scryptSync(this.mainPassword, AccountManager.ENCRYPTION_SALT, 24);
    const [ivText, encrypted] = secretText.split(":");

    const iv = Buffer.from(ivText, "hex");

    const decipher = createDecipheriv(AccountManager.ENCRYPTION_ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
