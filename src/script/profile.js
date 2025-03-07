const nameInfo = $.querySelector("#name")
const usernameInfo = $.querySelector("#username")
const phoneInfo = $.querySelector("#phone")
const roleInfo = $.querySelector("#role")
const editInfoBtn = $.querySelector("#edit-info-btn")
function getInfo () {
    let getAccessToken = localStorage.getItem("token")
    const getMyInfo = `
    query GetMe {
        getMe {
            name,
            username,
            phone,
            role
        }
    }`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAccessToken}`
        },
        body: JSON.stringify({
            query: getMyInfo,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        function convertToPersian (roleName) {
            if (roleName === "USER") {
                return "کاربر"
            }else {
                return "مدیر"
            }
        }
        nameInfo.value = data.data.getMe.name
        usernameInfo.value = data.data.getMe.username
        phoneInfo.innerHTML += data.data.getMe.phone
        roleInfo.innerHTML += convertToPersian(data.data.getMe.role)
    })
}
function editInfo () {
    let getUserToken = localStorage.getItem("token")
    const updateInfoMutation = `
    mutation {
        editProfile(
            name: "${nameInfo.value}",
            username: "${usernameInfo.value}"
        ){
            message
        }
    }`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getUserToken}`
        },
        body: JSON.stringify({
            query: updateInfoMutation,
        }),
    })
    .then((info) => info.json())
    .then((data) => window.location.reload())
}
editInfoBtn.addEventListener("click", editInfo)
window.addEventListener("load", getInfo)