/**
 * Google Apps Script para Sistema de Cadastro de Roupas
 * 
 * Este script deve ser criado no Google Apps Script (script.google.com)
 * e publicado como Web App para ser acessado pelo frontend.
 * 
 * Configurações necessárias:
 * 1. Ativar APIs: Google Drive, Google Sheets
 * 2. Configurar as variáveis abaixo com seus IDs
 * 3. Publicar como Web App com acesso "Qualquer pessoa"
 */

// ===== CONFIGURAÇÕES - PREENCHA COM SEUS IDs =====
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // ID da sua planilha do Google Sheets
const DRIVE_FOLDER_ID = 'SEU_DRIVE_FOLDER_ID_AQUI'; // ID da pasta no Google Drive para as fotos
const SHEET_NAME = 'Roupas'; // Nome da aba na planilha

/**
 * Função principal que recebe as requisições POST
 */
function doPost(e) {
  try {
    // Configurar CORS
    const response = {
      success: false,
      message: '',
      error: null
    };

    // Verificar se há dados
    if (!e || !e.postData) {
      response.error = 'Nenhum dado recebido';
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse dos dados JSON
    const dados = JSON.parse(e.postData.contents);
    
    // Validar dados obrigatórios
    if (!validarDados(dados)) {
      response.error = 'Dados obrigatórios não fornecidos';
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Processar upload da foto
    const urlFoto = uploadFotoParaDrive(dados.foto);
    
    // Inserir dados na planilha
    const resultado = inserirNaPlanilha({
      nome: dados.nome,
      categoria: dados.categoria,
      estampa: dados.estampa,
      tamanho: dados.tamanho,
      quantidade: dados.quantidade,
      urlFoto: urlFoto,
      timestamp: dados.timestamp || new Date().toISOString()
    });

    if (resultado.success) {
      response.success = true;
      response.message = 'Roupa cadastrada com sucesso!';
      response.data = {
        linha: resultado.linha,
        urlFoto: urlFoto
      };
    } else {
      response.error = resultado.error;
    }

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Erro no doPost:', error);
    
    const errorResponse = {
      success: false,
      error: `Erro interno: ${error.message}`,
      message: ''
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para validar os dados recebidos
 */
function validarDados(dados) {
  const camposObrigatorios = ['nome', 'categoria', 'estampa', 'tamanho', 'quantidade', 'foto'];
  
  for (const campo of camposObrigatorios) {
    if (!dados[campo]) {
      console.error(`Campo obrigatório não fornecido: ${campo}`);
      return false;
    }
  }

  // Validar estrutura da foto
  if (!dados.foto.data || !dados.foto.name || !dados.foto.type) {
    console.error('Estrutura da foto inválida');
    return false;
  }

  return true;
}

/**
 * Função para fazer upload da foto no Google Drive
 */
function uploadFotoParaDrive(dadosFoto) {
  try {
    // Converter base64 para blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(dadosFoto.data),
      dadosFoto.type,
      dadosFoto.name
    );

    // Obter pasta de destino
    const pasta = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Gerar nome único para evitar conflitos
    const timestamp = new Date().getTime();
    const extensao = dadosFoto.name.split('.').pop();
    const nomeUnico = `roupa_${timestamp}.${extensao}`;
    
    // Fazer upload do arquivo
    const arquivo = pasta.createFile(blob.setName(nomeUnico));
    
    // Tornar o arquivo publicamente visível
    arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Retornar URL de visualização
    return `https://drive.google.com/file/d/${arquivo.getId()}/view`;
    
  } catch (error) {
    console.error('Erro no upload da foto:', error);
    throw new Error(`Falha no upload da foto: ${error.message}`);
  }
}

/**
 * Função para inserir dados na planilha
 */
function inserirNaPlanilha(dados) {
  try {
    // Abrir a planilha
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    let aba = planilha.getSheetByName(SHEET_NAME);
    
    // Criar aba se não existir
    if (!aba) {
      aba = planilha.insertSheet(SHEET_NAME);
      
      // Adicionar cabeçalhos
      const cabecalhos = [
        'Data/Hora',
        'Nome da Roupa',
        'Categoria',
        'Estampa',
        'Tamanho',
        'Quantidade em Estoque',
        'Foto (Link)'
      ];
      
      aba.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
      
      // Formatar cabeçalhos
      const cabecalhoRange = aba.getRange(1, 1, 1, cabecalhos.length);
      cabecalhoRange.setFontWeight('bold');
      cabecalhoRange.setBackground('#4a90e2');
      cabecalhoRange.setFontColor('white');
    }

    // Preparar dados para inserção
    const dataHora = new Date(dados.timestamp).toLocaleString('pt-BR');
    const novaLinha = [
      dataHora,
      dados.nome,
      dados.categoria,
      dados.estampa,
      dados.tamanho,
      dados.quantidade,
      dados.urlFoto
    ];

    // Inserir nova linha
    const proximaLinha = aba.getLastRow() + 1;
    aba.getRange(proximaLinha, 1, 1, novaLinha.length).setValues([novaLinha]);
    
    // Auto-ajustar colunas
    aba.autoResizeColumns(1, novaLinha.length);

    return {
      success: true,
      linha: proximaLinha
    };

  } catch (error) {
    console.error('Erro ao inserir na planilha:', error);
    return {
      success: false,
      error: `Falha ao inserir na planilha: ${error.message}`
    };
  }
}

/**
 * Função para testar o script (opcional)
 */
function testarScript() {
  const dadosTeste = {
    nome: 'Camiseta Teste',
    categoria: 'Camiseta',
    estampa: 'Lisa',
    tamanho: 'M',
    quantidade: 5,
    foto: {
      name: 'teste.jpg',
      type: 'image/jpeg',
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' // 1x1 pixel transparente
    },
    timestamp: new Date().toISOString()
  };

  console.log('Iniciando teste...');
  
  try {
    const resultado = JSON.parse(doPost({
      postData: {
        contents: JSON.stringify(dadosTeste)
      }
    }).getContent());
    
    console.log('Resultado do teste:', resultado);
    
    if (resultado.success) {
      console.log('✅ Teste passou! Script funcionando corretamente.');
    } else {
      console.log('❌ Teste falhou:', resultado.error);
    }
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

/**
 * Função para configurar permissões iniciais
 */
function configurarPermissoes() {
  try {
    // Verificar acesso à planilha
    const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Acesso à planilha OK:', planilha.getName());
    
    // Verificar acesso à pasta do Drive
    const pasta = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    console.log('✅ Acesso à pasta do Drive OK:', pasta.getName());
    
    console.log('✅ Todas as permissões estão configuradas corretamente!');
    
  } catch (error) {
    console.error('❌ Erro de permissões:', error.message);
    console.log('Verifique se os IDs da planilha e pasta estão corretos.');
  }
}

/**
 * Função GET para verificar se o script está funcionando
 */
function doGet() {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>🔧 Sistema de Cadastro de Roupas - Google Apps Script</h2>
        <p><strong>Status:</strong> ✅ Script funcionando</p>
        <p><strong>Última atualização:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <hr>
        <h3>Configurações:</h3>
        <ul>
          <li><strong>Planilha ID:</strong> ${SPREADSHEET_ID}</li>
          <li><strong>Pasta Drive ID:</strong> ${DRIVE_FOLDER_ID}</li>
          <li><strong>Nome da Aba:</strong> ${SHEET_NAME}</li>
        </ul>
        <p><em>Este endpoint aceita requisições POST com dados de roupas.</em></p>
      </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html);
} 