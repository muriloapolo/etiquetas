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
    let i;

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
      let btnPrint = document.createElement("button");
      btnPrint.classList.add("btn-print");
      btnPrint.innerText = "IMPRIMIR";
      btnPrint.addEventListener("click", () => {
        btnPrint.classList.add("togglerDisplay");
        window.print();
      });
      book.appendChild(btnPrint);
      page.classList.add("page");
      book.appendChild(page);

      divisores.forEach((it) => {
        let pages = document.querySelectorAll(".page");
        pages[op].innerHTML += `<div class="card cardEtiquetasImp">
                
        <ul class="list-group ">
        <li class="list-group-item">Destino: <span class="text-item">${it.destino}</span> </li>
        <li class="list-group-item">Estado:<span class="text-item">${it.estado}</span></li>
        <li class="list-group-item">Volume: <span class="text-item">${it.volumes}</span></li>
        <li class="list-group-item">Nota Fiscal: <span class="text-item">${it.notaFiscal}</span></li>
      </ul>
      </div>`;
      });
    });
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
    }, 2000);
  }
}
//Array para gerar etiqueta

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
}
//Lógica para imprimir
