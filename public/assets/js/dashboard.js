const resMsg = document.querySelector("#login-response");

const errModal = document.querySelector(".admin-login-modal");
const errModalCloseBtn = document.querySelector(
  ".admin-login-modal .modal-close-btn"
);

const showPromptBtns = document.querySelectorAll(".show-login-prompt-btn");
const adminLoginForm = document.querySelector("#admin-login-form");
const adminLoginResponse = document.querySelector("[data-login-response]");

const schemeList = document.querySelector("#scheme-list");
const dynamicSchemeCount = document.querySelector("#dyn-scheme-list-title");

const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";

const showPrompt = () => {
  // show prompt
  errModal.classList.add("open");
  // bind close event
  errModalCloseBtn.addEventListener("click", (e) => {
    errModal.classList.remove("open");
  });
};

const fetchCipherData__API = async (method, url, body) => {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        apiKey: API_KEY,
      },
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};
showPromptBtns.forEach((btn) => {
  btn.addEventListener("click", showPrompt);
})

adminLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const adminSecretInp = e.target.querySelector('[name="admin-secret-inp"]').value;
  const data = await fetchCipherData__API("POST", "/api/v1/cipher/adminLogin", {adminSecret:adminSecretInp});
  console.log(data);
  if(data.error) {
    adminLoginResponse.classList.add("error");
    adminLoginResponse.innerHTML = data.msg;
  } else {
    adminLoginResponse.innerHTML = '';
    // clear form
    e.target.reset();
    showDashboard();
    errModal.classList.remove("open");
  }
});

const showDashboard = async () => {
  const schemes = await getSchemes();
  console.log(schemes);
  if(schemes.error) {
    // showPrompt();
    resMsg.classList.add("show");
    resMsg.innerHTML = `${schemes.error} <br> <small class='error'>To get access to the dashboard, please login</small>`; 
    return;
  }
  resMsg.classList.remove("show");
  const allSchemes = schemes.scheme;
  const schemesCount = schemes.schemes_count;
  dynamicSchemeCount.innerText = `Total Schemes Added - ${schemesCount}`;
  allSchemes.forEach((scheme) => {
    const schemeLi = document.createElement("li");
    schemeLi.classList.add('scheme-list-item');
    schemeLi.innerHTML = `
    <div class="scheme-title">
      <span class="alias">${scheme.alias}</span>
      <span class="name">${scheme.name}</span>
    </div>
    `;
    schemeList.appendChild(schemeLi);
  });

}

const getSchemes = async () => {
  try {
    const data = await fetchCipherData__API("GET", "/api/v1/scheme/view");
    return data;
  } catch (error) {
    return error.message;
  }
};

window.onload = showDashboard();