let $ = document
const nameInput = $.querySelector("#name-input")
const phoneInput = $.querySelector("#phone-input")
const usernameInput = $.querySelector("#username-input")
const passwordInput = $.querySelector("#password-input")
const cpatchaInput = $.querySelector("#captcha-input")
const captchaImg = $.querySelector("#captcha-img")
const loginBtn = $.querySelector("#login-btn")
const signupBtn = $.querySelector("#signup-btn")
function captchaGenerator () {
  const captchaQuery = `
  query {
    generateCaptcha {
      captcha
      uuid
    }
  }
  `;
  fetch("http://localhost:5005/blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: captchaQuery
    }),
  })
  .then((response) => response.json())
  .then((info) => {
    captchaImg.innerHTML = info.data.generateCaptcha.captcha
    console.log(info.data.generateCaptcha.uuid)
  })
  .catch((error) => console.error("Error:", error));
}
window.addEventListener("load",captchaGenerator)
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
      refreshToken
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
      tokenAddress = data.data.register.refreshToken
      localStorage.setItem("token", tokenAddress)
      window.location.href = "../../index.html"
    }
  })
  .catch((error) => {
    console.error("Network Error:", error);
  });
}
signupBtn.addEventListener("click",register)