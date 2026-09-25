// Array global para armazenar temporariamente as etiquetas divididas por página
let etiquetaArrayPerPage = [];
let etiqueta;
let formatoImpressaoSelecionado = "a4"; // Padrão

// Captura a troca de formato de impressão pelo menu superior
document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".dropdown-menu .dropdown-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        formatoImpressaoSelecionado = item.getAttribute("data-formato");
    });
});

class Etiqueta {
    constructor(cidade, estado, totalVolume, notaFiscal, chaveAcesso) {
        this.cidade = cidade;
        this.estado = estado;
        this.totalVolume = totalVolume;
        this.notaFiscal = notaFiscal;
        this.chaveAcesso = chaveAcesso;
    }

    // Preenche os dados de resumo no Modal de confirmação
    montaEtiquetaModal() {
        document.querySelector("#city").innerText = this.cidade;
        document.querySelector("#uf").innerText = this.estado;
        document.querySelector("#nf").innerText = this.notaFiscal;
        document.querySelector("#vol").innerText = this.totalVolume;
    }

    // Gera o total de etiquetas e faz a distribuição por páginas
    geraTotalEtiqueta() {
        let book = document.querySelector(".book");
        let vol = Number(this.totalVolume);
        etiquetaArrayPerPage = []; // Limpa array anterior

        // Cria os objetos individuais para cada volume (Ex: 1/5, 2/5...)
        for (let i = 1; i <= vol; i++) {
            etiquetaArrayPerPage.push({
                destino: this.cidade,
                estado: this.estado,
                volumes: `${i} / ${vol}`,
                notaFiscal: this.notaFiscal,
                chave: this.chaveAcesso
            });
        }

        // Define a quantidade de etiquetas por página de acordo com o formato escolhido
        const itensPorPagina = formatoImpressaoSelecionado === "a4" ? 10 : 4;
        const separar = (array, maximo) => {
            return array.reduce((acumulador, item, indice) => {
                const grupo = Math.floor(indice / maximo);
                acumulador[grupo] = [...(acumulador[grupo] || []), item];
                return acumulador;
            }, []);
        };

        let newArraySlice = separar(etiquetaArrayPerPage, itensPorPagina);

        // Cria o botão flutuante de impressão
        let btnPrint = document.createElement("button");
        btnPrint.classList.add("btn-print");
        btnPrint.innerText = "🖨️ Imprimir Agora";
        btnPrint.addEventListener("click", () => {
            window.print();
        });
        book.appendChild(btnPrint);

        // Renderiza cada página e seus respectivos cards de etiquetas
        newArraySlice.forEach((divisores, op) => {
            let page = document.createElement("div");
            page.classList.add("page");
            book.appendChild(page);

            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                
                let cardHtml = `
                    <div class="card cardEtiquetasImp">
                        <div class="card-body p-2 d-flex flex-column justify-content-between">
                            <ul class="list-unstyled mb-1" style="font-size: 0.85rem; line-height: 1.2;">
                                <li><strong>Destino:</strong> <span class="text-item">${it.destino} - ${it.estado}</span></li>
                                <li><strong>Volume:</strong> <span class="text-item text-danger">${it.volumes}</span></li>
                                <li><strong>Nota Fiscal:</strong> <span class="text-item">${it.notaFiscal}</span></li>
                            </ul>
                            <div class="text-center mt-auto">
                                <svg id="${uniqueBarcodeId}" class="w-100" style="max-height: 35px;"></svg>
                            </div>
                        </div>
                    </div>`;
                
                page.innerHTML += cardHtml;
            });
        });

        // Renderiza os códigos de barras via JsBarcode após os elementos estarem inseridos no DOM
        newArraySlice.forEach((divisores, op) => {
            divisores.forEach((it, indexCalculado) => {
                let uniqueBarcodeId = `barcode-${op}-${indexCalculado}`;
                let textoCodigo = (it.chave && it.chave.trim().length >= 10) ? it.chave.trim() : `NF${it.notaFiscal}`;
                try {
                    JsBarcode(`#${uniqueBarcodeId}`, textoCodigo, {
                        format: "CODE128",
                        displayValue: true,
                        fontSize: 10,
                        height: 25,
                        margin: 0
                    });
                } catch (err) {
                    console.error("Erro ao gerar código de barras:", err);
                }
            });
        });
    }

    // Prepara a tela para modo de impressão ocultando o formulário e o menu
    imprimeEtiquetas() {
        let corpo = document.querySelector(".container");
        let header = document.querySelector("header");
        let book = document.querySelector(".book");
        
        book.classList.remove("togglerDisplay");
        corpo.classList.add("togglerDisplay");
        if(header) header.classList.add("togglerDisplay");

        // Limpa conteúdo anterior e gera novos elementos
        if (book.innerHTML != "") {
            book.innerHTML = "";
        }
        this.geraTotalEtiqueta();
    }
}

// Evento disparado quando o usuário clica no botão principal para abrir o modal
document.querySelector("#geraEtiquetaBtn").addEventListener("click", () => {
    let cidade = document.querySelector("#nomeCidade").value.trim();
    let estado = document.querySelector("#estado").value;
    let volumes = document.querySelector("#volumes").value.trim();
    let notaFiscal = document.querySelector("#notaFiscal").value.trim();
    let chaveAcesso = document.querySelector("#chaveAcesso").value.trim();

    if (!cidade || !estado || !volumes || !notaFiscal) {
        alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
        return;
    }

    // Instancia o objeto e joga os dados no modal
    etiqueta = new Etiqueta(cidade, estado, volumes, notaFiscal, chaveAcesso);
    etiqueta.montaEtiquetaModal();
});

// Evento de confirmação dentro do Modal (Inicia a geração e impressão)
document.querySelector("#btnConfirmaEtiqueta").addEventListener("click", () => {
    if (etiqueta) {
        etiqueta.imprimeEtiquetas();
    }
});
