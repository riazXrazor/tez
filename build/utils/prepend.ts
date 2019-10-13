import { readFileSync, writeFileSync } from "fs";
export function prepend(name: string, data: string) {
  try {
    const result = readFileSync(name, "utf8");
    data = data + "\n" + result;
    writeFileSync(name, data);
  } catch (e) {
    console.error(e);
  }
}
