
import { Pool } from "../deps.js";
import { conf } from "../config/config.js";

const connectionPool = new Pool(conf.database, 3)



const executeQuery = async (query, ...params) => {
  const client = await connectionPool.connect();
  try {
    return await client.query(query, ...params);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }

  return [];
};

export { executeQuery };