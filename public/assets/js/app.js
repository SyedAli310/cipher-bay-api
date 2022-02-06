// const BASE_URL = 'https://cipher-bay.herokuapp.com/api/v1/cipher/';
// const BASE_URL = "http://localhost:5000/api/v1/cipher";
const BASE_URL  = '/api/v1/cipher';
const API_KEY = "nRwgKaP8GVzSybkzriiTCxRuQaRJ59kj";
let METHOD = "encode";
let SCHEME = localStorage.getItem('scheme') || "scheme_zevqnm-wavv";

let URL_GLOBAL;
let BODY = {};

let SCHEME_ALIAS_OBJ = [];

const print = (item) => {
  console.log(item);
};

const conversionSelectBtns = document.querySelectorAll(
  ".conversion-select-btn"
);
const output = document.querySelector("#output");

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
        "apiKey" : API_KEY
      },
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};

const schemeSelect__EventBinder = () => {
  const schemeSelectBtns = document.querySelectorAll(
    ".schemes-modal .scheme-select-btn"
  );
  $(".scheme-select-btn").on("click", (e) => {
    const scheme = $(e.target).attr("scheme");
    schemeSelectBtns.forEach((btn) => btn.classList.remove("selected"));
    e.target.classList.add("selected");
    localStorage.setItem("scheme", scheme);
    SCHEME = localStorage.getItem("scheme");
    $("#dyn-inp-div-scheme").text(` / ${e.target.innerText}`);
    $("#dyn-selected-scheme").text(`${e.target.innerText}`);
    print(`Scheme set to -> ${SCHEME_ALIAS_OBJ.find((scheme) => scheme.name === SCHEME).alias}`);
  });
};

const showErrorPrompt = (head, body) => {
  // fill dynamic content
  if(!head){ $(".error-modal .modal-header").css("display", "none"); }
  else{ 
    $(".error-modal .modal-header").css("display", "block");
    $(".error-modal #dyn-error-header").text(`${head}`);
  }
  $(".error-modal #dyn-error-body").text(`${body}`);
  // show prompt
  $(".error-modal").addClass("open");
  // bind close event
  $(".error-modal .modal-close-btn").on("click", (e) => {
    $(".error-modal").removeClass("open");
  });
};

const getSchemesFromAPI = async () => {
  const schemes = await fetchCipherData__API('GET',
    `${BASE_URL}/schemes`
  );
  //print(schemes);
  return schemes;
}

const fillSchemesToModal = async () => {
  const schemeSelectDiv = $(".schemes-modal #scheme-select-btns");
  schemeSelectDiv.html(spinner("Loading schemes"));
  const schemes = await getSchemesFromAPI();
  if (!schemes || schemes === "Failed to fetch") {
    $(".schemes-modal #scheme-select-btns").html(
      `Something went wrong, please try again<br><button onClick='fillSchemesToModal()'>refresh</button>`
    );
    return;
  }
  if (schemes.error) {
    $(".schemes-modal #scheme-select-btns").html(
      `${schemes.msg}, please try again<br><button onClick='fillSchemesToModal()'>refresh</button>`
    );
    return;
  }
  schemeSelectDiv.html("");
  const schemesList = schemes.schemes;
  //print(schemesList);
  SCHEME_ALIAS_OBJ = schemesList;
  schemesList.forEach((scheme) => {
    const schemeBtn = document.createElement("button");
    schemeBtn.classList.add("btn");
    schemeBtn.classList.add("scheme-select-btn");
    schemeBtn.setAttribute("scheme", scheme.name);
    schemeBtn.innerText = scheme.alias;
    schemeSelectDiv.append(schemeBtn);
  });
  // add selected class to default scheme
  const preSelectedScheme = [
    ...document.querySelectorAll("#scheme-select-btns .scheme-select-btn"),
  ].find((btn) => btn.getAttribute("scheme") === SCHEME);
  preSelectedScheme.classList.add("selected");
  $("#dyn-inp-div-scheme").text(` / ${preSelectedScheme.innerText}`);
  $("#dyn-selected-scheme").text(`${preSelectedScheme.innerText}`);
  schemeSelect__EventBinder();
};

window.onload = fillSchemesToModal();

const fillSuccessResponse = (scheme, inpHead, inpBody, outHead, outBody) => {
  $("#output").css("border", "1.5px solid var(--SUCCESS__COLOR)");
  $("#dyn-legend-scheme").text(` / ${scheme}`);
  $("#text-inp-head").text(`${inpHead}`);
  $("#text-inp-body").html(`
        ${inpBody}
        <button class='btn copy-btn' title='Copy ${inpHead}' onClick='copyToClipboard("${inpBody}",this)'><ion-icon name="copy-outline"></ion-icon></button>
    `);
  $("#text-out-head").text(`${outHead}`);
  $("#text-out-body").html(`
        ${outBody}
        <button class='btn copy-btn' title='Copy ${outHead}' onClick='copyToClipboard("${outBody}",this)'><ion-icon name="copy-outline"></ion-icon></button>
    `);
};

