import app from "../app.js"
import { asserts } from "../deps.js"
import * as days from "../services/dayService.js"

Deno.test({
    name: "getWeekAPI should return an object", fn: async () => {
        const query = await days.getWeekAPI();
        console.log(query)
        asserts.assert(typeof query === "object")
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "getDayComplete should return an array", fn: async () => {
        const query = await days.getDayComplete('2020-12-10');
        console.log(query)
        asserts.assert(Array.isArray(query))
    },
    sanitizeResources: false,
    sanitizeOps: false
})



