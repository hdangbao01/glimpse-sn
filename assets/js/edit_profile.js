const photoApi = 'http://localhost:3000/photoHome'
const userApi = 'http://localhost:3000/user'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const openAddImage = document.getElementById('icon-add-image')
const inpFile = document.getElementById('inpFile')
const inpAvt = document.getElementById('avatar')
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
const ten = $('#ten')
const email = $('#email')
const username = $('#username')
const phone = $('#phone')
const avatar = $('.avatar')
const sexSelected = document.getElementsByName('sex')
const scrollTop = $('.scroll-top')
const currentdate = new Date()
// const avtpoint = "upavt.php"
// const dataAvt = new FormData()

function start() {
    // getUser(inforUser)
    // redirect()
    handleCreateForm()
    handleModal()
}

start()

function getUser(cb) {
    fetch(userApi)
        .then(function(response) {
            return response.json();
        })
        .then(cb)
}

// function redirect() {
//     const dataStorage = localStorage.getItem(storageLogin)
//     if (dataStorage === null) {
//         window.location.href = "./showcase.html"
//     }
// }

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

function updateProfile(data, id) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(userApi + '/' + id, options)
        .then(function (response) {
            response.json();
        })
}

function inforUser(users) {
    // const avtpoint = "upavt.php"
    // const dataAvt = new FormData()
    const dataUserSignin = localStorage.getItem(storageLogin)
    const avatarUser = document.querySelector('.edit-form-avt')
    const userSignin = document.querySelector('.sign-ined-avatar')

    const userInfor = users.find(function(user) {
        return user.email == dataUserSignin
    })

    const signavt = ` <img src="./assets/image/user/${userInfor.avatar}" alt=""> `
    userSignin.innerHTML = signavt

    const htmls = ` <img src="./assets/image/user/${userInfor.avatar}" alt=""> `
    avatarUser.innerHTML = htmls

    id = userInfor.id
    email.value = `${userInfor.email}`
    if (userInfor.name) {
        ten.value = `${userInfor.name}`
    } else {
        ten.value = ""
    }

    if (userInfor.username) {
        username.value = `${userInfor.username}`
    } else {
        username.value = ""
    }

    if (userInfor.phone) {
        phone.value = `${userInfor.phone}`
    } else {
        phone.value = ""
    }

    $(`#${userInfor.sex}`).setAttribute("checked", "true")

    const editBtn = document.querySelector('.btn-form-save')
    editBtn.addEventListener("click",  e => {
        e.preventDefault()
        var sex = ''
        for (var i = 0; i < sexSelected.length; i++) {
            if (sexSelected[i].checked == true) {
                sex = sexSelected[i].value
            }
        }

        const formData = {
            avatar: avatar.value.split("\\").pop(),
            name: ten.value,
            username: username.value,
            email: email.value,
            phone: phone.value,
            sex: sex
        }
        if(avatar != "" && ten != "" && username != "" && email != "" && phone != "" && sex != "") {
            // dataAvt.append("inpAvt", inpAvt.files[0])

            // fetch(avtpoint, {
            //     method: "post",
            //     body: dataAvt
            // }).catch(console.error)

            updateProfile(formData, id)
            // window.location.href = "./edit_profile.html"
        }
    })
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