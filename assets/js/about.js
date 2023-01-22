const photoApi = 'http://localhost:3000/photoHome'
const userApi = 'http://localhost:3000/user'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const openAddImage = document.getElementById('icon-add-image')
const inpFile = document.getElementById('inpFile')
const textarea = $('.modal_textarea')
const modalBody = $('.modal_body')
const modalOverlay = $('.modal_overlay')
const modal = $('.modal')
const imgBorder = $('.modal_border')
const imgPreview = $('.modal_border_img')
const btnAddImage = $('.modal_input.link')
const signIn = $('.sign-in')
const signIned = $('.sign-ined')
const btnDropUser = $('.sign-ined-dropdown')
const dropdownUser = $('.sign-ined-droplist')
const btnSignOut = $('.sign-out-btn')
const storageLogin = 'userLogin'
const scrollTop = $('.scroll-top')
const currentdate = new Date()

function start() {
    getUser(inforSignin)
    handleCreateForm()
    handleModal()
}

start();

function getUser(cb) {
    fetch(userApi)
        .then(function(response) {
            return response.json();
        })
        .then(cb)
}

function createPhoto(data) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(photoApi, options)
        .then(function (response) {
            response.json();
        })
}

function inforSignin(users) {
    const dataSingIned = localStorage.getItem(storageLogin)
    const userId = users.find(function(user) {
        return user.email == dataSingIned
    })
    const userSignin = document.querySelector('.sign-ined-avatar')
    const htmls = ` <img src="./assets/image/user/${userId.avatar}" alt=""> `
    userSignin.innerHTML = htmls
}

function handleCreateForm() {
    const endpoint = "upload.php"
    const dataImg = new FormData()
    const createBtn = document.querySelector('.modal_button')
    createBtn.onclick = e => {
        e.preventDefault()
        const link = document.querySelector('input[name="link"]').value.split("\\").pop()
        const title = document.querySelector('input[name="title"]').value
        const description = document.querySelector('textarea').value
        const genre = document.querySelector('input[name="genre"]').value
        const formData = {
            user: localStorage.getItem(storageLogin),
            title: title,
            description: description,
            link: link,
            genre: genre,
            time: `${(currentdate.getMonth()+1)}, ${currentdate.getFullYear()}`,
            album: ""
        }
        if(link != "" && title != "" && description != "" && genre != "") {
            dataImg.append("inpFile", inpFile.files[0])

            fetch(endpoint, {
                method: "post",
                body: dataImg
            }).catch(console.error)

            createPhoto(formData)
            modal.style.display = "none"
        }
    }

    textarea.addEventListener("keyup", e => {
        textarea.style.height = "40px"
        let scHeight = e.target.scrollHeight
        textarea.style.height = `${scHeight}px`
    })   

    btnAddImage.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const src = URL.createObjectURL(e.target.files[0]);
            imgPreview.src = src;
        }
        imgBorder.style.border = "none"
    });
}

function handleModal() {
    const dataSingIned = localStorage.getItem(storageLogin)

    // if(dataSingIned) {
    //     signIn.style.display = "none"
    //     signIned.style.display = "flex"
    // } else {
    //     signIn.style.display = "flex"
    //     signIned.style.display = "none"
    // }

    openAddImage.addEventListener("click", () => {
        modal.style.display = "flex"
        openAddImage.style.display = "none"
    })
    
    modalOverlay.addEventListener("click", () => {
        modal.style.display = "none"
        openAddImage.style.display = "block"
    })
    
    modalBody.addEventListener("click", e => {
        if (e.target.closest('.modal_icon_close')) {
            modal.style.display = "none"
            openAddImage.style.display = "block"
        }
    })

    btnDropUser.addEventListener("click", e => {
        dropdownUser.classList.toggle('active')
        document.onclick = e => {
            if(!e.target.closest('.sign-ined-dropdown')) {
                dropdownUser.classList.remove('active')
            }
        }
    })

    btnSignOut.addEventListener("click", e => {
        localStorage.removeItem(storageLogin)
        window.location.reload()
    })
}

window.addEventListener("scroll", () => {
    if(window.pageYOffset > 100) {
        scrollTop.style.opacity = 1
    } else {
        scrollTop.style.opacity = 0
    }
})