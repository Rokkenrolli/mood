import { config } from "../deps.js"
let conf = {};
console.log(config())
if (Deno.env.get('TEST_ENVIRONMENT')) {
  conf.database = {};
} else {
  const c = config()
  c.port = Number(c.port)
  conf.database = c
}

export { conf }; 