const $ = document
const nameInput = $.querySelector("#name-input")
const phoneInput = $.querySelector("#phone-input")
const usernameInput = $.querySelector("#username-input")
const passwordInput = $.querySelector("#password-input")
const loginBtn = $.querySelector("#login-btn")
const signupBtn = $.querySelector("#signup-btn")
function register (event) {
    event.preventDefault()
    const mutation = `
    mutation {
        register(
            name: "${nameInput.value}",
            phone: "${phoneInput.value}",
            username:"${usernameInput.value}",
            password: "${passwordInput.value}",
		    role: USER
    ){
    accessToken,
		user{
      name
    }
  }
}`;
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
      window.location.href = "../../index.html"
    }
  })
  .catch((error) => {
    console.error("Network Error:", error);
  });
}
signupBtn.addEventListener("click",register)