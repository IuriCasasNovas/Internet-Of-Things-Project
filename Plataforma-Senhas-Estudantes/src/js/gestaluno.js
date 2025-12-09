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

document.addEventListener('DOMContentLoaded', () => carregarAlunos());



async function carregarAlunos(busca = '') {
    try {
        let url = '../api/alunos.php';
        if (busca) {
            url += `?busca=${encodeURIComponent(busca)}`;
        }

        const response = await fetch(url);
        const alunos = await response.json();

        const tbody = document.getElementById('tabela-alunos-corpo');
        tbody.innerHTML = '';

        if (!alunos || alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum aluno encontrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const isAtivo = aluno.estado_cartao === 'Ativo';
            const corestado = isAtivo ? '#00c851' : '#ff4444';
            const textoBotao = isAtivo ? 'Bloquear' : 'Desbloquear';

            const linha = `
                <tr>
                    <td>${aluno.Nome_Pessoa}</td>
                    <td>${aluno.Numero_Aluno}</td>
                    <td>${aluno.Curso_Aluno || 'N/A'}</td>
                    <td>
                        <span style="color: ${corestado}; font-size: 1.2em;">●</span> 
                        ${aluno.estado_cartao}
                    </td>
                    <td>${aluno.Total_Senhas}</td>
                    <td>
                        <button class="btn-bloquear" onclick="alterarestado(${aluno.Id_Aluno}, '${aluno.estado_cartao}')">
                            ${textoBotao}
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += linha;
        });

    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao carregar dados. Verifica o console."); 
    }
}

async function alterarestado(id, estadoAtual) {
    const acao = estadoAtual === 'Ativo' ? 'bloquear' : 'desbloquear';
    if (!confirm(`Tens a certeza que queres ${acao} este aluno?`)) return;

    try {
        const response = await fetch('../api/alterar_estado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, estado: estadoAtual })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            carregarAlunos(); 
        } else {
            alert('Erro: ' + (resultado.erro || 'Falha desconhecida'));
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de comunicação com o servidor.');
    }
}

async function abrirModalSenhas() {
    const modal = document.getElementById('modal-senhas');
    const select = document.getElementById('select-aluno-senhas');
    
    modal.style.display = 'flex';

    try {
        const response = await fetch('../api/alunos.php');
        const alunos = await response.json();
        
        select.innerHTML = '<option value="">Selecione um aluno...</option>';
        
        alunos.forEach(aluno => {
            if(aluno.estado_cartao === 'Ativo') {
                const option = document.createElement('option');
                option.value = aluno.Id_Aluno;
                option.textContent = `${aluno.Nome_Pessoa} (${aluno.Numero_Aluno})`;
                select.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Erro ao carregar alunos para o dropdown", error);
    }
}

async function confirmarAdicaoSenhas() {
    const idAluno = document.getElementById('select-aluno-senhas').value;
    const qtd = document.getElementById('qtd-senhas').value;

    if (!idAluno || qtd <= 0) {
        alert("Por favor selecione um aluno e uma quantidade válida.");
        return;
    }

    try {
        
        const response = await fetch('../api/adicionar_senha.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_aluno: idAluno, quantidade: qtd })
        });
        
        const resultado = await response.json();

        if (resultado.sucesso) {
            alert(resultado.mensagem);
            document.getElementById('modal-senhas').style.display = 'none';
            carregarAlunos();
        } else {
            alert("Erro: " + resultado.erro);
        }

    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

const btnAddGlobal = document.getElementById('btn-add-senha-global');
if (btnAddGlobal) {
    btnAddGlobal.addEventListener('click', abrirModalSenhas);
}

const btnCancelarSenhas = document.getElementById('btn-cancelar-senhas');
if (btnCancelarSenhas) {
    btnCancelarSenhas.addEventListener('click', () => {
        document.getElementById('modal-senhas').style.display = 'none';
    });
}

const btnConfirmarSenhas = document.getElementById('btn-confirmar-senhas');
if (btnConfirmarSenhas) {
    btnConfirmarSenhas.addEventListener('click', confirmarAdicaoSenhas);
}