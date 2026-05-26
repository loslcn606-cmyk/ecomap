let categorias = [];

const materiais = [];


// ===============================
// CARREGAR CATEGORIAS
// ===============================

async function carregarCategorias() {

  const select =
    document.getElementById("categoriaExistente");

  try {

    const snapshot =
      await db.collection("categorias").get();

    categorias = [];

    select.innerHTML = `

      <option value="">
        Selecione categoria existente
      </option>

    `;

    snapshot.forEach(doc => {

      const categoria = {

        id: doc.id,

        ...doc.data()
      };

      categorias.push(categoria);

      select.innerHTML += `

        <option value="${categoria.id}">
          ${categoria.label}
        </option>

      `;
    });

  } catch (erro) {

    console.error(erro);
  }
}


// ===============================
// CARREGAR CATEGORIA
// ===============================

function carregarCategoriaExistente() {

  const id =
    document.getElementById("categoriaExistente").value;

  const categoria =
    categorias.find(item => item.id === id);

  if (!categoria) return;

  // CAMPOS

  document.getElementById("nome").value =
    categoria.nome;

  document.getElementById("label").value =
    categoria.label;

  // LIMPAR ARRAY

  materiais.length = 0;

  // ADICIONAR MATERIAIS

  categoria.materiais.forEach(material => {

    materiais.push(material);
  });

  renderizarMateriais();
}


// ===============================
// ADICIONAR MATERIAL
// ===============================

function adicionarMaterial() {

  const input =
    document.getElementById("material");

  const valor =
    input.value.trim();

  if (!valor) return;

  // EVITAR DUPLICADO

  if (materiais.includes(valor)) {

    alert("Material já existe.");

    return;
  }

  materiais.push(valor);

  renderizarMateriais();

  input.value = "";
}


// ===============================
// REMOVER MATERIAL
// ===============================

function removerMaterial(index) {

  materiais.splice(index, 1);

  renderizarMateriais();
}


// ===============================
// RENDERIZAR
// ===============================

function renderizarMateriais() {

  const lista =
    document.getElementById("listaMateriais");

  lista.innerHTML = "";

  materiais.forEach((material, index) => {

    lista.innerHTML += `

      <div class="material-item">

        <span>
          ${material}
        </span>

        <button
          class="remover-btn"
          onclick="removerMaterial(${index})"
        >
          Remover
        </button>

      </div>

    `;
  });
}


// ===============================
// SALVAR
// ===============================

async function salvarCategoria() {

  const nome =
    document.getElementById("nome").value;

  const label =
    document.getElementById("label").value;

  const categoriaId =
    document.getElementById("categoriaExistente").value;

  try {

    // EDITAR

    if (categoriaId) {

      await db
        .collection("categorias")
        .doc(categoriaId)
        .update({

          nome,

          label,

          materiais
        });

      document.getElementById("status").innerHTML =
        "✅ Categoria atualizada!";
    }

    // NOVA

    else {

      await db.collection("categorias").add({

        nome,

        label,

        materiais
      });

      document.getElementById("status").innerHTML =
        "✅ Categoria criada!";
    }

    carregarCategorias();

  } catch (erro) {

    console.error(erro);

    document.getElementById("status").innerHTML =
      "❌ Erro ao salvar.";
  }
}


// ===============================
// INICIAR
// ===============================

carregarCategorias();