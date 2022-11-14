const etiquetaArrayPerPage = [];
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
    let book = document.querySelector(".book");
    let vol = Number(this.totalVolume);
    let i = undefined;

    for (i = 1; i <= vol; i++) {
      etiquetaArrayPerPage.push({
        destino: this.cidade,
        estado: this.estado,
        volumes: `${i} / ${vol}`,
        notaFiscal: this.notaFiscal,
      });
    }
    //StackOverFlow

    const separar = (etiquetaArrayPerPage, maximo) => {
      return etiquetaArrayPerPage.reduce((acumulador, item, indice) => {
        const grupo = Math.floor(indice / maximo);
        acumulador[grupo] = [...(acumulador[grupo] || []), item];
        return acumulador;
      }, []);
    };

    // Teste de execução
    // console.log(JSON.stringify(separar(etiquetaArrayPerPage, 12)));
    //  console.log(etiquetaArrayPerPage)
    // console.log(separar(etiquetaArrayPerPage, 12))
    let newArraySlice = separar(etiquetaArrayPerPage, 10);

    newArraySlice.forEach((divisores, op) => {
      let page = document.createElement("div");
      page.classList.add("page");
      book.appendChild(page);

      divisores.forEach((it) => {
        let pages = document.querySelectorAll(".page");
        pages[op].innerHTML += `<div class="card cardEtiquetasImp">
        <ul class="list-group ">
        <li class="list-group-item">Destino: ${it.destino} </li>
        <li class="list-group-item">Estado:${it.estado}</li>
        <li class="list-group-item">Volume: ${it.volume}</li>
        <li class="list-group-item">Nota Fiscal: ${it.notaFiscal}</li>
      </ul>
      </div>`




        // <div class="campoEtiqueta">Destino: ${it.destino} </div>
        // <div class="campoEtiqueta">Estado:${it.estado} </div>
        // <div class="campoEtiqueta">Nota Fiscal: ${it.notaFiscal} </div>
        // <div class="campoEtiqueta">Nota Fiscal: ${it.notaFiscal}</div>
       
      });
    });
    console.log(newArraySlice);
  }
  imprimeEtiquetas() {
    let corpo = document.querySelector(".container");
    let book = document.querySelector(".book");
    book.classList.remove("togglerDisplay");
    corpo.classList.add("togglerDisplay");

    //Timer para ativar a impressão após clique
    setTimeout(() => {
      if (book.innerHTML != "") {
        book.innerHTML = "";
      }
      this.geraTotalEtiqueta();
      window.print();
    }, 1000);
  }
}
//Array para gerar etiqueta

let a = function () {
  let cidade = document.querySelector("#nomeCidade").value;
  let estado = document.querySelector("#estado").value;
  let volumes = document.querySelector("#volumes").value;
  let notaFiscal = document.querySelector("#notaFiscal").value;


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
// function criaPaginas(newArraySlice) {

// }
