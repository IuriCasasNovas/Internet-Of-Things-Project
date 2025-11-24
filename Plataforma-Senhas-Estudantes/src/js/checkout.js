let currentMethod = null;

function selectMethod(method) {
    currentMethod = method;
    const box = document.getElementById("detailsBox");
    const methodsDivs = document.querySelectorAll('.method');

    methodsDivs.forEach(div => div.classList.remove('selected'));
    
    if(method === 'mbway') document.querySelector('.method.MBW').classList.add('selected');
    if(method === 'multibanco') document.querySelector('.method.MB').classList.add('selected');

    if (method === "mbway") {
        box.innerHTML = `
            <div class="mbway-box">
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
                    <input type="tel" id="mbway-phone" placeholder="9xxxxxxxx" maxlength="9" style="padding: 10px; width: 100%; border: 1px solid #ddd; border-radius: 5px;">
                </div>
            </div>
        `;
    }

    if (method === "multibanco") {
        box.innerHTML = `
            <div class="multibanco-box">
                <div class="input-row MB">
                    <label>Quantidade:</label>
                    <div class="qty-box">
                        <button onclick="changeQty(-1)">-</button>
                        <span id="qty">1</span>
                        <button onclick="changeQty(1)">+</button>
                    </div>
                </div>
                <div class="input-row MB">
                    <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                        Ao clicar em pagar, será gerada uma referência Multibanco.
                    </p>
                </div>
            </div>
        `;
    }
}


function changeQty(val) {
    let qtySpan = document.getElementById("qty");
    if (!qtySpan) return;
    
    let num = parseInt(qtySpan.innerText);
    num += val;
    if (num < 1) num = 1;
    if (num > 10) num = 10;
    
    qtySpan.innerText = num;
}

document.addEventListener('DOMContentLoaded', () => {
    const payBtn = document.querySelector('.pay-btn');

    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            
            if (!currentMethod) {
                alert("Por favor, selecione um método de pagamento (MB WAY ou Multibanco).");
                return;
            }

            const qtySpan = document.getElementById("qty");
            const quantidade = qtySpan ? parseInt(qtySpan.innerText) : 1;
            let telemovel = null;

            if (currentMethod === 'mbway') {
                const phoneInput = document.getElementById('mbway-phone');
                telemovel = phoneInput ? phoneInput.value : '';
                
                if (!telemovel || telemovel.length !== 9 || isNaN(telemovel)) {
                    alert("Por favor, insira um número de telemóvel válido (9 dígitos).");
                    return;
                }
            }

            payBtn.disabled = true;
            payBtn.textContent = "A processar...";

            const dadosCompra = {
                quantidade: quantidade,
                metodo: currentMethod,
                telemovel: telemovel
            };

            try {
                const response = await fetch('../api/comprar.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosCompra)
                });

                const data = await response.json();

                if (response.ok) {
                    if (currentMethod === 'multibanco') {
                        alert(`✅ Compra registada!\n\nUtilize estes dados para pagar:\n\nEntidade: ${data.entidade}\nReferência: ${data.referencia}\nValor: ${data.valor}€`);
                    } else {
                        alert(`✅ Pedido enviado!\n\nVerifique o seu telemóvel (${telemovel}) e aceite o pagamento na app MB WAY.`);
                    }
                    
                    window.location.href = '../pages/dashboard.html';
                } else {
                    alert("Erro: " + data.message);
                    payBtn.disabled = false;
                    payBtn.textContent = "Pagar";
                }

            } catch (error) {
                console.error('Erro:', error);
                alert("Erro de rede. Verifique a sua conexão.");
                payBtn.disabled = false;
                payBtn.textContent = "Pagar";
            }
        });
    }
});