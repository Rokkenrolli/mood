import { asserts, superoak } from "../deps.js"
import app from '../app.js'


Deno.test({
    name: "GET to '/' should render landingpage", fn: async () => {
        const testClient = await superoak(app);
        const response = await testClient.get('/').expect(200);
        asserts.assert(response.text.includes("Welcome to Mood!"))

    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "GET to '/auth/login' should have inputs for login", fn: async () => {
        const testClient = await superoak(app);
        const response = await testClient.get('/auth/login').expect(200)
        console.log(response.text)
        asserts.assert(response.text.includes('<input id="email" type="text" name="email"/>'))
        asserts.assert(response.text.includes('<input id="pwd" type="password" name="password"/>'));


    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "GET to '/auth/register' should have inputs for registering", fn: async () => {
        const testClient = await superoak(app);
        const response = await testClient.get('/auth/registration').expect(200)
        console.log(response.text)
        asserts.assert(response.text.includes('<input required id="user" type="text" name="username"/>'))
        asserts.assert(response.text.includes('<input required id="email" type="text" name="email" value=""/>'));
        asserts.assert(response.text.includes('<input required id="pwd" type="password" name="password"/>'));
        asserts.assert(response.text.includes('<input required id="ver" type="password" name="verification"/>'));


    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "GET to '/behaviour' without session redirect to login", fn: async () => {
        const testClient = await superoak(app);
        const response = await testClient.get('/behaviour').expect(200)

        asserts.assert(response.text.includes('<input id="email" type="text" name="email"/>'))
        asserts.assert(response.text.includes('<input id="pwd" type="password" name="password"/>'));



    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "POST to '/auth/registration' should fail without parameters", fn: async () => {
        const testClient = await superoak(app);
        const response = await testClient.post('/auth/registration')
            .expect(404)
            .send("username=olzu")
            .expect(404)
            .send("email=test@gmail.com")
            .expect(404)
            .send("password=1234")
            .expect(404)
    },
    sanitizeResources: false,
    sanitizeOps: false
})

