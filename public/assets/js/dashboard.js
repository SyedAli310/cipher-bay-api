const resMsg = document.querySelector("#login-response");

const schemeList = document.querySelector("#scheme-list");
const dynamicSchemeCount = document.querySelector("#dyn-scheme-list-title");
const dashHeaderBtnWrap = document.querySelector("#dash-btn-wrapper");
const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";


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


const getSchemes = async () => {
  try {
    const data = await fetchCipherData__API("GET", "/api/v1/scheme/view");
    return data;
  } catch (error) {
    return error.message;
  }
};

const showDashboard = async () => {
  const schemes = await getSchemes();
  console.log(schemes);
  if(schemes.error) {
    // showPrompt();
    dashHeaderBtnWrap.innerHTML = ` <a class="btn login-btn a-reset" href="/login">Login</a>`;
    resMsg.classList.add("show");
    resMsg.innerHTML = `${schemes.error} <br> <small class='error'>To get access to the dashboard, please login</small>`; 
    return;
  }
  resMsg.classList.remove("show");
  dashHeaderBtnWrap.innerHTML = ` <a class="btn logout-btn a-reset" href="/logout">Logout</a>`;
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


window.onload = showDashboard();