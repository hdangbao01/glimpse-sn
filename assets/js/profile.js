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
const listPhotoUp = document.querySelector('.row1')
const listPhotoSave = document.querySelector('.row2')
const listPhotoAlbum = document.querySelector('.row3')
const activePhotoUp = document.querySelector('.select-item-up')
const activePhotoSave = document.querySelector('.select-item-save')
const activePhotoAlbum = document.querySelector('.select-item-album')
const storageLogin = 'userLogin'
const storageAllImage = 'AllImage'
const scrollTop = $('.scroll-top')
const currentdate = new Date()

function start() {
    // getUser(inforUser)
    // getUser(renderSavePhoto)
    // redirect()
    handleCreateForm()
    handleAction()
}

start();

function getUser(cb) {
    fetch(userApi)
        .then(function (response) {
            return response.json();
        })
        .then(cb)
}

function inforUser(users) {
    const dataUserSignin = localStorage.getItem(storageLogin)
    const listPhotoBlock = document.querySelector('.profile-avt-first')
    const userSignin = document.querySelector('.sign-ined-avatar')

    const userInfor = users.find(function (user) {
        return user.email == dataUserSignin
    })

    const signavt = ` <img src="./assets/image/user/${userInfor.avatar}" alt=""> `
    userSignin.innerHTML = signavt

    if (userInfor.name) {
        const htmls = ` <img src="./assets/image/user/${userInfor.avatar}" alt="">
                        <h1>${userInfor.name}</h1> `
        listPhotoBlock.innerHTML = htmls
    } else {
        const htmls = ` <img src="./assets/image/user/${userInfor.avatar}" alt="">
                        <h1>${userInfor.email}</h1> `
        listPhotoBlock.innerHTML = htmls
    }
    // const htmls = ` <img src="./assets/image/user/${userInfor.avatar}" alt="">
    //                 <h1>${userInfor.name}</h1> `
    // listPhotoBlock.innerHTML = htmls
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


function deletePhoto(id) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(photoApi + '/' + id, options)
        .then(function (response) {
            response.json();
        })
        .then(function(){
            if (document.querySelector('.photo-item-' + id)) {
                document.querySelector('.photo-item-' + id).remove()
            }
        })    
}

function renderSavePhoto(users) {
    const dataSingIned = localStorage.getItem(storageLogin)
    const dataImage = localStorage.getItem(storageAllImage)
    const dbPhoto = JSON.parse(dataImage)

    const userId = users.find(function (user) {
        return user.email == dataSingIned
    })
    const photoSave = userId.save
    photoSave.forEach(function (picture) {
        const photoInfor = dbPhoto.find(function (photo) {
            return picture == photo.id
        })
        const photoSet = JSON.stringify(photoInfor)
        const htmls = `
                <div class="album-item columm-2_5">
                    <img src="./assets/image/photo/index/${photoInfor.link}" alt="" onclick="clickGetID(${photoInfor.id})">
                    <div class="album-dec">
                        <div class="album-dec-icon" onclick="decSave(${photoInfor.id})">
                            <i class="fa-solid fa-ellipsis album-dec-icon-action2"></i>
                            <ul class="infor-dec-drop infor-dec-drop2-${photoInfor.id}">
                                <li>Bỏ thích</li>
                            </ul>
                        </div>                    
                    </div>       
                </div>
            `
        listPhotoSave.innerHTML += htmls
    })

    dbPhoto.forEach(function (photoUp) {
        if (photoUp.user == dataSingIned) {
            const htmls = `
                    <div class="album-item columm-2_5 photo-item-${photoUp.id}">
                        <img src="./assets/image/photo/index/${photoUp.link}" alt="" onclick="clickGetID(${photoUp.id})">
                        <div class="album-dec">
                            <div class="album-dec-icon" onclick="decUp(${photoUp.id})">
                                <i class="fa-solid fa-ellipsis album-dec-icon-action1"></i>
                                <ul class="infor-dec-drop infor-dec-drop1-${photoUp.id}"">
                                    <li onclick="deletePhoto(${photoUp.id})">Xoá ảnh</li>
                                </ul>
                            </div>                    
                        </div>       
                    </div>
                `
            listPhotoUp.innerHTML += htmls
        }
    })
}

function clickGetID(idImage) {
    window.location.href = `./poto.html?img=${idImage}`
}

function decSave(id) {
    const dropFut = document.querySelector(`.infor-dec-drop2-${id}`)
    if (dropFut.style.display == "none" || dropFut.style.display == "") {
        dropFut.style.display = "block"
    } else {
        dropFut.style.display = "none"
    }
}

function decUp(id) {
    const dropFut = document.querySelector(`.infor-dec-drop1-${id}`)
    if (dropFut.style.display == "none" || dropFut.style.display == "") {
        dropFut.style.display = "block"
    } else {
        dropFut.style.display = "none"
    }
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
            time: `${(currentdate.getMonth() + 1)}, ${currentdate.getFullYear()}`,
            album: ""
        }
        if (link != "" && title != "" && description != "" && genre != "") {
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
    })
}

function handleAction() {
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
            if (!e.target.closest('.sign-ined-dropdown')) {
                dropdownUser.classList.remove('active')
            }
        }
    })

    btnSignOut.addEventListener("click", e => {
        localStorage.removeItem(storageLogin)
        window.location.reload()
    })

    activePhotoUp.addEventListener("click", e => {
        listPhotoUp.style.display = "flex"
        listPhotoSave.style.display = "none"
        listPhotoAlbum.style.display = "none"
        activePhotoUp.classList.add('active')
        activePhotoSave.classList.remove('active')
        activePhotoAlbum.classList.remove('active')
    })
    activePhotoSave.addEventListener("click", e => {
        listPhotoUp.style.display = "none"
        listPhotoSave.style.display = "flex"
        listPhotoAlbum.style.display = "none"
        activePhotoUp.classList.remove('active')
        activePhotoSave.classList.add('active')
        activePhotoAlbum.classList.remove('active')
    })
    activePhotoAlbum.addEventListener("click", e => {
        listPhotoUp.style.display = "none"
        listPhotoSave.style.display = "none"
        listPhotoAlbum.style.display = "flex"
        activePhotoUp.classList.remove('active')
        activePhotoSave.classList.remove('active')
        activePhotoAlbum.classList.add('active')
    })
}

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
        scrollTop.style.opacity = 1
    } else {
        scrollTop.style.opacity = 0
    }
})