import { readdirSync } from "fs";

export default function(importPath: string): any {
  return readdirSync(importPath)
    .filter((fileName) => {
      return fileName.match(/\.controller\.ts$/);
    })
    .map((fileName) => {
      return fileName;
    });
}
