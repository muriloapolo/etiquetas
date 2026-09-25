let etiquetaArrayPerPage = [];
let etiqueta;
let formatoImpressaoSelecionado = "a4";

// Alterna o formato de impressão pelo menu superior
document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        formatoImpressaoSelecionado = item.getAttribute("data-formato");
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

    // Preenche dados no Modal de Confirmação
    montaEtiquetaModal() {
        document.querySelector("#cliModal").innerText = this.nomeCliente;
        document.querySelector("#city").innerText = this.cidade;
        document.querySelector("#uf").innerText = this.estado;
        document.querySelector("#nf").innerText = this.notaFiscal;
        document.querySelector("#vol").innerText = this.totalVolume;
    }

    // Gera o total de etiquetas e distribui pelas páginas em grade otimizada
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

        const itensPorPagina = formatoImpressaoSelecionado === "a4" ? 12 : 4;
        const separar = (array, maximo) => {
            return array.reduce((acumulador, item, indice) => {
                const grupo = Math.floor(indice / maximo);
                acumulador[grupo] = [...(acumulador[grupo] || []), item];
                return acumulador;
            }, []);
        };

        let newArraySlice = separar(etiquetaArrayPerPage, itensPorPagina);

        // Botão flutuante para impressão manual rápida
        let btnPrint = document.createElement("button");
        btnPrint.classList.add("btn-print");
        btnPrint.innerText = "🖨️ Imprimir Agora";
        btnPrint.addEventListener("click", () => {
            window.print();
        });
        book.appendChild(btnPrint);

        // Renderização dos blocos organizados lado a lado (2 por linha)
        newArraySlice.forEach((divisores, op) => {
            let page = document.createElement("div");
            page.classList.add("page");
            book.appendChild(page);

            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                
                let cardHtml = `
                    <div class="card cardEtiquetasImp">
                        <!-- Linha 1: Nome do Cliente -->
                        <div class="etiqueta-linha etiqueta-cliente">
                            👤 <span>${it.cliente}</span>
                        </div>
                        
                        <!-- Linha 2: Cidade e Estado -->
                        <div class="etiqueta-linha etiqueta-info-grid">
                            <div class="overflow-hidden"><strong>Destino:</strong> ${it.destino}</div>
                            <div><strong>UF:</strong> ${it.estado}</div>
                        </div>

                        <!-- Linha 3: Volumes e Nota Fiscal -->
                        <div class="etiqueta-linha etiqueta-info-grid">
                            <div><strong>Vol:</strong> <span class="text-danger fw-bold">${it.volumes}</span></div>
                            <div><strong>NF:</strong> ${it.notaFiscal}</div>
                        </div>

                        <!-- Linha 4: Código de Barras / Chave da NF em container seguro -->
                        <div class="barcode-container">
                            <svg id="${uniqueBarcodeId}"></svg>
                        </div>
                    </div>`;
                
                page.innerHTML += cardHtml;
            });
        });

        // Aplicação do JsBarcode após inserção no DOM
        newArraySlice.forEach((divisores, op) => {
            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                let textoCodigo = (it.chave && it.chave.trim().length >= 10) ? it.chave.trim() : `NF${it.notaFiscal}`;
                try {
                    JsBarcode(`#${uniqueBarcodeId}`, textoCodigo, {
                        format: "CODE128",
                        displayValue: true,
                        fontSize: 8,
                        height: 20,
                        margin: 0
                    });
                } catch (err) {
                    console.error("Erro ao gerar código de barras:", err);
                }
            });
        });
    }

    imprimeEtiquetas() {
        let corpo = document.querySelector(".container");
        let header = document.querySelector("header");
        let book = document.querySelector(".book");
        
        book.classList.remove("togglerDisplay");
        corpo.classList.add("togglerDisplay");
        if(header) header.classList.add("togglerDisplay");

        if (book.innerHTML != "") {
            book.innerHTML = "";
        }
        this.geraTotalEtiqueta();
    }
}

// Evento do botão para validar, limpar espaços da chave[cite: 1] e abrir o modal de forma segura via JS
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

    // REMOVEDOR DE ESPAÇOS EM BRANCO: Remove espaços das pontas e todos os espaços intermediários entre os algarismos da chave[cite: 1]
    let chaveAcesso = chaveBruta ? chaveBruta.replace(/\s+/g, '') : "";

    etiqueta = new Etiqueta(nomeCliente, cidade, estado, volumes, notaFiscal, chaveAcesso);
    etiqueta.montaEtiquetaModal();

    // Dispara o modal explicitamente via Bootstrap
    let modalElement = document.querySelector("#confirmEtiquetas");
    let modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
});

// Confirmação final para abrir a tela de impressão
document.querySelector("#btnConfirmaEtiqueta").addEventListener("click", () => {
    if (etiqueta) {
        etiqueta.imprimeEtiquetas();
    }
});
