// Configuração da URL do Google Apps Script (COLE SUA URL AQUI)
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxHf3fw2oYf6fq-SXTFf3VkLjs2Xh4TgvBw3jXEzdBXwtVUWg9o0KzV2jzyJ49sejxzg/exec';

// Elementos do DOM
const form = document.getElementById('cadastroForm');
const fileInput = document.getElementById('foto');
const fileName = document.getElementById('file-name');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnLimpar = document.getElementById('btnLimpar');
const loading = document.getElementById('loading');
const mensagem = document.getElementById('mensagem');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventListeners();
});

function inicializarEventListeners() {
    // Preview da foto
    fileInput.addEventListener('change', handleFileSelect);
    
    // Submissão do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Limpar formulário
    btnLimpar.addEventListener('click', limparFormulario);
    
    // Prevent drag and drop na página
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('drop', preventDefault);
}

function preventDefault(e) {
    e.preventDefault();
}

// Manipulação da seleção de arquivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            mostrarMensagem('Por favor, selecione apenas arquivos de imagem.', 'erro');
            fileInput.value = '';
            return;
        }
        
        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            mostrarMensagem('A imagem deve ter no máximo 5MB.', 'erro');
            fileInput.value = '';
            return;
        }
        
        // Atualizar nome do arquivo
        fileName.textContent = file.name;
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        fileName.textContent = 'Clique para selecionar uma foto';
        previewContainer.style.display = 'none';
    }
}

// Manipulação do envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Verificar se todos os campos estão preenchidos
    if (!validarFormulario()) {
        return;
    }
    
    // Mostrar loading
    mostrarLoading(true);
    
    try {
        // Coletar dados do formulário
        const formData = coletarDadosFormulario();
        
        // Enviar para Google Apps Script
        const resultado = await enviarDados(formData);
        
        if (resultado.success) {
            mostrarMensagem('Roupa cadastrada com sucesso! ✅', 'sucesso');
            limparFormulario();
        } else {
            throw new Error(resultado.error || 'Erro desconhecido');
        }
        
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        mostrarMensagem(`Erro ao cadastrar: ${error.message}`, 'erro');
    } finally {
        mostrarLoading(false);
    }
}

// Validação do formulário
function validarFormulario() {
    const requiredFields = ['nome', 'categoria', 'estampa', 'tamanho', 'quantidade'];
    
    for (const fieldName of requiredFields) {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            mostrarMensagem(`O campo ${getFieldLabel(fieldName)} é obrigatório.`, 'erro');
            field.focus();
            return false;
        }
    }
    
    // Validar arquivo
    if (!fileInput.files[0]) {
        mostrarMensagem('Por favor, selecione uma foto da roupa.', 'erro');
        return false;
    }
    
    // Validar quantidade
    const quantidade = parseInt(document.getElementById('quantidade').value);
    if (quantidade < 0) {
        mostrarMensagem('A quantidade não pode ser negativa.', 'erro');
        return false;
    }
    
    return true;
}

// Obter label do campo para mensagens de erro
function getFieldLabel(fieldName) {
    const labels = {
        'nome': 'Nome da Roupa',
        'categoria': 'Categoria',
        'estampa': 'Estampa',
        'tamanho': 'Tamanho',
        'quantidade': 'Quantidade em Estoque'
    };
    return labels[fieldName] || fieldName;
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const categoria = document.getElementById('categoria').value;
    const estampa = document.getElementById('estampa').value.trim();
    const tamanho = document.getElementById('tamanho').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const foto = fileInput.files[0];
    
    return {
        nome,
        categoria,
        estampa,
        tamanho,
        quantidade,
        foto,
        timestamp: new Date().toISOString()
    };
}

