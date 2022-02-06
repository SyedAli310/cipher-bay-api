const resMsg = document.querySelector('[data-admin-response]');

const errModal = document.querySelector('.error-modal');
const errModalCloseBtn = document.querySelector('.error-modal .modal-close-btn');

const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";

const showPrompt = () => {
    // show prompt
    errModal.classList.add('open');
    // bind close event
    errModalCloseBtn.addEventListener("click", (e) => {
        errModal.classList.remove('open');
    });
};

const fetchCipherData__API = async (method, url, body, adminSecret) => {
    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "apiKey" : API_KEY,
          "adminSecret" : adminSecret,
        },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return error.message;
    }
  };
document.getElementById('show-prompt-btn').addEventListener('click', showPrompt);
window.onload = async () => {
    showPrompt();
    document.getElementById('admin-token-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const adminSecret = document.getElementById('admin-secret').value;
        const data = await fetchCipherData__API('GET', '/api/v1/scheme/view', null, adminSecret);
        console.log(data);
        errModal.classList.remove('open');
        if(data.error) {
            resMsg.innerHTML = data.msg;
            resMsg.classList.add('error');
            return;
        }
        resMsg.innerHTML = '';
        resMsg.classList.remove('error');
        resMsg.classList.add('success');
        data.scheme.forEach(scheme => {
            resMsg.innerHTML += `<p>${scheme.alias}</p>`;
        });
    });
}