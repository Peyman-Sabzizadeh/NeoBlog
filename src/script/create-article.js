function createArticle () {
    let getToken = localStorage.getItem("token")
    const articleMutation = `
    mutation {
        createArticle(
            input: {
                title: "hello world",
                content: "this is a test content for an article"
            }, 
            cover: "Logo.svg"){
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
// createArticle()