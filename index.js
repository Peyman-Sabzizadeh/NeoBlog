let $ = document
const lightIcon = $.querySelector("#light-icon")
const darkIcon = $.querySelector("#dark-icon")
let classTheme = document.documentElement
let getTheme = localStorage.getItem("theme")
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