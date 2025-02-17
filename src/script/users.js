const usersContainer = $.querySelector("#users-container")
function getAllUsers () {
    let getAdminToken = localStorage.getItem("token")
    const getAllUsersMutation = `
    query {
        users(
            page: 1,
            limit: 25
        ){
            id,
            name,
            phone,
            username,
            role
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAdminToken}`,
        },
        body: JSON.stringify({
            query: getAllUsersMutation,
        }),
    })
    .then((res) => res.json())
    .then((info) => addUsersToDom(info.data.users))
}
getAllUsers()
function addUsersToDom (users) {
    users.forEach(function (user) {
        console.log(user)
    })
}