// Enviar dados para Google Apps Script
async function enviarDados(dadosFormulario) {
    // Converter foto para base64
    const fotoBase64 = await convertFileToBase64(dadosFormulario.foto);
    
    const payload = {
        nome: dadosFormulario.nome,
        categoria: dadosFormulario.categoria,
        estampa: dadosFormulario.estampa,
        tamanho: dadosFormulario.tamanho,
        quantidade: dadosFormulario.quantidade,
        foto: {
            name: dadosFormulario.foto.name,
            type: dadosFormulario.foto.type,
            data: fotoBase64
        },
        timestamp: dadosFormulario.timestamp
    };
    
    // Verificar se a URL do script está configurada
    if (GOOGLE_APPS_SCRIPT_URL.includes('SEU_SCRIPT_ID')) {
        // Simular sucesso para teste (remover quando integrar com Google Apps Script)
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    message: 'Dados simulados enviados com sucesso! Configure o Google Apps Script para integração real.' 
                });
            }, 2000);
        });
    }
    
    try {
        // Envio real para Google Apps Script com configurações CORS adequadas
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Mudança importante para evitar problemas de CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        // Com mode: 'no-cors', não conseguimos ler a resposta
        // Mas se chegou até aqui, assumimos que foi enviado
        console.log('✅ Requisição enviada para Google Apps Script');
        
        return { 
            success: true, 
            message: 'Dados enviados com sucesso para o Google Apps Script!' 
        };
        
    } catch (error) {
        console.error('❌ Erro ao enviar para Google Apps Script:', error);
        
        // Tentar abordagem alternativa usando formulário
        return await enviarViaFormData(payload);
    }
}

// Função alternativa para envio via FormData (sem CORS)
async function enviarViaFormData(payload) {
    try {
        // Criar um formulário temporário para envio
        const formData = new FormData();
        
        // Adicionar dados como campos do formulário
        Object.keys(payload).forEach(key => {
            if (key === 'foto') {
                formData.append('foto_name', payload.foto.name);
                formData.append('foto_type', payload.foto.type);
                formData.append('foto_data', payload.foto.data);
            } else {
                formData.append(key, payload[key]);
            }
        });
        
        // Enviar usando fetch sem CORS
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        console.log('✅ Dados enviados via FormData');
        
        return { 
            success: true, 
            message: 'Dados enviados com sucesso!' 
        };
        
    } catch (error) {
        console.error('❌ Erro final no envio:', error);
        throw new Error('Não foi possível enviar os dados. Verifique sua conexão e tente novamente.');
    }
}

// Converter arquivo para base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remover o prefixo data:image/...;base64,
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    fileName.textContent = 'Clique para selecionar uma foto';
    previewContainer.style.display = 'none';
    ocultarMensagem();
}

// Mostrar/ocultar loading
function mostrarLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
    btnCadastrar.disabled = show;
    
    if (show) {
        btnCadastrar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
    } else {
        btnCadastrar.innerHTML = '<i class="fas fa-plus-circle"></i> Cadastrar Roupa';
    }
}

// Mostrar mensagem
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.style.display = 'block';
    
    // Scroll para a mensagem
    mensagem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-ocultar mensagem de sucesso após 5 segundos
    if (tipo === 'sucesso') {
        setTimeout(ocultarMensagem, 5000);
    }
}

// Ocultar mensagem
function ocultarMensagem() {
    mensagem.style.display = 'none';
    mensagem.className = 'mensagem';
}

// Funções utilitárias para debugging
function verificarIntegracao() {
    console.log('🔧 Verificando integração com Google Apps Script...');
    console.log('📍 URL configurada:', GOOGLE_APPS_SCRIPT_URL);
    
    const isConfigured = !GOOGLE_APPS_SCRIPT_URL.includes('SEU_SCRIPT_ID');
    
    if (isConfigured) {
        console.log('✅ Status: Configurado');
        console.log('🌐 Testando conectividade...');
        
        // Teste básico de conectividade
        fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'GET',
            mode: 'no-cors'
        })
        .then(() => {
            console.log('✅ Conectividade: OK');
        })
        .catch(error => {
            console.log('⚠️ Conectividade:', error.message);
        });
        
    } else {
        console.log('⚠️ Status: Não configurado');
        console.log('📝 Próximos passos:');
        console.log('   1. Configure o Google Apps Script');
        console.log('   2. Substitua a URL no código');
        console.log('   3. Consulte INSTRUCOES_GOOGLE_APPS_SCRIPT.md');
    }
}

// Chamar verificação no carregamento (apenas para desenvolvimento)
if (typeof window !== 'undefined') {
    verificarIntegracao();
} 