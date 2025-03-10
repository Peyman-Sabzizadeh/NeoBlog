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
const articlesContainer = $.querySelector("#articles-container")
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
            location.reload()
        }
    })
}
function loadArticles () {
    const getAllArticlesQuery = `
    query {
        findAllArticle(
            page: 1, 
            limit: 8
        ){
        title,
        content,
        id
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: getAllArticlesQuery,
        }),
    })
    .then((res) => res.json())
    .then((data) => addArticlesToDom(data.data.findAllArticle))
}
function addArticlesToDom (articles) {
    articles.reverse().forEach(function (ar) {
        checkArticleLike(ar.id)
        checkSaveLike(ar.id)
        articlesContainer.insertAdjacentHTML("beforeend", `
        <article class="flex flex-col p-8 bg-black/50 rounded-lg">
            <div>
                <h3 class="text-xl font-VazirMedium line-clamp-1">${ar.title}</h3>
            </div>
            <div class="flex items-center justify-center gap-x-4">
                <div>
                    <p class="max-w-96 line-clamp-3 text-balance">${ar.content}</p>
                </div>
                <div class="flex flex-col items-center justify-center gap-y-4">
                    <div class="flex gap-x-4">
                        <svg id="s${ar.id}" onclick="addLike(${ar.id})" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 cursor-pointer hover:fill-rose-500 hover:stroke-none">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <svg id="r${ar.id}" onclick="addSave(${ar.id})" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#171717" class="size-7 cursor-pointer hover:fill-neutral-900 dark:stroke-white dark:hover:fill-slate-50">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                         </svg>
                    </div>
                </div>
            </div>
        </article>
        `)
    })
}
function addLike (articleID) {
    console.log(articleID)
    let getLikeElem = $.querySelector(`#s${articleID}`)
    if (getLikeElem.classList.contains("fill-rose-500")) {
        let getAccessToken = localStorage.getItem("token")
        const disLikeMutation = `
        mutation {
            disLike(
                articleId: ${articleID}
            ){
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
                query: disLikeMutation,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.data.disLike.success === true) {
                let articleLikeElem = $.querySelector(`#s${articleID}`)
                articleLikeElem.classList.remove("fill-rose-500")
                articleLikeElem.classList.remove("stroke-none")
                alert("مقاله مورد نظر دیسلایک شد")
            }
        })
    }else {
        let getUserToken = localStorage.getItem("token")
        const addLikeMutation = `
        mutation {
            addLike(
                articleId: ${articleID}
            ){
            message,
            success
            }
        }`
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${getUserToken}`
            },
            body: JSON.stringify({
                query: addLikeMutation,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.data.addLike.success === true) {
                alert("مقاله مورد نظر لایک شد")
                let articleIDLike = $.querySelector(`#s${articleID}`)
                articleIDLike.classList.add("fill-rose-500")
                articleIDLike.classList.add("stroke-none")
            }
        })
    }
}
function checkArticleLike (arID) {
    let getAccessToken = localStorage.getItem("token")
    const getAllLikesQuery = `
    query {
        getAllLikes(
            articleId: ${arID}
        ){
            user {
                id
            }  
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAccessToken}`
        },
        body: JSON.stringify({
            query: getAllLikesQuery,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.data.getAllLikes) {
            let getLikeElem = $.querySelector(`#s${arID}`)
            getLikeElem.classList.add("fill-rose-500")
            getLikeElem.classList.add("stroke-none")
        }
    })
}
// ----------------------------------------------------------
function addSave (articleID) {
    console.log(articleID)
    let getSaveElem = $.querySelector(`#r${articleID}`)
    if (getSaveElem.classList.contains("fill-gray-900") || getSaveElem.classList.contains("fill-slate-50")) {
        let getAccessToken = localStorage.getItem("token")
        const disSaveMutation = `
        mutation {
            removeBookMark(
                articleId: ${articleID}
            ){
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
                query: disSaveMutation,
            }),
        })
        .then((info) => info.json())
        .then((data) => {
            if (data.data.removeBookMark.success === true) {
                let articleLikeElem = $.querySelector(`#r${articleID}`)
                if (document.documentElement.classList.contains("dark")) {
                    articleLikeElem.classList.remove("fill-slate-50")
                }else {
                    articleLikeElem.classList.remove("fill-gray-900")
                }
                alert("مقاله مورد نظر دیس سیو شد")
            }
        })
    }else {
        let getUserToken = localStorage.getItem("token")
        const addSaveMutation = `
        mutation {
            addBookMark(
                articleId: ${articleID}
            ){
                success  
            }
        }`
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${getUserToken}`
            },
            body: JSON.stringify({
                query: addSaveMutation,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.data.addBookMark.success === true) {
                alert("مقاله مورد نظر سیو شد")
                let articleIDSave = $.querySelector(`#r${articleID}`)
                if (document.documentElement.classList.contains("dark")) {
                    articleIDSave.classList.add("fill-slate-50")
                }else {
                    articleIDSave.classList.add("fill-gray-900")
                }
            }
        })
    }
}
function checkSaveLike (arID) {
    let getAccessToken = localStorage.getItem("token")
    const getSaveQuery = `
    query {
        getAllBookMarks {
            article {
                id
            }
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAccessToken}`
        },
        body: JSON.stringify({
            query: getSaveQuery,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        let getSaveElem = $.querySelector(`#r${arID}`)
        data.data.getAllBookMarks.forEach(function (e) {
            if (e.article.id === arID) {
                if (document.documentElement.classList.contains("dark")) {
                    getSaveElem.classList.add("fill-slate-50")
                }else {
                    getSaveElem.classList.add("fill-gray-900")
                }
            }
        })
    })
}
// ----------------------------------------------------------
logOutBtn.addEventListener("click", logOut)
window.addEventListener("load",autoLogin)
window.addEventListener("load", loadArticles)