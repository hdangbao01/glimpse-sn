const photoApi = 'http://localhost:3000/photoHome'
const userApi = 'http://localhost:3000/user'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const openAddImage = document.getElementById('icon-add-image')
const inpFile = document.getElementById('inpFile')
const navbarItem = $$('.navbar-item-con')
const screens = $$('.showcase')
const scrollTop = $('.scroll-top')
const signIn = $('.sign-in')
const signIned = $('.sign-ined')
const storageLogin = 'userLogin'
const textarea = $('.modal_textarea')
const modalBody = $('.modal_body')
const modalOverlay = $('.modal_overlay')
const modal = $('.modal')
const imgBorder = $('.modal_border')
const imgPreview = $('.modal_border_img')
const btnAddImage = $('.modal_input.link')
const btnDropUser = $('.sign-ined-dropdown')
const dropdownUser = $('.sign-ined-droplist')
const btnSignOut = $('.sign-out-btn')
const btnExtend = $$('.showcase-extend')
const imageExtend = $$('.showcase-extend-select')
const selectExtend = $$('.showcase-item-more')
const searchValue = $('.search')
const searchNotFound = $('.notFound')
const btnShowNavbar = $('.btn-show-navbar')
const navbar = $('.panel')
const navbarOverlay = $('.overlay-navbar')
const currentdate = new Date()

function start() {
    handleShowcase()
    // getUser(inforSignin)
    handleCreateForm()
    handleAction()
    // getPhoto(renderSearch)
}

start()

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

function inforSignin(users) {
    const dataSingIned = localStorage.getItem(storageLogin)
    const userId = users.find(function(user) {
        return user.email == dataSingIned
    })
    const userSignin = document.querySelector('.sign-ined-avatar')
    const htmls = ` <img src="./assets/image/user/${userId.avatar}" alt=""> `
    userSignin.innerHTML = htmls
}

function renderSearch(photos) {
    searchValue.addEventListener("keyup", () => {
        const listPhotoBlock = document.querySelector('.search-output')

        const imgSearched = photos.filter((photo) => {
            return searchValue.value.toLowerCase() === photo.genre.toLowerCase()
        })
        
        if (imgSearched.length != 0) {
            const htmls = imgSearched.map(function(imgSearch) {
                return `
                    <div class="search-output-item">
                        <div class="search-output-img">
                            <img src="../assets/image/photo/index/${imgSearch.link}">
                            <div class="search-output-item-info" onclick="clickGetID(${imgSearch.id})">
                            </div>     
                            <div class="search-output-save" onclick="addSave(${imgSearch.id})">Save</div>
                            <div class="search-output-extend">
                                <i class="fa-solid fa-ellipsis"></i>
                                <div class="search-output-extend-select">
                                    <p>Download</p>
                                    <p>Hide photo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            })
            listPhotoBlock.innerHTML = htmls.join('')
            searchNotFound.style.display = "none"
        }
        else {
            listPhotoBlock.innerHTML = ""
            searchNotFound.style.display = "block"
        }
    })
}

function clickGetID(idImage) {
    window.location.href = `./poto.html?img=${idImage}`
}

function addSave(id) {
    console.log(id)
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

function handleShowcase() {
    const dataSingIned = localStorage.getItem(storageLogin)

    // if(dataSingIned) {
    //     signIn.style.display = "none"
    //     signIned.style.display = "flex"
    // } else {
    //     signIn.style.display = "flex"
    //     signIned.style.display = "none"
    // }

    navbarItem.forEach((tab, index) => {
        const screen = screens[index]
        
        tab.onclick = function () {
            if (screen != null) {
                $(".navbar-item-con.active").classList.remove("active")
                $(".showcase.active").classList.remove("active")
        
                this.classList.add("active")
                screen.classList.add("active")
            }
        }
    })
    
    window.addEventListener("scroll", () => {
        if(window.pageYOffset > 100) {
            scrollTop.style.opacity = 1
        } else {
            scrollTop.style.opacity = 0
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
            if(!e.target.closest('.sign-ined-dropdown')) {
                dropdownUser.classList.remove('active')
            }
        }
    })

    btnSignOut.addEventListener("click", () => {
        localStorage.removeItem(storageLogin)
        window.location.reload()
    })

    btnShowNavbar.addEventListener("click", () => {
        navbar.style.left = "0"
        navbarOverlay.style.display = "block"
    })

    navbarOverlay.addEventListener("click", () => {
        navbar.style.left = "-250px"
        navbarOverlay.style.display = "none"
    })

    window.addEventListener("resize", () => {
        if(window.outerWidth > 1215) {
            navbar.style.left = "0"
        } 
        else {
            navbar.style.left = "-250px"
        }
    })
}