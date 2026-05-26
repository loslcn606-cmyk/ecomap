// ===============================
// VARIÁVEIS
// ===============================

let locais = [];

let categorias = [];

let marcadores = [];

let localUsuario = null;


// ===============================
// MAPA
// ===============================

const map = L.map("map").setView(
  [-23.5015, -47.4526],
  12
);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      "&copy; OpenStreetMap &copy; CARTO"
  }
).addTo(map);


// ===============================
// CARREGAR CATEGORIAS
// ===============================

async function carregarCategorias() {

  const select =
    document.getElementById("selectMaterial");

  try {

    const snapshot =
      await db.collection("categorias").get();

    categorias = [];

    select.innerHTML = `

      <option value="">
        Selecione um material
      </option>

    `;

    snapshot.forEach(doc => {

      const categoria = doc.data();

      categorias.push(categoria);

      let optgroup = `
        <optgroup label="${categoria.label}">
      `;

      categoria.materiais.forEach(material => {

        optgroup += `

          <option value="${material}">
            ${material}
          </option>

        `;
      });

      optgroup += `
        </optgroup>
      `;

      select.innerHTML += optgroup;
    });

  } catch (erro) {

    console.error(erro);
  }
}


// ===============================
// CARREGAR LOCAIS
// ===============================

async function carregarLocais() {

  try {

    const snapshot =
      await db.collection("locais").get();

    locais = [];

    snapshot.forEach(doc => {

      locais.push(doc.data());
    });

  } catch (erro) {

    console.error(erro);
  }
}


// ===============================
// BUSCAR CEP USUÁRIO
// ===============================

async function buscarCepUsuario() {

  const cep =
    document.getElementById("cepUsuario").value;

  try {

    const resposta = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    const dados =
      await resposta.json();

    const endereco = `
      ${dados.logradouro},
      ${dados.bairro},
      ${dados.localidade}
    `;

    localUsuario =
      await buscarCoordenadas(endereco);

    buscarMaterial();

  } catch (erro) {

    console.error(erro);

    alert("Erro ao buscar CEP.");
  }
}


// ===============================
// BUSCAR COORDENADAS
// ===============================

async function buscarCoordenadas(endereco) {

  const url =
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;

  const resposta =
    await fetch(url);

  const dados =
    await resposta.json();

  if (dados.length > 0) {

    return {

      lat: parseFloat(dados[0].lat),

      lng: parseFloat(dados[0].lon)
    };
  }

  return null;
}


// ===============================
// CALCULAR DISTÂNCIA
// ===============================

function calcularDistancia(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) * Math.PI / 180;

  const dLon =
    (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}


// ===============================
// BUSCAR MATERIAL
// ===============================

function buscarMaterial() {

  const materialSelecionado =
    document.getElementById("selectMaterial").value;

  if (!materialSelecionado) return;

  let resultados = locais.filter(local =>

    local.materiais &&
    local.materiais.includes(materialSelecionado)
  );

  // DISTÂNCIA

  if (localUsuario) {

    resultados = resultados.map(local => {

      const distancia =
        calcularDistancia(

          localUsuario.lat,
          localUsuario.lng,

          local.lat,
          local.lng
        );

      return {

        ...local,

        distancia
      };
    });

    resultados.sort(
      (a, b) =>
        a.distancia - b.distancia
    );
  }

  mostrarResultados(resultados);
}


// ===============================
// MOSTRAR RESULTADOS
// ===============================

function mostrarResultados(lista) {

  const listaLocais =
    document.getElementById("listaLocais");

  listaLocais.innerHTML = "";

  limparMarcadores();

  if (lista.length === 0) {

    listaLocais.innerHTML = `

      <p class="nenhum-resultado">

        Nenhum ponto encontrado.

      </p>

    `;

    return;
  }

  lista.forEach(local => {

    const distanciaTexto =
      local.distancia
        ? `${local.distancia.toFixed(1)} km`
        : "";

    // MARCADOR

    const marcador = L.marker([
      local.lat,
      local.lng
    ])
    .addTo(map)
    .bindPopup(`

      <strong>

        ${local.nome}

      </strong>

      <br><br>

      📍 ${local.endereco}

    `);

    marcadores.push(marcador);

    // CARD

    const card =
      document.createElement("div");

    card.id = `
      card-${local.lat}-${local.lng}
    `;

    card.className = "local-card";

    card.innerHTML = `

      <h3>

        ${local.nome}

      </h3>

      <p>

        <i class="fa-solid fa-location-dot"></i>

        ${local.endereco}

      </p>

      <p>

        <i class="fa-solid fa-phone"></i>

        ${local.telefone || "Não informado"}

      </p>

      <p>

        <i class="fa-brands fa-whatsapp"></i>

        ${local.whatsapp || "Não informado"}

      </p>

      <p>

        <i class="fa-regular fa-clock"></i>

        ${local.horarioAbertura || "--:--"}
        até
        ${local.horarioFechamento || "--:--"}

      </p>

      <p>

        <i class="fa-regular fa-calendar-days"></i>

        ${
          local.diasFuncionamento?.join(", ")
          || "Não informado"
        }

      </p>

      ${
        distanciaTexto
          ? `

            <p>

              <i class="fa-solid fa-route"></i>

              ${distanciaTexto}

            </p>

          `
          : ""
      }

      <a
        href="https://www.google.com/maps?q=${local.lat},${local.lng}"
        target="_blank"
      >

        <i class="fa-solid fa-route"></i>

        Como chegar

      </a>

    `;

    // CLICK CARD

    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".local-card")
          .forEach(card => {

            card.classList.remove("ativo");
          });

        card.classList.add("ativo");

        map.flyTo(
          [local.lat, local.lng],
          16
        );

        marcador.openPopup();
      }
    );

    // CLICK MARCADOR

    marcador.on("click", () => {

      document
        .querySelectorAll(".local-card")
        .forEach(card => {

          card.classList.remove("ativo");
        });

      card.classList.add("ativo");

      card.scrollIntoView({

        behavior: "smooth",

        block: "center"
      });
    });

    listaLocais.appendChild(card);
  });

  // AJUSTAR MAPA

  const grupo =
    L.featureGroup(marcadores);

  map.fitBounds(
    grupo.getBounds(),
    {
      padding: [30, 30]
    }
  );
}


// ===============================
// LIMPAR MARCADORES
// ===============================

function limparMarcadores() {

  marcadores.forEach(marcador => {

    map.removeLayer(marcador);
  });

  marcadores = [];
}


// ===============================
// EVENTO
// ===============================

document
  .getElementById("selectMaterial")
  .addEventListener(
    "change",
    buscarMaterial
  );


// ===============================
// INICIAR
// ===============================

carregarCategorias();

carregarLocais();