const dynPanelContent = document.getElementById("dyn-panel-content");

window.onload = async () => {
  // fetch API keys and schemes
  const fetchedAPIKeys = await fetchAPIKeys();
  const fetchedSchemes = await fetchSchemes();
  console.log(fetchedSchemes);
  // render API keys view and schemes view
  renderAPIKeysView(fetchedAPIKeys);
  renderSchemesView(fetchedSchemes);
};

const fetchAPIKeys = async () => {
  const data = await fetchCipherData__API("GET", "/api/v1/admin/apikeys");
  return data;
};

const fetchSchemes = async () => {
  const data = await fetchCipherData__API("GET", "/api/v1/scheme/view");
  return data;
};

const renderAPIKeysView = (keysData) => {
  const apiKeysView = document.createElement("div");
  apiKeysView.classList.add("panel-data-view");
  const apiKeysViewHeader = document.createElement("div");
  apiKeysViewHeader.classList.add("panel-data-view-header");
  apiKeysViewHeader.innerHTML = `
    <h2>${keysData.hits}</h2> 
    <span>API keys generated</span>
    `;
  apiKeysView.appendChild(apiKeysViewHeader);

  const apiKeysViewFooter = document.createElement("div");
  apiKeysViewFooter.classList.add("panel-data-view-footer");
  apiKeysViewFooter.innerHTML = `
        <button class='btn btn-sm manage-keys-btn'>manage</button>
    `;
  apiKeysView.appendChild(apiKeysViewFooter);

  dynPanelContent.appendChild(apiKeysView);
  document.querySelector(".manage-keys-btn").addEventListener("click", () => {
    alertCustom("coming soon");
  });
};

const renderSchemesView = (schemesData) => {
  const schemesView = document.createElement("div");
  schemesView.classList.add("panel-data-view");
  const schemesViewHeader = document.createElement("div");
  schemesViewHeader.classList.add("panel-data-view-header");
  schemesViewHeader.innerHTML = `
        <h2>${schemesData.schemes_count}</h2> 
        <span>schemes added</span>
        `;
  schemesView.appendChild(schemesViewHeader);

  const schemesViewFooter = document.createElement("div");
  schemesViewFooter.classList.add("panel-data-view-footer");
  schemesViewFooter.innerHTML = `
            <a href='/panel/dash' class='btn btn-sm manage-schemes-btn'>manage</a>
        `;
  schemesView.appendChild(schemesViewFooter);

  dynPanelContent.appendChild(schemesView);
};
