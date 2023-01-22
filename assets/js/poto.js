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
const addDownloadImg = $('.modal_download')
const outDownloadImg = $('.modal_overload')
const imgDownload = $('.download_img')
const widthDownload = $('#width')
const heightDownload = $('#height')
const ratioDownload = $('#ratio')
let ogImgRatio
const btnDownload = $('.download_body button')
const signIn = $('.sign-in')
const signIned = $('.sign-ined')
const btnDropUser = $('.sign-ined-dropdown')
const dropdownUser = $('.sign-ined-droplist')
const btnSignOut = $('.sign-out-btn')
const storageLogin = 'userLogin'
const storageAllImage = 'AllImage'
const btnBack = $('.back-home')
const scrollTop = $('.scroll-top')
const currentdate = new Date()

function start() {
    // getPhoto(renderPhoto)
    // getUser(inforPhoto)
    // getUser(inforSignin)
    handleCreateForm()
    handleModal()
}

start();

function getPhoto(cb) {
    fetch(photoApi)
        .then(function(response) {
            return response.json();
        })
        .then(cb)
}

function getUser(cb) {
    fetch(userApi)
        .then(function(response) {
            return response.json();
        })
        .then(cb)
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

function renderPhoto(photos) {
    const dataImage = localStorage.getItem(storageAllImage)
    
    const getUrl = new URLSearchParams(window.location.search)
    const getUrlImg = getUrl.get("img")    

    const dbPhoto = JSON.parse(dataImage)
    
    const photoId = dbPhoto.find(function(photo) {
        return photo.id == getUrlImg
    })

    const photoSame = photos.filter(function(photo) {
        return photo.genre == photoId.genre
    })
    
    const listPhotoBlock = document.querySelector('.related')
    const htmls = photoSame.map(function(photoHome) {
        return `
            <div class="relates-item">
                <div class="showcase-item">
                    <div class="showcase-img">
                        <img src="../assets/image/photo/index/${photoHome.link}">
                        <div class="showcase-item-info" onclick="clickGetID(${photoHome.id})">
                        </div>     
                        <div class="showcase-save" onclick="addSave(${photoHome.id})">Save</div>
                        <div class="showcase-extend">
                            <i class="fa-solid fa-ellipsis"></i>
                            <div class="showcase-extend-select">
                                <p>Download</p>
                                <p>Hide photo</p>
                            </div>
                        </div>
                    </div>                  
                </div>                        
            </div>
        `
    })
    listPhotoBlock.innerHTML = htmls.join('')
}

function inforSignin(users) {
    const dataSingIned = localStorage.getItem(storageLogin)
    const userId = users.find(function(user) {
        return user.email == dataSingIned
    })
    const userSignin = document.querySelector('.sign-ined-avatar')
    const htmls = ` <img src="./assets/image/user/${userId.avatar}"> `
    userSignin.innerHTML = htmls
}

function inforPhoto(users) {
    const dataImage = localStorage.getItem(storageAllImage)
    const listPhotoBlock = document.querySelector('.infor-item')

    const getUrl = new URLSearchParams(window.location.search)
    const getUrlImg = getUrl.get("img")    

    const photos = JSON.parse(dataImage)
    const imgId = photos.find(function(photo) {
        return photo.id == getUrlImg
    })

    const userId = users.find(function(user) {
        return user.email == imgId.user
    })

    imgDownload.innerHTML = `<img src="./assets/image/photo/index/${imgId.link}" onload="onLoadPreview()" class="imgPreview">`

    const htmls = `
            <div class="infor-img">
                <img src="../assets/image/photo/index/${imgId.link}" alt="" onload="onLoadImg()" id="wh">
            </div>
            <div class="infor-dec">
                <div class="infor-first">
                    <div class="infor-dec-add" onclick="btnAction()">
                        <i class="fa-solid fa-ellipsis"></i>
                        <ul class="infor-dec-drop">
                            <li onclick="addSave(${imgId.id})">Save</li>
                            <li onclick="downloadImg(${imgId.id})">Download</li>
                            <li>Share</li>                            
                            <a href="/play.html"><li>Play</li></a>
                        </ul>
                    </div>
                    <div class="infor-dec-title">
                        <h1>${imgId.title}</h1>                            
                        <p>${imgId.description}</p>
                    </div>
                    <div class="infor-dec-name">
                        <img src="../assets/image/user/${userId.avatar}" alt="">
                        <p>Hpow</p>
                        
                    </div>
                </div>
                <div class="infor-dec-about">
                    <div class="infor-dec-about-item date">
                        <i class="fa-regular fa-calendar"></i> ${imgId.time}
                    </div>
                    <div class="infor-dec-about-item wh">
                    </div>
                </div>
            </div>
        `
        // <i class="fa-solid fa-user-plus"></i>
    listPhotoBlock.innerHTML = htmls
}

function onLoadImg() {
    const w = document.querySelector('#wh').naturalWidth
    const h = document.querySelector('#wh').naturalHeight
    ogImgRatio = w/h
    widthDownload.value = w
    heightDownload.value = h
    const aboutImg = document.querySelector('.infor-dec-about-item.wh')

    const htmls = `
            <i class="fa-solid fa-pen-ruler"></i> ${w} x ${h}
        `
    aboutImg.innerHTML = htmls
}

function onLoadPreview() {
    const preview = $('.imgPreview')
    let croppable = false;
    const options = {
        viewMode: 2,
        modal: false,
        background: false,
        ready: function(){
            croppable = true;
        }        
    }
    const cropper = new Cropper(preview, options)

    console.log(cropper)

    btnDownload.addEventListener("click", () => {
        const canvas = document.createElement("canvas")
        const a = document.createElement("a")
        const ctx = canvas.getContext("2d")

        canvas.width = widthDownload.value
        canvas.height = heightDownload.value

        ctx.drawImage(preview, 0, 0, canvas.width, canvas.height)

        a.href = canvas.toDataURL("image/jpeg", 1.0)
        a.download = new Date().getTime()
        a.click()
    })    
}

function downloadImg(idImage) {
    addDownloadImg.style.display = "flex"
}

function addSave(idImage) {
    getUser(function(users) {
        const main = document.querySelector('.toast-mess')
        if (main) {
            const dataUserSignin = localStorage.getItem(storageLogin)
            const toast = document.createElement("div")
            const userInfor = users.find(function(user) {
                return user.email == dataUserSignin
            })
            id = userInfor.id
    
            setTimeout(function () {
                main.removeChild(toast);
            }, 4000);
    
            toast.style.animation = `slideInLeft ease .3s`

            const saveList = userInfor.save
            const checkSave = saveList.find(function(saveItem) {
                return saveItem == idImage
            })
            if (checkSave == undefined) {
                console.log("Them")
                toast.classList.add("toast")

                saveList.push(idImage)
                const formData = {
                    save: saveList
                }
                updateProfile(formData, id)

                toast.innerHTML = `
                    <div class="toast-icon">
                        <i class="fa-solid fa-floppy-disk"></i>
                    </div>
                    <div class="message">
                        <h2>Lưu ảnh thành công!</h2>
                        <p>Vào trang cá nhân để xem ảnh đã lưu.</p>
                    </div>
                `
            } else {
                toast.classList.add("toast-error")

                toast.innerHTML = `
                    <div class="toast-icon-error">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                    <div class="message">
                        <h2>Ảnh đã được lưu trước đó!</h2>
                        <p>Vào trang cá nhân để xem ảnh đã lưu.</p>
                    </div>
                `
                console.log("Trung")
            }
            
            main.appendChild(toast)
        }
    })
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

function clickGetID(idImage) {
    window.location.href = `./poto.html?img=${idImage}`
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

    btnSignOut.addEventListener("click", () => {
        localStorage.removeItem(storageLogin)
        window.location.reload()
    })

    outDownloadImg.addEventListener("click", () => {
        addDownloadImg.style.display = "none"
    })

    widthDownload.addEventListener("keyup", () => {
        const hei = ratioDownload.checked ? widthDownload.value / ogImgRatio : heightDownload.value
        heightDownload.value = Math.floor(hei)
    })

    heightDownload.addEventListener("keyup", () => {
        const wid = ratioDownload.checked ? heightDownload.value * ogImgRatio : widthDownload.value
        widthDownload.value = Math.floor(wid)
    })
}

function btnAction() {
    const dropFu = $('.infor-dec-drop')

    if(dropFu.style.display == "none" || dropFu.style.display == "") {
        dropFu.style.display = "block"
    } else {
        dropFu.style.display = "none"
    }
}

document.onclick = e => {
    const dropFu = $('.infor-dec-drop')

    if(!e.target.closest('.infor-dec-add')) {
        dropFu.style.display = "none"
    }
}

btnBack.addEventListener("click", () => {
    window.history.back()
})

window.addEventListener("scroll", () => {
    if(window.pageYOffset > 100) {
        scrollTop.style.opacity = 1
    } else {
        scrollTop.style.opacity = 0
    }
})