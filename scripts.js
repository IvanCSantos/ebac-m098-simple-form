function getElement(query) {
  try {
    const elemento = document.querySelector(query);
    return elemento;
  } catch (error) {
    console.error("Erro ao recuperar elemento:" + error);
    return null;
  }
}

const submitBtn = getElement(".container > form .submit");
const cleantBtn = getElement(".container > form .clean");

function queryCep() {
  const apiUrl = "https://viacep.com.br/ws";
  const cepInput = getElement("div.container-cep #cep");

  const cepInformado = cepInput.value;

  if (cepInformado.length == 8) {
    const url = `${apiUrl}/${cepInformado}/json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao consultar cep:", res.statusText);
        }
        return res.json();
      })
      .then((json) => {
        if (json.erro == "true") {
          throw new Error("Erro ao consultar cep");
        }
        getElement("div.container-rua #rua").value = json.logradouro;
        getElement("div.container-bairro #bairro").value = json.bairro;
        getElement("div.container-cidade #cidade").value = json.localidade;
        getElement("div.container-estado #estado").value = json.estado;
      })
      .catch((err) => console.error(err));
  }
}

cep.addEventListener("blur", queryCep);

function saveForm(e) {
  e.preventDefault();

  const form = document.querySelector(".container > form");
  const formData = new FormData(form);

  const dados = Object.fromEntries(formData.entries());

  localStorage.setItem("form", JSON.stringify(dados));
}

submitBtn.addEventListener("click", (event) => saveForm(event));

function retrieveSavedForm() {
  const saved = localStorage.getItem("form");
  if (!saved) return;

  const dados = JSON.parse(saved);

  for (const [key, value] of Object.entries(dados)) {
    const input = getElement(`div.container-${key} #${key}`);
    if (input) input.value = value;
  }
}

window.addEventListener("load", retrieveSavedForm);

function cleanFormData(e) {
  e.preventDefault();
  localStorage.removeItem("form");
  const formFields = [
    "name",
    "email",
    "cep",
    "rua",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
  ];

  formFields.forEach(
    (field) => (getElement(`div.container-${field} #${field}`).value = null)
  );
}

cleantBtn.addEventListener("click", (event) => cleanFormData(event));
