# EcoMap

Plataforma web desenvolvida para auxiliar moradores na localização de pontos de coleta e descarte correto de materiais recicláveis e resíduos especiais.

---

## Acesse o projeto

https://loslcn606-cmyk.github.io/ecomap/

---

## Funcionalidades

- Busca de materiais recicláveis
- Exibição de pontos de coleta
- Mapa interativo com Leaflet
- Cadastro de categorias
- Cadastro de materiais
- Cadastro e edição de pontos de coleta
- Integração com Google Maps
- Busca de endereço por CEP
- Cálculo de distância aproximada
- Interface responsiva
- Integração com Firebase Firestore

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Firebase Firestore
- Leaflet.js
- OpenStreetMap
- ViaCEP API
- Nominatim API

---

## Estrutura do projeto

## Estrutura do projeto

```text
EcoMap/
│
├── css/
│   └── ecoMap.css
│
├── images/
│   ├── greenCity.jpg
│   └── greenCity2.jpg
│
├── js/
│   ├── ecoMap.js
│   └── firebase.js
│
├── pages/
│   ├── cadastroCategoria/
│   │   ├── cadastroCategoria.html
│   │   ├── cadastroCategoria.css
│   │   └── cadastroCategoria.js
│   │
│   └── cadastroPontoColeta/
│       ├── cadastroPontoColeta.html
│       ├── cadastroPontoColeta.css
│       └── cadastroPontoColeta.js
│
├── README.md
│
└── index.html
```

## APIs utilizadas

### ViaCEP

Utilizada para preenchimento automático de endereço através do CEP.

https://viacep.com.br/

### Nominatim OpenStreetMap

Utilizada para converter endereços em coordenadas geográficas.

https://nominatim.openstreetmap.org/

---

## Mapa interativo

O sistema utiliza a biblioteca Leaflet integrada ao OpenStreetMap para:

- exibir ecopontos
- destacar pontos selecionados
- permitir navegação
- calcular proximidade

---

## Firebase

O Firebase Firestore foi utilizado como banco de dados em nuvem para armazenamento de:

- categorias
- materiais
- pontos de coleta

---

## Responsividade

O projeto foi desenvolvido com layout responsivo para:

- desktop
- tablets
- smartphones

---

## Objetivo

O EcoMap busca incentivar o descarte correto de resíduos e promover consciência ambiental através da tecnologia e acessibilidade digital.

---

## Idealizado e desenvolvido por

Luciano Oliveira da Silva
