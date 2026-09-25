let etiquetaArrayPerPage = [];
let etiqueta;
let formatoImpressaoSelecionado = "a4";

// Controle do Dropdown de Formatos de Impressão
document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        formatoImpressaoSelecionado = item.getAttribute("data-formato");
        
        let textoSelecionado = item.innerText.split(':')[0];
        document.querySelector("#dropdownMenuButton").innerText = `🖨️ Formato: ${textoSelecionado}`;
    });
});

class Etiqueta {
    constructor(nomeCliente, cidade, estado, totalVolume, notaFiscal, chaveAcesso) {
        this.nomeCliente = nomeCliente;
        this.cidade = cidade;
        this.estado = estado;
        this.totalVolume = totalVolume;
        this.notaFiscal = notaFiscal;
        this.chaveAcesso = chaveAcesso;
    }

    montaEtiquetaModal() {
        document.querySelector("#cliModal").innerText = this.nomeCliente;
        document.querySelector("#city").innerText = this.cidade;
        document.querySelector("#uf").innerText = this.estado;
        document.querySelector("#nf").innerText = this.notaFiscal;
        document.querySelector("#vol").innerText = this.totalVolume;
    }

    geraTotalEtiqueta() {
        let book = document.querySelector(".book");
        let vol = Number(this.totalVolume);
        etiquetaArrayPerPage = [];

        for (let i = 1; i <= vol; i++) {
            etiquetaArrayPerPage.push({
                cliente: this.nomeCliente,
                destino: this.cidade,
                estado: this.estado,
                volumes: `${i} / ${vol}`,
                notaFiscal: this.notaFiscal,
                chave: this.chaveAcesso
            });
        }

        // Validação de Layout
        let isMultiCol = (formatoImpressaoSelecionado === "a4" || formatoImpressaoSelecionado === "carta");
        let itensPorPagina = isMultiCol ? 10 : 1; 

        // INJEÇÃO DINÂMICA DE TAMANHO DE PÁGINA (Evita quebrar as térmicas)
        let existingStyle = document.getElementById("print-page-size");
        if (existingStyle) existingStyle.remove();
        
        let stylePrint = document.createElement("style");
        stylePrint.id = "print-page-size";
        
        if (formatoImpressaoSelecionado === "a4") {
            stylePrint.innerHTML = "@media print { @page { size: A4; margin: 0; } }";
        } else if (formatoImpressaoSelecionado === "carta") {
            stylePrint.innerHTML = "@media print { @page { size: letter; margin: 0; } }";
        } else {
            // Térmicas usam apenas margin: 0 e deixam o driver da impressora cortar o papel
            stylePrint.innerHTML = "@media print { @page { margin: 0; } }"; 
        }
        document.head.appendChild(stylePrint);

        const separar = (array, maximo) => {
            return array.reduce((acumulador, item, indice) => {
                const grupo = Math.floor(indice / maximo);
                acumulador[grupo] = [...(acumulador[grupo] || []), item];
                return acumulador;
            }, []);
        };

        let newArraySlice = separar(etiquetaArrayPerPage, itensPorPagina);

        // Renderiza Botões Superiores
        let actionsContainer = document.createElement("div");
        actionsContainer.classList.add("print-actions");

        let btnVoltar = document.createElement("button");
        btnVoltar.classList.add("btn-voltar");
        btnVoltar.innerText = "⬅️ Voltar";
        btnVoltar.addEventListener("click", () => {
            document.querySelector(".book").classList.add("togglerDisplay");
            document.querySelector("#mainContainer").classList.remove("togglerDisplay");
            document.querySelector("header").classList.remove("togglerDisplay");
            document.querySelector(".book").innerHTML = ""; 
        });

        let btnPrint = document.createElement("button");
        btnPrint.classList.add("btn-print");
        btnPrint.innerText = "🖨️ Imprimir";
        btnPrint.addEventListener("click", () => window.print());

        actionsContainer.appendChild(btnVoltar);
        actionsContainer.appendChild(btnPrint);
        book.appendChild(actionsContainer);

        // Renderização dos cards na visualização
        newArraySlice.forEach((divisores, op) => {
            let page = document.createElement("div");
            page.classList.add("page");
            page.classList.add(isMultiCol ? "layout-multi-col" : "layout-single-col");
            book.appendChild(page);

            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                
                let cardHtml = `
                    <div class="card cardEtiquetasImp">
                        <div class="etiqueta-linha etiqueta-cliente">
                            👤 <span>${it.cliente}</span>
                        </div>
                        
                        <div class="etiqueta-linha etiqueta-info-grid">
                            <div class="overflow-hidden"><strong>Destino:</strong> ${it.destino}</div>
                            <div><strong>UF:</strong> ${it.estado}</div>
                        </div>

                        <div class="etiqueta-linha etiqueta-info-grid">
                            <div><strong>Vol:</strong> <span class="text-danger fw-bold">${it.volumes}</span></div>
                            <div><strong>NF:</strong> ${it.notaFiscal}</div>
                        </div>

                        <div class="barcode-container">
                            <svg id="${uniqueBarcodeId}"></svg>
                        </div>
                    </div>`;
                
                page.innerHTML += cardHtml;
            });
        });

        // Aplicação do código de barras
        newArraySlice.forEach((divisores, op) => {
            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                let textoCodigo = (it.chave && it.chave.trim().length >= 10) ? it.chave.trim() : `NF${it.notaFiscal}`;
                try {
                    JsBarcode(`#${uniqueBarcodeId}`, textoCodigo, {
                        format: "CODE128",
                        displayValue: true,
                        fontSize: 10,
                        height: 28,
                        margin: 0
                    });
                } catch (err) {
                    console.error("Erro ao gerar código de barras:", err);
                }
            });
        });
    }

    imprimeEtiquetas() {
        let corpo = document.querySelector("#mainContainer");
        let header = document.querySelector("header");
        let book = document.querySelector(".book");
        
        book.classList.remove("togglerDisplay");
        corpo.classList.add("togglerDisplay");
        if(header) header.classList.add("togglerDisplay");

        if (book.innerHTML != "") book.innerHTML = "";
        
        this.geraTotalEtiqueta();
    }
}

document.querySelector("#geraEtiquetaBtn").addEventListener("click", () => {
    let nomeCliente = document.querySelector("#nomeCliente").value.trim();
    let cidade = document.querySelector("#nomeCidade").value.trim();
    let estado = document.querySelector("#estado").value;
    let volumes = document.querySelector("#volumes").value.trim();
    let notaFiscal = document.querySelector("#notaFiscal").value.trim();
    let chaveBruta = document.querySelector("#chaveAcesso").value;

    if (!nomeCliente || !cidade || !estado || !volumes || !notaFiscal) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    let chaveAcesso = chaveBruta ? chaveBruta.replace(/\s+/g, '') : "";

    etiqueta = new Etiqueta(nomeCliente, cidade, estado, volumes, notaFisca );
/*
Removido para testes
chaveAcesso
*/
    etiqueta.montaEtiquetaModal();

    let modalElement = document.querySelector("#confirmEtiquetas");
    let modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
});

document.querySelector("#btnConfirmaEtiqueta").addEventListener("click", () => {
    if (etiqueta) etiqueta.imprimeEtiquetas();
});
