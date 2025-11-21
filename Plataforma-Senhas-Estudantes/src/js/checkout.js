function selectMethod(method) {
    const box = document.getElementById("detailsBox");

    if (method === "mbway") {
        box.innerHTML = `
            <div class= "mbway-box">
                <div class="input-row MBW">
                    <label>Quantidade:</label>
                    <div class="qty-box">
                        <button onclick="changeQty(-1)">-</button>
                        <span id="qty">1</span>
                        <button onclick="changeQty(1)">+</button>
                    </div>
                </div>

                <div class="input-row MBW">
                    <label>Número de Telemóvel:</label><br>
                    <input type="text" placeholder="Telemóvel">
                </div>
            </div>
        `;
    }

    if (method === "multibanco") {
        box.innerHTML = `
            <div class= "multibanco-box">
                <div class="input-row MB">
                    <label>Quantidade:</label>
                    <div class="qty-box">
                        <button onclick="changeQty(-1)">-</button>
                        <span id="qty">1</span>
                        <button onclick="changeQty(1)">+</button>
                    </div>
                </div>

                <div class="input-row MB">
                    <p>Entidade: <span>00000</span></p>
                </div>

                <div class="input-row MB">
                    <p>Referência: <span>00000</span></p>
                </div>
            </div>
        `;
    }
}

function changeQty(val) {
    let qty = document.getElementById("qty");
    let num = parseInt(qty.innerText);

    num += val;
    if (num < 1) num = 1;

    qty.innerText = num;
}
