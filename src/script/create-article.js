const titleInput = $.querySelector("#title")
const contentInput = $.querySelector("#content")
const tagsInput = $.querySelector("#tags")
const submitBtn = $.querySelector("#submit-btn")
function adjustHeight(element) {
    element.style.height = "auto"; 
    element.style.height = element.scrollHeight + "px"; 
    if (element.scrollHeight > 300) {
      element.style.overflowY = "auto";
    } else {
      element.style.overflowY = "hidden";
    }
}
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
function updateArticle () {
    let getArticleID = localStorage.getItem("article-id")
    if (getArticleID) {
        submitBtn.addEventListener("click", function () {
            console.log("Article ID is exit..")
            let getUserToken = localStorage.getItem("token")
            const updateArticleMutation = `
            mutation {
                updateArticle(
                    articleID: ${getArticleID},
                    title: "${titleInput.value}",
                    content: "${contentInput.value}"
                ){
                    message  
                }
            }`
            console.log(url)
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${getUserToken}`
                },
                body: JSON.stringify({
                    query: updateArticleMutation,
                }),
            })
            .then((res) => res.json())
            .then((info) => {
                console.log(info)
                localStorage.removeItem("article-id")
            })
        })
    }
}
updateArticle()