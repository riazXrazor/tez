import { Connection, createConnection, getConnection } from "typeorm";

export let connection: Connection;

export const initializeDbConnection = async () => {
  try {
     connection = await createConnection();
  } catch (e) {
    if (e.name === "AlreadyHasActiveConnectionError") {
       connection = await getConnection();
   }  else {
      console.log("DB connection error: ", e);
   }
  }
  return connection;
};
