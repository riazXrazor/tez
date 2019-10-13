import chalk from "chalk";
import { createReadStream, createWriteStream } from "fs";
import prettyHrtime from "pretty-hrtime";
import uniqid from "uniqid";
import { prepend } from "./utils/prepend";
const uid = uniqid(uniqid.time());

const start = process.hrtime();
createReadStream(".env.example").pipe(createWriteStream(".env")).on("finish", () => {
  prepend(".env", `APPKEY = ${uid}`);
  const end = process.hrtime(start);
  console.log(chalk.greenBright(`✓ .env file generated (${prettyHrtime(end)})`));
});

