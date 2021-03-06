// const BASE_URL = 'https://cipher-bay.herokuapp.com/api/v1/cipher/';
// const BASE_URL = "http://localhost:5000/api/v1/cipher";
const BASE_URL = "/api/v1/cipher";
const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";

const spinner = (text) => {
  return `<div id='spinner'>
                <span>${text ? text : "Loading"}</span>
                <div></div>
                <div></div>
                <div></div>
            </div>`;
};

// document.querySelector("body").innerHTML = spinner("loading");

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

function copyToClipboard(value, el) {
  let x = null;
  const copied = navigator.clipboard.writeText(value);
  if (x) {
    clearTimeout(x);
  }
  if (copied) {
    $(el).html(
      '<ion-icon name="checkmark-done" style="color:var(--SUCCESS__COLOR);"></ion-icon>'
    );
    $(el).append(
      '<span style="color:var(--SUCCESS__COLOR); font-size:small;">&nbsp;Copied&nbsp;</span>'
    );
  }
  x = setTimeout(() => {
    $(el).html('<ion-icon name="copy-outline"></ion-icon>');
    $(el).append("");
  }, 2000);
}

const alertCustom = (msg) => {
  // remove previous alert
  const alertPrev = document.querySelector(".alert");
  if (alertPrev) {
    alertPrev.remove();
  }
  // create new alert
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `
      <button class='btn btn-md alert-close-btn'>
         <span>&times;</span>
      </button>
      <div>${msg}</div>
    `;
  document.body.appendChild(alert);
  // close alert
  alert.querySelector(".alert-close-btn").addEventListener("click", () => {
    alert.remove();
  });
  let timeout = setTimeout(() => {
    alert.remove();
  }, 5000);
  // stop alert from disappearing on mouseover
  alert.addEventListener("mouseover", () => {
    // pause alert
    clearTimeout(timeout);
  });
  alert.addEventListener("mouseout", () => {
    // resume alert
    timeout = setTimeout(() => {
      alert.remove();
    }, 2000);
  });
};
