// ===============================
// VARIÁVEIS
// ===============================

let categorias = [];

let pontos = [];


// ===============================
// CARREGAR CATEGORIAS
// ===============================

async function carregarCategorias() {

  const select =
    document.getElementById("categoria");

  try {

    const snapshot =
      await db.collection("categorias").get();

    categorias = [];

    select.innerHTML = `

      <option value="">
        Selecione uma categoria
      </option>

    `;

    snapshot.forEach(doc => {

      const categoria = {

        id: doc.id,

        ...doc.data()
      };

      categorias.push(categoria);

      select.innerHTML += `

        <option value="${categoria.nome}">
          ${categoria.label}
        </option>

      `;
    });

  } catch (erro) {

    console.error(erro);
  }
}


// ===============================
// CARREGAR MATERIAIS
// ===============================

function carregarMateriais() {

  const categoriaSelecionada =
    document.getElementById("categoria").value;

  const lista =
    document.getElementById("listaMateriais");

  lista.innerHTML = "";

  const categoria =
    categorias.find(
      item => item.nome === categoriaSelecionada
    );

  if (!categoria) return;

  categoria.materiais.forEach(material => {

    lista.innerHTML += `

      <label>

        <input
          type="checkbox"
          value="${material}"
        >

        ${material}

      </label>

    `;
  });

  // OUTRO MATERIAL

  lista.innerHTML += `

    <label>

      <input
        type="checkbox"
        id="checkOutro"
        onchange="toggleOutroMaterial()"
      >

      Outro material

    </label>

    <input
      type="text"
      id="outroMaterial"
      placeholder="Digite o material"
      style="display: none;"
    >
  `;
}


// ===============================
// TOGGLE OUTRO MATERIAL
// ===============================

function toggleOutroMaterial() {

  const checkbox =
    document.getElementById("checkOutro");

  const campo =
    document.getElementById("outroMaterial");

  if (checkbox.checked) {

    campo.style.display = "block";

  } else {

    campo.style.display = "none";

    campo.value = "";
  }
}


// ===============================
// BUSCAR CEP
// ===============================

async function buscarCep() {

  const cep =
    document.getElementById("cep").value;

  try {

    const resposta = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    const dados =
      await resposta.json();

    document.getElementById("rua").value =
      dados.logradouro || "";

    document.getElementById("bairro").value =
      dados.bairro || "";

    document.getElementById("cidade").value =
      dados.localidade || "";

    document.getElementById("estado").value =
      dados.uf || "";

  } catch (erro) {

    console.error(erro);

    alert("Erro ao buscar CEP.");
  }
}


// ===============================
// IDENTIFICAR REGIÃO
// ===============================

