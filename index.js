let $ = document
const profileMenu = $.querySelector("#profile-menu")
const menuButton = $.querySelector("#menu-btn")
const nameUser = $.querySelector("#name-user")
const menuDropdown = $.querySelector("#menu-drop-down")
const arrowDownIcon = $.querySelector("#arrow-down-icon")
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
    fetch("http://localhost:5005/blog", {
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
    fetch("http://localhost:5005/blog", {
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
            autoLogin()
        }
    })
}
window.addEventListener("load",autoLogin)