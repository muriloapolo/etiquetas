class Etiqueta {
  constructor(cidade, estado, totalVolume, notaFiscal) {
    this.cidade = cidade;
    this.estado = estado;
    this.totalVolume = totalVolume;
    this.notaFiscal = notaFiscal;
  }
  montaEtiqueta() {
    let city = document.querySelector("#city");
    let uf = document.querySelector("#uf");
    let nf = document.querySelector("#nf");
    let vol = document.querySelector("#vol");

    city.innerHTML = `Destino: ${this.cidade}`;
    uf.innerHTML = `Estado: ${this.estado}`;
    nf.innerHTML = `Volumes: ${this.totalVolume}`;
    vol.innerHTML = `Nota Fiscal: ${this.notaFiscal}`;
    actionButtons();
  }
  geraTotalEtiqueta() {
    // let page = document.querySelector(".page");
    // let vol = Number(this.totalVolume);
    // let i = undefined;
    // for (i = 1; i <= vol; i++) {
    //   page.innerHTML += `<div class="cardEtiquetasImp">
    //   "Destino:" ${this.cidade}
    //   "Estado:" ${this.estado}
    //   "Volumes:" ${i} / ${vol}
    //   "Nota Fiscal:" ${this.notaFiscal}
    //  </div>`;
    // }
    

  }
  imprimeEtiquetas() {
    let corpo = document.querySelector(".container");
    let book = document.querySelector(".book");
    book.classList.remove("togglerDisplay");
    corpo.classList.add("togglerDisplay");
    //Timer para ativar a impressão após clique
    // setTimeout(() => {
    //   this.geraTotalEtiqueta();
    //   window.print();
    // }, 1000);
    console.log(etiqueta)
  }
}

let a = function () {
  let cidade = document.querySelector("#nomeCidade").value;
  let estado = document.querySelector("#estado").value;
  let volumes = document.querySelector("#volumes").value;
  let notaFiscal = document.querySelector("#notaFiscal").value;

  console.log(cidade, estado, volumes, notaFiscal);

  etiqueta = new Etiqueta(cidade, estado, volumes, notaFiscal);
  etiqueta.montaEtiqueta();
};
let etiqueta;

function actionButtons() {
  let geraEtiquetaBtn = document.querySelector("#btnConfirmaEtiqueta");
  geraEtiquetaBtn.addEventListener("click", function () {
    etiqueta.imprimeEtiquetas();
  });

    //Lógica para imprimir
}
