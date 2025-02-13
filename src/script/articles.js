function getArticles () {
    let getToken = localStorage.getItem("token")
    const articlesQuery = `
    query {
        findAllArticle(
            page: 1,
            limit: 25
        ){
            title,
            created_at
        }
    }`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${getToken}`,
        },
        body: JSON.stringify({
            query: articlesQuery
        })
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
}