const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

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