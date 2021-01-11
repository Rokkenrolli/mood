import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { executeQuery } from "../../database/database.js";
import { validation } from "../../deps.js"


const register = async ({ request, response, session, render }) => {
    const body = request.body();
    const params = await body.value;

    const username = params.get('username');
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');
    const data = {
        username: username,
        email: email,
        password: password,
        verification: verification,
        errors: null
    }

    const existingUsers = await executeQuery("SELECT * FROM registers WHERE email = $1", email);
    const existingmail = existingUsers.rowCount > 0 ? existingUsers.rowsOfObjects()[0].email : ""
    const validationRules = {
        username: [validation.required],
        email: [validation.isEmail, validation.required, validation.notIn([existingmail])]
    }

    const [passes, errors] = await validation.validate(data, validationRules);
    console.log({ passes, errors });
    if (!passes) {
        data.errors = errors
        render('register.ejs', data)
        return;
    }

    if (password !== verification) {
        data.passwordError = "passwords does not match"
        render('register.ejs', data)
        return;
    }
    if (password.length < 4) {
        data.passwordError = "passwords must be longer than 3"
        render('register.ejs', data)
        return;
    }

    // otherwise, store the details in the database
    const hash = await bcrypt.hash(password);
    // when storing a password, store the hash
    await executeQuery("INSERT INTO registers (name, email, password) VALUES ($1, $2, $3);", username, email, hash);
    const res = await executeQuery("SELECT * FROM registers WHERE email = $1;", email);
    if (res.rowCount === 0) {
        response.status = 401;
        return;
    }

    // take the first row from the results
    const userObj = res.rowsOfObjects()[0];
    await session.set("authenticated", true)
    await session.set('user', {
        id: userObj.id,
        username: userObj.name,
        email: userObj.email
    });
    response.body = 'Registration successful!';
    response.redirect('/')
};

const authenticate = async ({ request, response, session, render }) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');
    const data = {
        loginError: null
    }

    // check if the email exists in the database
    const res = await executeQuery("SELECT * FROM registers WHERE email = $1;", email);
    if (res.rowCount === 0) {
        data.loginError = "incorrect email or password"
        render("login.ejs", data)
        return;
    }

    // take the first row from the results
    const userObj = res.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        data.loginError = "incorrect email or password"
        render("login.ejs", data)
        return;
    }

    console.log("authenticated with user: " + userObj.name + ", " + userObj.email)
    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        username: userObj.name,
        email: userObj.email
    });
    response.body = 'Authentication successful!';
    response.redirect("/");
}

const logout = async ({ session, response }) => {
    await session.set("user", {})
    await session.set("authenticated", false)
    console.log("logging out")
    console.log("user is now " + await session.get('user'))
    response.redirect('/auth/login')
}

export { register, authenticate, logout }