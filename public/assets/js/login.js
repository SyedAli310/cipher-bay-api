const adminLoginForm = document.querySelector("#admin-login-form");
const adminLoginResponse = document.querySelector("[data-login-response]");

// const fetchCipherData__API = async (method, url, body) => {
//   try {
//     const res = await fetch(url, {
//       method: method,
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         apiKey: API_KEY,
//       },
//       body: body ? JSON.stringify(body) : null,
//     });
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     return error.message;
//   }
// };

adminLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const adminSecretInp = e.target.querySelector(
    '[name="admin-secret-inp"]'
  ).value;
  const data = await fetchCipherData__API("POST", "/api/v1/cipher/adminLogin", {
    adminSecret: adminSecretInp,
  });
  // console.log(data);
  if (data.error) {
    adminLoginResponse.classList.add("error");
    adminLoginResponse.innerHTML = data.msg;
  } else {
    adminLoginResponse.innerHTML = "";
    // clear form
    e.target.reset();
    // redirect to dashboard
    window.location.href = `/panel/dash?msg=${data.msg}`;
  }
});
