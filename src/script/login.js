const $ = document
const usernameInput = $.querySelector("#username-input")
const passwordInput = $.querySelector("#password-input")
const loginBtn = $.querySelector("#login-btn")
const signupBtn = $.querySelector("#signup-btn")
function register (event) {
    event.preventDefault()
    const mutation = `
    mutation {
        register(
            name: "user",
            username:"${usernameInput.value}",
            password: "${passwordInput.value}",
            phone: "09933333333",
		    role: USER
    ){
    accessToken,
		user{
      name
    }
  }
}`;
console.log(mutation)
fetch("http://localhost:5005/blog", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: mutation,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
    } else {
      console.log("User Added:", usernameInput.value);
    }
  })
  .catch((error) => {
    console.error("Network Error:", error);
  });
}
signupBtn.addEventListener("click",register)