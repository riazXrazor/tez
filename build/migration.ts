import chalk from "chalk";
import readlineSync from "readline-sync";
import { execCmd } from "./utils/exec-cmd";

(async () => {
  const migrationName = readlineSync.question(chalk.blue("Enter a migration name:\n"));
  try {
    await execCmd(`npm run typeorm migration:generate -- --n ${migrationName}`);
  } catch (e) {
    console.log(chalk.red(e));
  }

})();