const fillErrorResponse = (error) => {
  $("#output").css("border", "1.5px solid var(--ERROR__COLOR)");
  $("#dyn-legend-scheme").html(`/ <span style='color:var(--ERROR__COLOR);'>ERROR</span>`);
  $("#text-out-head").html(`<span style='color:var(--ERROR__COLOR);'>Oops!</span>`);
  $("#text-out-body").html(`
        <p style='color:var(--ERROR__COLOR);'>${error[0].toUpperCase() + error.slice(1)}</p>
    `);
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

function skewAnimate(el) {
  $(el).css("animation", "flip-flop ease 500ms");
  setTimeout(() => {
    $(el).css("animation", "none");
  }, 500);
}

const toggleSchemeSelectDiv = (method) => {
  if (method === "encode") {
    document.querySelector(".schemes-modal-btn").classList.remove("blocked");
    $(".scheme-selection-div > .schemes-modal-btn").removeAttr("disabled");
    $(".scheme-selection-div > .schemes-modal-btn").removeAttr("tabindex");
  }
  if (method === "decode") {
    document.querySelector(".schemes-modal-btn").classList.add("blocked");
    $(".scheme-selection-div > .schemes-modal-btn").attr("disabled", "true");
    $(".scheme-selection-div > .schemes-modal-btn").attr("tabindex", "-1");
  }
};

$(".conversion-select-btn").on("click", (e) => {
  const conversion = $(e.target).attr("conversion");
  conversionSelectBtns.forEach((btn) => btn.classList.remove("selected"));
  e.target.classList.add("selected");
  skewAnimate("#main-form fieldset legend");
  METHOD = conversion;
  toggleSchemeSelectDiv(METHOD);
  $("#main-form").attr("conversion-method", METHOD);
  $("#main-form .input-div  #dyn-legend-method").text(
    `${METHOD.toUpperCase()}`
  );
  if (METHOD === "encode") {
    $("#main-form .input-div  #dyn-inp-div-scheme").text(
      ` / ${SCHEME_ALIAS_OBJ.find((scheme) => scheme.name === SCHEME).alias}`
    );
  }
  if (METHOD === "decode") {
    $("#main-form .input-div  #dyn-inp-div-scheme").text("");
  }
  $("#main-form .input-div  input").attr(
    "placeholder",
    `enter ${METHOD == 'encode' ? 'text' : METHOD == 'decode' ? 'code' : 'something' } to ${METHOD}`
  );
  $("#main-form .input-div  input").val("");
  print(`Method set to -> ${METHOD}`);
});

$("#main-form").on("submit", async (e) => {
  e.preventDefault();
  skewAnimate("#output legend");
  const text = $("#main-form").find('input[name="input-text"]').val().trim();
  const method = $("#main-form").attr("conversion-method");
  if (text.length === 0) {
    $("#output").css("border", "1.5px solid var(--ERROR__COLOR)");
    showErrorPrompt(null, "Please enter text to encode/decode");
    return;
  }

  switch (method) {
    case "encode":
      URL_GLOBAL = `${BASE_URL}/${method}`;
      //&str=${text}&scheme=${SCHEME};
      BODY = {
        str: text,
        scheme: SCHEME,
      };
      break;
    case "decode":
      URL_GLOBAL = `${BASE_URL}/${method}`;
      // &code=${text};
      BODY = {
        code: text,
      }
      break;
    default:
      showErrorPrompt(
        "Invalid method",
        "Kindly make sure you have selected a valid method(encode/decode) and try again"
      );
      return;
  }
  $("#text-inp-body").text(`${text}`);
  $("#text-out-body").html(spinner("Converting"));
  const data = await fetchCipherData__API('POST',URL_GLOBAL, BODY);
  //print(data);
  print(`${method.slice(0, -1) + "ing"} -> ${text}`);
  if (!data || data === "Failed to fetch") {
    fillErrorResponse(
      data + ", try again later" || "Something went wrong, please try again"
    );
    return;
  }
  if (data.error && data.msg == "could not decode the code") {
    fillErrorResponse(
      data.msg + ", kindly verify your scheme or check your input ☹️"
    );
    return;
  }
  if (!data.error) {
    if(!SCHEME_ALIAS_OBJ || SCHEME_ALIAS_OBJ.length === 0){
      await fillSchemesToModal()
    }
    let scheme__dynamic = SCHEME_ALIAS_OBJ.find( (scheme) => scheme.name === data.schemeUsed).alias;
    let inpHead__dynamic = data.encoded
      ? "Text"
      : data.decoded
      ? "Cipher"
      : "Failed to load";
    let inpBody__dynamic = data.encoded
      ? data.text
      : data.decoded
      ? data.code
      : "Failed to load";
    let outHead__dynamic = data.encoded
      ? "Cipher"
      : data.decoded
      ? "Text"
      : "Failed to load";
    let outBody__dynamic = data.encoded
      ? data.encoded
      : data.decoded
      ? data.decoded
      : "Failed to load";
    //fill success response with dynamic values
    fillSuccessResponse(
      scheme__dynamic,
      inpHead__dynamic,
      inpBody__dynamic,
      outHead__dynamic,
      outBody__dynamic
    );
  } else {
    //fill error response with error message
    fillErrorResponse(data.msg);
  }
});

$("#input-text").focus((e) => {
  skewAnimate("#main-form fieldset legend");
  $("#input-text").addClass("spaced");
  $("#input-text").blur((e) => {
    $("#input-text").removeClass("spaced");
  });
});

$(".info-modal-btn").on("click", (e) => {
  $(".info-modal").addClass("open");
});
$(".info-modal .modal-close-btn").on("click", (e) => {
  $(".info-modal").removeClass("open");
});

$(".schemes-modal-btn").on("click", async (e) => {
  $(".schemes-modal").addClass("open");
});
$(".schemes-modal .modal-close-btn").on("click", (e) => {
  $(".schemes-modal").removeClass("open");
});

// select input on keypress t
$(document).on("keypress", (e) => {
  if (e.key === 't' && !$("#input-text").is(":focus")) {
    $("#input-text").focus();
    setTimeout(()=>{
      $("#input-text").val("");
    },1)
  }
});