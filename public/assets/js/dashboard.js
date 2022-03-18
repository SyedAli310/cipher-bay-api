const resMsg = document.querySelector("#login-response");

const schemeList = document.querySelector("#scheme-list");
const dynamicSchemeTitle = document.querySelector("#dyn-scheme-list-title");
const dashHeaderBtnWrap = document.querySelector("#dash-btn-wrapper");
const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";

const modalCloseBtns = document.querySelectorAll(".modal-close-btn");

const searchSchemeInp = document.querySelector("#search-scheme");

const addSchemeModal = document.querySelector(".add-scheme-modal");
const addSchemeForm = document.querySelector("#add-scheme-form");
const addSchemeResponse = document.querySelector("[data-add-response]");
const allAddSchemeFields = document.querySelectorAll(
  "#add-scheme-form .form-control"
);

const spinner = (text) => {
  return `<div id='spinner'>
                <span>${text ? text : "Loading"}</span>
                <div></div>
                <div></div>
                <div></div>
            </div>`;
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
    if (action === "open") {
      btn.classList.add("open");
    } else if (action === "close") {
      btn.classList.remove("open");
    }
  });
  schemeListItems.forEach((item) => {
    if (action === "open") {
      item.classList.add("expanded");
    } else if (action === "close") {
      item.classList.remove("expanded");
    }
  });
};

const schemeToggleBinder = () => {
  const allToggleBtns = document.querySelectorAll("[data-scheme-toggle]");
  allToggleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const schemeLi = e.target.parentElement.parentElement.parentElement;
      e.target.classList.toggle("open");
      schemeLi.classList.toggle("expanded");
    });
  });
};

const makeObjUI = (obj, title) => {
  const UI = document.createElement("div");
  UI.classList.add("scheme-obj-ui");
  const objTitle = document.createElement("h4");
  objTitle.classList.add("obj-title");
  objTitle.innerHTML = title;

  const objUI = document.createElement("div");
  objUI.classList.add("obj-body");
  Object.entries(obj).forEach(([key, value]) => {
    if (key.trim() === "") {
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
  });
  UI.appendChild(objTitle);
  UI.appendChild(objUI);
  return UI;
};

const validateAddSchemeFields = (allFields) => {
  allFields.forEach((field) => {
    if (field.value.trim() === "" || isNaN(Number(field.value))) {
      field.parentElement.classList.add("is-invalid");
      return;
    } else {
      field.parentElement.classList.remove("is-invalid");
    }
  });
};

modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const parentModal = btn.parentElement.parentElement;
    parentModal.classList.remove("open");
  });
});

addSchemeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const schemeAliasInp = document.querySelector("#scheme-alias").value;
  const schemeObjInp = {};
  const allSchemeInps = document.querySelectorAll(
    "#add-scheme-form .scheme-input"
  );
  allSchemeInps.forEach((inp) => {
    schemeObjInp[inp.dataset.letter] = inp.value;
  });
  const payload = {
    alias: schemeAliasInp,
    scheme: schemeObjInp,
  };
  console.log(payload); // [TODO] this payload will be sent to the server (API call)
  // make API call to add scheme
  try {
    addSchemeResponse.innerHTML = spinner("Adding scheme...");
    const res = await fetchCipherData__API(
      "POST",
      "/api/v1/scheme/add",
      payload
    );
    console.log(res);
    if (res.error) {
      addSchemeResponse.innerText = res.msg;
    } else {
      addSchemeResponse.classList.add("success");
      addSchemeResponse.innerText = res.msg;
      addSchemeForm.reset();
    }
  } catch (error) {
    addSchemeResponse.innerText = error.message;
  }
});

searchSchemeInp.addEventListener("input", (e) => {
  const searchVal = e.target.value;
  const schemeListItems = schemeList.querySelectorAll(".scheme-list-item");
  schemeListItems.forEach((item) => {
    const schemeTitle = item.querySelector(".scheme-title .alias");
    if (schemeTitle.innerHTML.toLowerCase().includes(searchVal.toLowerCase())) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});

const showDashboard = async () => {
  schemeList.innerHTML =
    "<span style='color:var(--MAIN__ACCENT__COLOR);'>loading...</span>";
  const schemes = await getSchemes();
  // console.log(schemes);
  if (schemes.error) {
    schemeList.innerHTML = "";
    dynamicSchemeTitle.innerHTML = "";
    dashHeaderBtnWrap.innerHTML = ` <a class="btn login-btn a-reset" href="/login">Login</a>`;
    resMsg.classList.add("show");
    resMsg.innerHTML = `${schemes.msg} <br> <small class='error'>To get access to the dashboard, please login</small>`;
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
    <button class='btn btn-sm' id='add-scheme' title='add scheme'><img class='icon add' src="/assets/img/icons/add-outline.svg" /></button>
    <button class='btn btn-sm' id='refresh-schemes' title='refresh schemes'><img class='icon' src="/assets/img/icons/refresh-outline.svg" /></button>
    <button class='btn btn-sm' id='expand-all' title='expand all'> <img class='icon' src="/assets/img/icons/caret-down-outline.svg" /></button>
    <button class='btn btn-sm' id='close-all' title='close all'> <img class='icon' src="/assets/img/icons/caret-up-outline.svg" /></button>
  </div>
  `;
  document.querySelector("#refresh-schemes").addEventListener("click", () => {
    showDashboard();
  });
  document.querySelector("#add-scheme").addEventListener("click", () => {
    addSchemeModal.classList.add("open");
  });
  document.querySelector("#expand-all").addEventListener("click", () => {
    toggleAllSchemes("open");
  });
  document.querySelector("#close-all").addEventListener("click", () => {
    toggleAllSchemes("close");
  });
  allSchemes.forEach((scheme) => {
    const schemeLi = document.createElement("li");
    schemeLi.classList.add("scheme-list-item");
    schemeLi.dataset.schemeAlias = scheme.alias;
    schemeLi.innerHTML = `
    <div class="scheme-title">
      <span class="alias">${scheme.alias}</span>
      <span class="name">${scheme.name} &nbsp; <button class='btn btn-md scheme-toggle-btn' data-scheme-toggle><img class='icon' src="/assets/img/icons/caret-down-outline.svg" /></button></span>
    </div>
    `;
    const schemeBody = document.createElement("div");
    schemeBody.classList.add("scheme-body");
    const schemeBodyHeader = document.createElement("div");
    schemeBodyHeader.classList.add("scheme-body-header");
    schemeBodyHeader.innerHTML = `
    <small>🕑 Added: ${new Date(scheme.createdAt)
      .toDateString()
      .slice(3)}</small>
    <div class='scheme-body-btns'>
      <button class='btn btn-sm' id='delete-scheme' title='delete scheme'><img class='icon' src="/assets/img/icons/trash-outline.svg" alt="del" /></button>
      <button class='btn btn-sm' id='download-scheme' title='download scheme'><img class='icon' src="/assets/img/icons/cloud-download-outline.svg" alt="save" /></button>
    </div>
    `;
    schemeBody.appendChild(schemeBodyHeader);
    schemeBody.appendChild(
      makeObjUI(scheme.encode, `cipher key🔹${scheme.alias}`)
    );
    schemeLi.appendChild(schemeBody);
    schemeList.appendChild(schemeLi);
  });

  schemeToggleBinder();
};

window.onload = showDashboard();
