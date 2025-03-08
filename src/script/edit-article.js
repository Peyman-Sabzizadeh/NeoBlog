const titleElem = $.querySelector("#title")
const contentElem = $.querySelector("#content")
const submitBtn = $.querySelector("#submit-btn")
function getArticleInfo () {
  let getAccessToken = localStorage.getItem("token")
  let getArticleID = localStorage.getItem("article-id")
  const getArInfoQuery = `
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
        query: getArInfoQuery,
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    titleElem.value = data.data.findArticleByID.title
    contentElem.value = data.data.findArticleByID.content
  })
}
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
      localStorage.removeItem("article-id")
  }
})
function editArticle() {
  let getUserToken = localStorage.getItem("token")
  let getArticleId = localStorage.getItem("article-id")
  const editArticleMutation = `
  mutation {
    updateArticle(
      articleID: ${getArticleId},
      title: "${titleElem.value}",
      content: "${contentElem.value}"
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
        query: editArticleMutation,
    }),
  })
  .then((info) => info.json())
  .then((data) => {
    if (data.data.updateArticle.success) {
      localStorage.removeItem("article-id")
      window.location.href = "my-articles.html"
    }
  })
}
submitBtn.addEventListener("click", editArticle)
window.addEventListener("load", getArticleInfo)