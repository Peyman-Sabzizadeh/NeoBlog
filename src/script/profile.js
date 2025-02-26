const nameInfo = $.querySelector("#name")
const usernameInfo = $.querySelector("#username")
const phoneInfo = $.querySelector("#phone")
const roleInfo = $.querySelector("#role")
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
        nameInfo.innerHTML += data.data.getMe.name
        usernameInfo.innerHTML += data.data.getMe.username
        phoneInfo.innerHTML += data.data.getMe.phone
        roleInfo.innerHTML += convertToPersian(data.data.getMe.role)
    })
}
window.addEventListener("load", getInfo)