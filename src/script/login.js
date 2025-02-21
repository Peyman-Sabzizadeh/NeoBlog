let $ = document
const url = "http://localhost:5005/blog"
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
  }`;
  fetch(url, {
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
    uuidValue = info.data.generateCaptcha.uuid
    loginBtn.addEventListener("click",(event) => {
      event.preventDefault()
      loginMutation(uuidValue)
    })
  })
  .catch((error) => console.error("Error:", error));
}
window.addEventListener("load",captchaGenerator)
function register (event) {
    event.preventDefault()
    const registerMutation = `
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
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: registerMutation,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
    } else {
      tokenAddress = data.data.register.accessToken
      refreshTokenAddress = data.data.register.refreshToken
      localStorageHandler(tokenAddress,refreshTokenAddress)
      window.location.href = "../../index.html"
    }
  })
  .catch((error) => {
    console.error("Network Error:", error);
  });
}
signupBtn.addEventListener("click",register)
async function loginMutation (uuid) {
  let userToken = localStorage.getItem("token")
  const loginMutation = `
  mutation {
    login(
      phone: "${phoneInput.value}",
      captcha: "${cpatchaInput.value}",
      uuid: "${uuid}"
  ){
    message  
    }
  }`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${userToken}`
    },
    body: JSON.stringify({
      query: loginMutation,
    }),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  const verifyOtp = `
  mutation {
    verifyOtp(
      phone: "${phoneInput.value}",
      code: "12345"
  ){
    accessToken,
    refreshToken 
    }
  }`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${userToken}`
    },
    body: JSON.stringify({
      query: verifyOtp,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    tokenAddress = data.data.verifyOtp.accessToken
    refreshTokenAddress = data.data.verifyOtp.refreshToken
    localStorageHandler(tokenAddress,refreshTokenAddress)
    swal({
      title: "با موفقیت وارد شدید.",
      text: "عملیات موفقیت آمیز",
      icon: "success",
      button: "باشه",
  });
    setTimeout(() => {
      window.location.href = "../../index.html"
    }, 1500);
  })
}
function localStorageHandler (access,refresh) {
  localStorage.setItem("token", access)
  localStorage.setItem("refresh-token", refresh)
}