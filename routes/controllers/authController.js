


const showLogin = async ({ render }) => {
    const data = { loginError: null }
    render("login.ejs", data)
}

const showRegister = async ({ render }) => {
    const data = { errors: null, passwordError: null }
    console.log("serve registration")
    render("register.ejs", data)
}

export { showLogin, showRegister }