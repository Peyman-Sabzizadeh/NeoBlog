const titleInput = $.querySelector("#title")
const contentInput = $.querySelector("#content")
const tagsInput = $.querySelector("#tags")
const submitBtn = $.querySelector("#submit-btn")
function createArticle () {
    let tagsArray = tagsInput.value.split("،")
    let getToken = localStorage.getItem("token")
    const articleMutation = `
    mutation {
        createArticle(
            input: {
                title: "${titleInput.value}",
                content: "${contentInput.value}",
                tags: ${JSON.stringify(tagsArray)}
            }){
            title 
            }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getToken}`
        },
        body: JSON.stringify({
            query: articleMutation,
        }),
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
}
submitBtn.addEventListener("click", createArticle)