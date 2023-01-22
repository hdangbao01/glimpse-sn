// const userApi = 'http://localhost:3000/user'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const btnSwitchLogIn = $('.switch-log-in-btn')
const btnSwitchSignUp = $('.switch-sign-up-btn')
const screenSignUp = $('.sign-up')
const screenLogIn = $('.sign-in')
const storageLogin = 'userLogin'

function start() {
    redirect()
    handleSwitch()
}

start();

function redirect() {
    const dataStorage = localStorage.getItem(storageLogin)
    if (dataStorage) {
        window.location.href = "./showcase.html"
    }
}

function handleSwitch() {
    btnSwitchLogIn.addEventListener("click", () => {
        screenSignUp.style.display = "block"
        screenLogIn.style.display = "none"
    })

    btnSwitchSignUp.addEventListener("click", () => {
        screenSignUp.style.display = "none"
        screenLogIn.style.display = "block"
    })
}