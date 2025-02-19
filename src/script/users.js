const usersContainer = $.querySelector("#users-container")
const tableBody = $.querySelector("#table-body")
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
    function convertToPersian (roleName) {
        if (roleName === "USER") {
            return "کاربر"
        }else {
            return "مدیر"
        }
    }
    users.reverse().forEach(function (user) {
        tableBody.insertAdjacentHTML("beforeend", `
        <tr class="hover:bg-gray-100 transition child:py-3 child:px-4 child:text-right">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${user.username}</td>
            <td>${convertToPersian(user.role)}</td>
            <td id="delete-user" class="cursor-pointer" data-user-id="${user.id}">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#e11d48" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </td>
        </tr>
        `)
    })
    tableBody.addEventListener("click", function (event) {
        const removeBtn = event.target.closest("#delete-user");
        if (removeBtn) {
            const userID = removeBtn.getAttribute("data-user-id");
            let getAccessToken = localStorage.getItem("token")
            const removeUserMutation = `
            mutation {
                removeUser(
                    userID: ${userID}
                ){
                    name
                }
            }`
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${getAccessToken}`,
                },
                body: JSON.stringify({
                    query: removeUserMutation,
                }),
            })
            .then((res) => res.json())
            .then((info) => {
                alert("کاربر حذف شد")
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            })
        }
    });
}