let $ = document
const url = "http://localhost:5005/blog"
const profileMenu = $.querySelector("#profile-menu")
const menuButton = $.querySelector("#menu-btn")
const nameUser = $.querySelector("#name-user")
const menuDropdown = $.querySelector("#menu-drop-down")
const arrowDownIcon = $.querySelector("#arrow-down-icon")
const logOutBtn = $.querySelector("#log-out-btn")
const lightIcon = $.querySelector("#light-icon")
const darkIcon = $.querySelector("#dark-icon")
const loginBtn = $.querySelector(".login-btn")
const signupBtn = $.querySelector(".signup-btn")
let classTheme = document.documentElement
let getTheme = localStorage.getItem("theme")
menuButton.addEventListener("click", function () {
    menuDropdown.classList.toggle("hidden")
    arrowDownIcon.classList.toggle("rotate-180")
});
document.addEventListener("click", event => {
    if (!profileMenu.contains(event.target)) {
        menuDropdown.classList.add("hidden")
        arrowDownIcon.classList.remove("rotate-180")
    }
})
function setTheme () {
    if (getTheme === "light") {
        classTheme.classList.remove("dark")
        darkIcon.classList.add("hidden")
        lightIcon.classList.remove("hidden")
    }else {
        classTheme.classList.add("dark")
        lightIcon.classList.add("hidden")
        darkIcon.classList.remove("hidden")
    }
}
setTheme()
function changeToDark () {
    classTheme.classList.add("dark")
    localStorage.setItem("theme", "dark")
    lightIcon.classList.add("hidden")
    darkIcon.classList.remove("hidden")
}
function changeToLight () {
    classTheme.classList.remove("dark")
    localStorage.setItem("theme", "light")
    darkIcon.classList.add("hidden")
    lightIcon.classList.remove("hidden")
}
lightIcon.addEventListener("click",changeToDark)
darkIcon.addEventListener("click",changeToLight)
function autoLogin () {
    let getAccessToken = localStorage.getItem("token")
    const getMeQuery = `
    query GetMe {
        getMe {
        name  
        }
    }`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAccessToken}`
        },
        body: JSON.stringify({
            query: getMeQuery,
        }),
    })
    .then((response) => response.json())
    .then((info) => {
        if (info.data === null) {
            refreshTokenFunc()
            autoLogin()
        }else {
            nameUser.innerHTML = info.data.getMe.name
        }
    })
}
function refreshTokenFunc () {
    let getRefreshToken = localStorage.getItem("refresh-token")
    const refreshTokenQuery = `
    query RefreshToken {
        refreshToken {
            token  
        }
    }`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getRefreshToken}`
        },
        body: JSON.stringify({
            query: refreshTokenQuery,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.data === null) {
            profileMenu.classList.add("hidden")
            loginBtn.classList.remove("hidden")
            signupBtn.classList.remove("hidden")
        }else {
            let newToken = data.data.refreshToken.token
            localStorage.setItem("token", newToken)
        }
    })
}
function logOut () {
    let getAccessToken = localStorage.getItem("token")
    const logOutQuery = `
    mutation LogOut {
        logOut {
            error,
            message,
            success  
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAccessToken}`
        },
        body: JSON.stringify({
            query: logOutQuery,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.data.logOut.error === true) {
            refreshTokenFunc()
            logOutBtn.click()
        }else {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh-token")
            swal({
                title: "از حساب خود خارج شدید.",
                text: "عملیات موفقیت آمیز",
                icon: "success",
                button: "باشه",
            });
            setTimeout(() => {
                location.reload()
            }, 1500);
        }
    })
}
logOutBtn.addEventListener("click", logOut)
window.addEventListener("load",autoLogin)