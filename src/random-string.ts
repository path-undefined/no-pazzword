export function getRandomString(): string {
  const SYMBOL = "-";
  const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const DIGITS = "0123456789";

  const results: string[] = [];
  results.push(getRandomCharactersFromString(CHARACTERS, 4));
  results.push(getRandomCharactersFromString(CHARACTERS, 4));
  results.push(getRandomCharactersFromString(DIGITS, 4));
  results.push(getRandomCharactersFromString(CHARACTERS, 4));

  return results.join(SYMBOL);
}

export function getRandomCharactersFromString(availableCharacters: string, length: number) {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += availableCharacters.charAt(Math.floor(Math.random() * availableCharacters.length));
  }

  return randomString;
}