function identificarRegiao(bairro) {

  bairro = bairro.toLowerCase();

  if (
    bairro.includes("vila helena") ||
    bairro.includes("itavuvu")
  ) {

    return "norte";
  }

  if (
    bairro.includes("campolim") ||
    bairro.includes("vossoroca")
  ) {

    return "sul";
  }

  if (
    bairro.includes("hortência")
  ) {

    return "leste";
  }

  if (
    bairro.includes("julio de mesquita")
  ) {

    return "oeste";
  }

  return "centro";
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
// FORMATAR TELEFONE
// ===============================

function formatarTelefone(campo) {

  let valor =
    campo.value.replace(/\D/g, "");

  if (valor.length > 10) {

    valor = valor.replace(
      /^(\d{2})(\d{5})(\d{4}).*/,
      "($1) $2-$3"
    );

  } else {

    valor = valor.replace(
      /^(\d{2})(\d{4})(\d{4}).*/,
      "($1) $2-$3"
    );
  }

  campo.value = valor;
}


// ===============================
// VALIDAR TELEFONE
// ===============================

function telefoneValido(numero) {

  const apenasNumeros =
    numero.replace(/\D/g, "");

  return (
    apenasNumeros.length === 10 ||
    apenasNumeros.length === 11
  );
}


// ===============================
// LIMPAR FORMULÁRIO
// ===============================

function limparFormulario() {

  document.getElementById("pontoExistente").value = "";

  document.getElementById("nome").value = "";

  document.getElementById("categoria").value = "";

  document.getElementById("listaMateriais").innerHTML = "";

  document.getElementById("cep").value = "";

  document.getElementById("rua").value = "";

  document.getElementById("numero").value = "";

  document.getElementById("bairro").value = "";

  document.getElementById("cidade").value = "";

  document.getElementById("estado").value = "";

  document.getElementById("telefone").value = "";

  document.getElementById("whatsapp").value = "";

  document.getElementById("detalhes").value = "";

  document.getElementById("horarioAbertura").value = "";

  document.getElementById("horarioFechamento").value = "";

  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach(item => {

      item.checked = false;
    });
}


// ===============================
// SALVAR PONTO
// ===============================

async function salvarPonto() {

  const nome =
    document.getElementById("nome").value.trim();

  const categoria =
    document.getElementById("categoria").value;

  const rua =
    document.getElementById("rua").value;

  const numero =
    document.getElementById("numero").value;

  const bairro =
    document.getElementById("bairro").value;

  const cidade =
    document.getElementById("cidade").value;

  const estado =
    document.getElementById("estado").value;

  const telefone =
    document.getElementById("telefone").value;

  const whatsapp =
    document.getElementById("whatsapp").value;

  const detalhes =
    document.getElementById("detalhes").value;

  const pontoId =
    document.getElementById("pontoExistente").value;

  // VALIDAÇÕES

  if (!nome) {

    alert("Digite o nome.");

    return;
  }

  if (!categoria) {

    alert("Selecione categoria.");

    return;
  }

  if (
    telefone &&
    !telefoneValido(telefone)
  ) {

    alert("Telefone inválido.");

    return;
  }

  if (
    whatsapp &&
    !telefoneValido(whatsapp)
  ) {

    alert("WhatsApp inválido.");

    return;
  }

  // DIAS

  const diasFuncionamento = [];

  document
    .querySelectorAll(
      '.horarios-funcionamento input[type="checkbox"]:checked'
    )
    .forEach(item => {

      diasFuncionamento.push(item.value);
    });

  // HORÁRIOS

  const horarioAbertura =
    document.getElementById("horarioAbertura").value;

  const horarioFechamento =
    document.getElementById("horarioFechamento").value;

  // REGIÃO

  const regiao =
    identificarRegiao(bairro);

  // MATERIAIS

  const materiaisSelecionados = [];

  document
    .querySelectorAll(
      '#listaMateriais input[type="checkbox"]:checked'
    )
    .forEach(item => {

      materiaisSelecionados.push(item.value);
    });

  // OUTRO MATERIAL

  const outroMaterial =
    document.getElementById("outroMaterial")?.value.trim();

  if (outroMaterial) {

    materiaisSelecionados.push(outroMaterial);
  }

  if (materiaisSelecionados.length === 0) {

    alert("Selecione ao menos um material.");

    return;
  }

  // ENDEREÇO

  const endereco =
    `${rua}, ${numero}, ${bairro}, ${cidade}`;

  try {

    const coordenadas =
      await buscarCoordenadas(endereco);

    const dados = {

      nome,

      categoria,

      materiais: materiaisSelecionados,

      endereco,

      rua,

      numero,

      bairro,

      cidade,

      estado,

      telefone,

      whatsapp,

      diasFuncionamento,

      horarioAbertura,

      horarioFechamento,

      regiao,

      detalhes,

      lat: coordenadas?.lat || null,

      lng: coordenadas?.lng || null
    };

    // UPDATE

    if (pontoId) {

      await db
        .collection("locais")
        .doc(pontoId)
        .update(dados);

      document.getElementById("status").innerHTML =
        "✅ Ponto atualizado!";
    }

    // CREATE

    else {

      await db
        .collection("locais")
        .add(dados);

      document.getElementById("status").innerHTML =
        "✅ Ponto criado!";
    }

    // OUTRO MATERIAL

    if (outroMaterial) {

      const categoriaAtual =
        categorias.find(
          item => item.nome === categoria
        );

      if (
        categoriaAtual &&
        !categoriaAtual.materiais.includes(outroMaterial)
      ) {

        categoriaAtual.materiais.push(outroMaterial);

        await db
          .collection("categorias")
          .doc(categoriaAtual.id)
          .update({

            materiais:
              categoriaAtual.materiais
          });
      }
    }

    limparFormulario();

    carregarPontos();

  } catch (erro) {

    console.error(erro);

    document.getElementById("status").innerHTML =
      "❌ Erro ao salvar.";
  }
}


// ===============================
// CARREGAR PONTOS
// ===============================

async function carregarPontos() {

  const select =
    document.getElementById("pontoExistente");

  try {

    const snapshot =
      await db.collection("locais").get();

    pontos = [];

    select.innerHTML = `

      <option value="">
        Selecione ponto existente
      </option>

    `;

    snapshot.forEach(doc => {

      const ponto = {

        id: doc.id,

        ...doc.data()
      };

      pontos.push(ponto);

      select.innerHTML += `

        <option value="${ponto.id}">
          ${ponto.nome}
        </option>

      `;
    });

  } catch (erro) {

    console.error(erro);
  }
}


// ===============================
// CARREGAR PONTO EXISTENTE
// ===============================

function carregarPontoExistente() {

  const id =
    document.getElementById("pontoExistente").value;

  const ponto =
    pontos.find(item => item.id === id);

  if (!ponto) return;

  document.getElementById("nome").value =
    ponto.nome || "";

  document.getElementById("categoria").value =
    ponto.categoria || "";

  carregarMateriais();

  setTimeout(() => {

    document
      .querySelectorAll(
        '#listaMateriais input[type="checkbox"]'
      )
      .forEach(item => {

        if (
          ponto.materiais?.includes(item.value)
        ) {

          item.checked = true;
        }
      });

  }, 100);

  document.getElementById("rua").value =
    ponto.rua || "";

  document.getElementById("numero").value =
    ponto.numero || "";

  document.getElementById("bairro").value =
    ponto.bairro || "";

  document.getElementById("cidade").value =
    ponto.cidade || "";

  document.getElementById("estado").value =
    ponto.estado || "";

  document.getElementById("telefone").value =
    ponto.telefone || "";

  document.getElementById("whatsapp").value =
    ponto.whatsapp || "";

  document.getElementById("detalhes").value =
    ponto.detalhes || "";

  document.getElementById("horarioAbertura").value =
    ponto.horarioAbertura || "";

  document.getElementById("horarioFechamento").value =
    ponto.horarioFechamento || "";

  document
    .querySelectorAll(
      '.horarios-funcionamento input[type="checkbox"]'
    )
    .forEach(item => {

      item.checked =
        ponto.diasFuncionamento?.includes(item.value);
    });
}


// ===============================
// INICIAR
// ===============================

carregarCategorias();

carregarPontos();