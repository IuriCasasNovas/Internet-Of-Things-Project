let ficheiroSelecionado = null;

function updateProfilePictures(fotoPath) {
    let path = '../img/default-profile.png';

    if (fotoPath && fotoPath.trim() !== '') {
        let cleanPath = fotoPath.replace(/^\//, '');
        if (!cleanPath.includes('/')) {
            path = '../uploads/profiles/' + cleanPath;
        } else {
            if (cleanPath.startsWith('../')) {
                path = cleanPath;
            } else {
                path = '../' + cleanPath;
            }
        }
    }

    const profilePics = document.querySelectorAll('#profile-pic, #profile-pic-footer');
    profilePics.forEach(pic => {
        if (pic) pic.src = path;
    });
}

function updateUI(user) {
    try {
        const primeiroNome = user.nome.split(' ')[0];

        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = user.nome;

        const footerUsername = document.getElementById('footer-username');
        if (footerUsername) footerUsername.textContent = user.nome;

        updateProfilePictures(user.foto);

    } catch (error) {
        console.error("Erro ao atualizar a UI:", error, user);
    }
}

async function handleLogout() {
    try {
        const response = await fetch('../api/logout.php', { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
            console.log('Logout bem-sucedido. Redirecionando...');
            window.location.href = data.redirectTo;
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

async function uploadProfilePic(file) {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
        const response = await fetch('../api/upload.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Upload bem-sucedido:', data.message);
            updateProfilePictures(data.newPath);
            document.getElementById('confirm-modal').style.display = 'none';
            ficheiroSelecionado = null;
        } else {
            alert(`Erro no upload: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro de rede ao enviar a foto:', error);
        alert('Erro de rede ao enviar a foto. Tente novamente.');
    }
}

function attachEventListeners() {
    const profilePic = document.getElementById('profile-pic');
    const logoutButton = document.getElementById('logout-button');
    const footerLogout = document.getElementById('footer-logout');
    const uploadModal = document.getElementById('upload-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const confirmUploadBtn = document.getElementById('confirm-upload');
    const cancelUpload1Btn = document.getElementById('cancel-upload-1');
    const cancelUpload2Btn = document.getElementById('cancel-upload-2');
    const inputPesquisa = document.querySelector('input[type="search"]') || document.getElementById('inputPesquisa');

    if (inputPesquisa) {
        inputPesquisa.addEventListener('keyup', (e) => {
            carregarAlunos(e.target.value);
        });
    }

    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (footerLogout) {
        footerLogout.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    if (profilePic) {
        profilePic.style.cursor = 'pointer';
        profilePic.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'flex';
        });
    }

    if (cancelUpload1Btn) {
        cancelUpload1Btn.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'none';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                ficheiroSelecionado = file;
                previewImage.src = URL.createObjectURL(file);
                if (uploadModal) uploadModal.style.display = 'none';
                if (confirmModal) confirmModal.style.display = 'flex';
            }
        });
    }

    if (cancelUpload2Btn) {
        cancelUpload2Btn.addEventListener('click', () => {
            if (confirmModal) confirmModal.style.display = 'none';
            if (uploadModal) uploadModal.style.display = 'flex';
            ficheiroSelecionado = null;
            fileInput.value = null;
        });
    }

    if (confirmUploadBtn) {
        confirmUploadBtn.addEventListener('click', () => {
            if (ficheiroSelecionado) {
                uploadProfilePic(ficheiroSelecionado);
            }
        });
    }
}

async function initDashboard() {
    try {
        const response = await fetch('../api/me.php');
        if (!response.ok) {
            window.location.href = '/pages/login.html';
            return;
        }

        const data = await response.json();
        updateUI(data.user);

        attachEventListeners();

    } catch (error) {
        console.error('Falha ao inicializar o dashboard:', error);
        window.location.href = '/pages/login.html';
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
document.addEventListener('DOMContentLoaded', () => {
    if(typeof initDashboard === 'function') initDashboard();

    initFiltros(); 
    
    carregarRelatorio(); 
});

function initFiltros() {
    const selMes = document.getElementById('filtro-mes');
    const selAno = document.getElementById('filtro-ano');
    
    if(!selMes || !selAno) return;

    const meses = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    meses.forEach((m, i) => selMes.add(new Option(m, i === 0 ? '' : i)));

    const anoAtual = new Date().getFullYear();
    selAno.add(new Option('Todos', ''));
    for(let i=anoAtual; i>=anoAtual-5; i--) selAno.add(new Option(i, i));

    selMes.addEventListener('change', carregarRelatorio);
    selAno.addEventListener('change', carregarRelatorio);
}

async function carregarRelatorio() {
    const mes = document.getElementById('filtro-mes').value;
    const ano = document.getElementById('filtro-ano').value;
    const tbody = document.getElementById('tabela-relatorio-corpo');
    
    if(tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">A carregar dados...</td></tr>';

    try {
        const res = await fetch(`../api/relatorio.php?mes=${mes}&ano=${ano}`);
        const data = await res.json();
        
        if(data.sucesso) {
            document.getElementById('rel-receita').textContent = parseFloat(data.resumo.receita_total).toFixed(2) + ' €';
            document.getElementById('rel-qtd').textContent = data.resumo.total_senhas_vendidas;
            
            if(tbody) {
                tbody.innerHTML = '';
                if(data.historico.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Sem vendas neste período.</td></tr>';
                } else {
                    data.historico.forEach(h => {
                        const dataFormatada = new Date(h.Data_Hora_Compra).toLocaleDateString('pt-PT');
                        tbody.innerHTML += `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding:12px;">${dataFormatada}</td>
                                <td style="padding:12px;">
                                    <strong>${h.Nome_Pessoa}</strong><br>
                                    <small style="color:#888">${h.Numero_Aluno}</small>
                                </td>
                                <td style="padding:12px;">${h.qtd_senhas}</td>
                                <td style="padding:12px; color:green; font-weight:bold;">${h.Valor_Total_Compra} €</td>
                            </tr>`;
                    });
                }
            }
        }
    } catch(e) { 
        console.error("Erro relatório:", e); 
        if(tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red">Erro ao carregar.</td></tr>';
    }
}