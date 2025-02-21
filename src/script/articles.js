const articlesContainer = $.querySelector("#articles-container")
function getArticles () {
    let getToken = localStorage.getItem("token")
    const articlesQuery = `
    query {
        findAllArticle(
            page: 1,
            limit: 25
        ){
            title,
            created_at,
            id
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
    .then((info) => addToDom(info.data.findAllArticle))
}
getArticles()
function addToDom (data) {
    data.forEach(function (article) {
        let getNewToken = localStorage.getItem("token")
        const likeAndSaveQuery = `
        query {
            getAllLikes(articleId: ${article.id}) {
                user {
                    name
            }  
            }
            getArticleBookMarkCount(
                 articleId: ${article.id}
            ){
                count
            }
        }`
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${getNewToken}`,
            },
            body: JSON.stringify({
                query: likeAndSaveQuery
            })
        })
        .then((likes) => likes.json())
        .then((count) => {
            const likesCount = count?.data?.getAllLikes?.length || 0;
            const savesCount = count?.data?.getArticleBookMarkCount?.count || 0
            articlesContainer.insertAdjacentHTML("beforeend", `
                <div class="flex items-center justify-between gap-x-[8rem] bg-gray-400 rounded-lg p-2">
                    <div>
                        <h2>${article.title}</h2>
                    </div>
                    <div class="flex items-center justify-center gap-x-4">
                        <span class="flex items-center justify-center">
                            <h3 class="text-sm">${likesCount}</h3>
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="" class="size-6 fill-rose-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </span>
                        <span class="flex items-center justify-center">
                            <h3 class="text-sm">${savesCount}</h3>
                            <svg fill="#0a0e17" viewBox="0 0 24 24" stroke-width="1.5" stroke="" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </span>
                        <span class="text-sm">${article.created_at}</span>
                        <a id="edit-btn" class="cursor-pointer" data-id="${article.id}">
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </a>
                        <span class="delete-btn cursor-pointer" data-article-id="${article.id}">
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#e11d48" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </span>
                    </div>
                </div>
            `)
        })
    })
    articlesContainer.addEventListener("click", function (event) {
        const link = event.target.closest("#edit-btn");
        if (link) {
            const articleId = link.getAttribute("data-id");
            localStorage.setItem("article-id", articleId)
            window.location.href = "./create-article.html"
        }
    });
    articlesContainer.addEventListener("click", function (event) {
        const link = event.target.closest(".delete-btn");
        if (link) {
            const articleId = link.getAttribute("data-article-id");
            let getAccessToken = localStorage.getItem("token")
            const removeArticleMutation = `
            mutation {
                removeArticle(
                    id: ${articleId}
                ){
                    message
                }
            }`
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${getAccessToken}`,
                },
                body: JSON.stringify({
                    query: removeArticleMutation,
                }),
            })
            .then((res) => res.json())
            .then((info) => {
                swal({
                    title: "مقاله حذف شد.",
                    text: "عملیات موفقیت آمیز",
                    icon: "success",
                    button: "باشه",
                });
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            })
        }
    });
}