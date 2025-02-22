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
        // Get article info
        tagsInput.classList.add("hidden")
        let getAccessToken = localStorage.getItem("token")
        const getArticleInfoQuery = `
        query {
            findArticleByID(
                articleID: ${getArticleID}
            ){
                title,
                content
            }
        }`
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${getAccessToken}`
            },
            body: JSON.stringify({
                query: getArticleInfoQuery,
            }),
        })
        .then((res) => res.json())
        .then((info) => {
            let articleInfo = info.data.findArticleByID
            titleInput.value = articleInfo.title
            contentInput.value = articleInfo.content
        })
        // Update article
        submitBtn.addEventListener("click", function () {
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
                localStorage.removeItem("article-id")
                window.location.href = "./articles.html"
            })
        })
    }
}
updateArticle()
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        localStorage.removeItem("article-id")
    }
})