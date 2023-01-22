const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const navbarItem = $$('.navbar-item-con')
const screens = $$('.showcase')

navbarItem.forEach((tab, index) => {
    const screen = screens[index]
    
    tab.onclick = function () {
        $(".navbar-item-con.active").classList.remove("active");
        $(".showcase.active").classList.remove("active");

        this.classList.add("active");
        screen.classList.add("active");
    };
});