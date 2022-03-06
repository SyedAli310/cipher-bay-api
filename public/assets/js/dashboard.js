const resMsg = document.querySelector("#login-response");

const schemeList = document.querySelector("#scheme-list");
const dynamicSchemeTitle = document.querySelector("#dyn-scheme-list-title");
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

// make a function to expand all schemes
const toggleAllSchemes = (action) => {
  const schemeListItems = schemeList.querySelectorAll(".scheme-list-item");
  const allToggleBtns = document.querySelectorAll("[data-scheme-toggle]");
  allToggleBtns.forEach((btn) => {
    if(action === "open") {
      btn.classList.add("open");
    }
    else if(action === "close") {
      btn.classList.remove("open");
    }
  })
  schemeListItems.forEach((item) => {
    if(action === "open") {
      item.classList.add("expanded");
    }
    else if(action === "close") {
      item.classList.remove("expanded");
    }
  });
}

const schemeToggleBinder = () => {
  const allToggleBtns = document.querySelectorAll("[data-scheme-toggle]");
  allToggleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const schemeLi = e.target.parentElement.parentElement.parentElement;
      e.target.classList.toggle("open");
      schemeLi.classList.toggle("expanded");
    })
  })
}

const makeObjUI = (obj, title) => {
  const UI = document.createElement("div");
  UI.classList.add("scheme-obj-ui");
  const objTitle = document.createElement("h4");
  objTitle.classList.add("obj-title");
  objTitle.innerHTML = title;

  const objUI = document.createElement("div");
  objUI.classList.add("obj-body");
  Object.entries(obj).forEach(([key, value]) => {
    if(key.trim() === "") {
      return;
    }
    const objUIItem = document.createElement("div");
    objUIItem.classList.add("obj-item");
    objUIItem.innerHTML = `
      <span>${key}</span>
      <span>&harr;</span>
      <span>${value}</span>
    `;
    objUI.appendChild(objUIItem);
  })
  UI.appendChild(objTitle);
  UI.appendChild(objUI);
  return UI;
}

const showDashboard = async () => {
  schemeList.innerHTML = "<span style='color:var(--MAIN__ACCENT__COLOR);'>loading...</span>";
  const schemes = await getSchemes();
  console.log(schemes);
  if(schemes.error) {
    dashHeaderBtnWrap.innerHTML = ` <a class="btn login-btn a-reset" href="/login">Login</a>`;
    resMsg.classList.add("show");
    resMsg.innerHTML = `${schemes.error} <br> <small class='error'>To get access to the dashboard, please login</small>`; 
    return;
  }
  schemeList.innerHTML = "";
  resMsg.classList.remove("show");
  dashHeaderBtnWrap.innerHTML = ` <a class="btn logout-btn a-reset" href="/logout">Logout</a>`;
  const allSchemes = schemes.scheme;
  const schemesCount = schemes.schemes_count;
  dynamicSchemeTitle.innerHTML = `
  <div>Schemes added-${schemesCount} </div>
  <div class='scheme-cta-btns'>
    <button class='btn btn-sm' id='refresh-schemes' title='refresh schemes'>&#x21bb;</button>
    <button class='btn btn-sm' id='expand-all' title='expand all'>expand &#9660;</button>
    <button class='btn btn-sm' id='close-all' title='close all'>shrink  &#9650;</button>
  </div>
  `;
  document.querySelector("#refresh-schemes").addEventListener("click", () => {showDashboard()});
  document.querySelector("#expand-all").addEventListener("click", () => {toggleAllSchemes('open')});
  document.querySelector("#close-all").addEventListener("click", () => {toggleAllSchemes('close')});
  allSchemes.forEach((scheme) => {
    const schemeLi = document.createElement("li");
    schemeLi.classList.add('scheme-list-item');
    schemeLi.innerHTML = `
    <div class="scheme-title">
      <span class="alias">${scheme.alias}</span>
      <span class="name">${scheme.name} &nbsp; <button class='btn btn-md scheme-toggle-btn' data-scheme-toggle><span>&#9660;</span></button></span>
    </div>
    `;
    const schemeBody = document.createElement("div");
    schemeBody.classList.add("scheme-body");
    const schemeBodyHeader = document.createElement("div");
    schemeBodyHeader.classList.add("scheme-body-header");
    schemeBodyHeader.innerHTML = `
    <small>🕑 Added: ${new Date(scheme.createdAt).toDateString().slice(3)}</small>
    <div class='scheme-body-btns'>
      <button class='btn btn-sm' id='delete-scheme' title='delete scheme'><img src="/assets/img/icons/trash-outline.svg" alt="del" /></button>
      <button class='btn btn-sm' id='download-scheme' title='download scheme'><img src="/assets/img/icons/cloud-download-outline.svg" alt="save" /></button>
    </div>
    `;
    schemeBody.appendChild(schemeBodyHeader);
    schemeBody.appendChild(makeObjUI(scheme.encode, `cipher key🔹${scheme.alias}`));
    schemeLi.appendChild(schemeBody);
    schemeList.appendChild(schemeLi);
  });

  schemeToggleBinder();
}

window.onload = showDashboard();