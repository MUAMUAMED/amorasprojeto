/**
 * Google Apps Script MODO LEGACY - Sistema de Cadastro de Roupas
 * 
 * Esta versão usa APIs básicas que não precisam de configuração do Google Cloud Console
 * 
 * INSTRUÇÕES:
 * 1. Cole este código substituindo TUDO
 * 2. Execute autorizarBasico() primeiro
 * 3. Execute testarSistema() depois
 * 4. Se funcionar, publique como Web App
 */

// ===== CONFIGURAÇÕES =====
const PLANILHA_ID = '1SRKgYj_DmkMkhgKduXO55u-OM1i7G-6QUHKku6QPv24';
const PASTA_DRIVE_ID = '1zbLbzYRkTAYj7t8NNzZESsLVKtl_i-G9';
const NOME_ABA = 'Roupas';

/**
 * FUNÇÃO 1: AUTORIZAÇÃO BÁSICA - EXECUTE PRIMEIRO!
 * Esta função usa apenas APIs básicas que sempre funcionam
 */
function autorizarBasico() {
  console.log('🔑 Iniciando autorização básica...');
  
  try {
    // Teste básico do SpreadsheetApp
    console.log('📊 Testando SpreadsheetApp...');
    const testePlanilha = SpreadsheetApp.openById(PLANILHA_ID);
    console.log('✅ Planilha acessada:', testePlanilha.getName());
    console.log('📋 URL:', testePlanilha.getUrl());
    
    // Teste básico do DriveApp
    console.log('📁 Testando DriveApp...');
    const testePasta = DriveApp.getFolderById(PASTA_DRIVE_ID);
    console.log('✅ Pasta acessada:', testePasta.getName());
    
    // Teste de escrita na planilha
    console.log('✏️ Testando escrita...');
    let aba = testePlanilha.getSheetByName(NOME_ABA);
    if (!aba) {
      aba = testePlanilha.insertSheet(NOME_ABA);
      console.log('📝 Nova aba criada:', NOME_ABA);
    }
    
    // Teste de escrita no Drive
    console.log('💾 Testando upload...');
    const arquivoTeste = testePasta.createFile('teste-permissao.txt', 'Teste de autorização - ' + new Date());
    console.log('✅ Arquivo teste criado:', arquivoTeste.getName());
    
    // Limpar arquivo teste
    arquivoTeste.setTrashed(true);
    console.log('🗑️ Arquivo teste removido');
    
    console.log('🎉 AUTORIZAÇÃO BÁSICA COMPLETA!');
    console.log('➡️ Agora execute: testarSistema()');
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro na autorização:', error.message);
    console.log('🔓 Clique em "Autorizar" se aparecer uma janela popup');
    console.log('🔓 Conceda TODAS as permissões solicitadas');
    return false;
  }
}

/**
 * FUNÇÃO 2: TESTAR SISTEMA COMPLETO
 */
function testarSistema() {
  console.log('🧪 Iniciando teste do sistema...');
  
  try {
    // Acessar planilha
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    console.log('✅ Planilha OK:', planilha.getName());
    
    // Verificar/criar aba
    let aba = planilha.getSheetByName(NOME_ABA);
    if (!aba) {
      aba = planilha.insertSheet(NOME_ABA);
      
      // Criar cabeçalhos
      const cabecalhos = [
        'Data/Hora', 'Nome da Roupa', 'Categoria', 
        'Estampa', 'Tamanho', 'Quantidade', 'Foto (Link)'
      ];
      
      aba.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
      
      // Formatar cabeçalhos
      const rangeHeader = aba.getRange(1, 1, 1, cabecalhos.length);
      rangeHeader.setFontWeight('bold');
      rangeHeader.setBackground('#4285f4');
      rangeHeader.setFontColor('white');
      
      console.log('✅ Aba criada com cabeçalhos formatados');
    } else {
      console.log('✅ Aba já existe:', NOME_ABA);
    }
    
    // Teste de inserção
    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR');
    const dadosTeste = [
      dataHora,
      'Roupa Teste ' + agora.getTime(),
      'Camiseta',
      'Lisa',
      'M',
      1,
      'https://drive.google.com/file/d/exemplo/view'
    ];
    
    const proximaLinha = aba.getLastRow() + 1;
    aba.getRange(proximaLinha, 1, 1, dadosTeste.length).setValues([dadosTeste]);
    console.log('✅ Dados de teste inseridos na linha:', proximaLinha);
    
    // Testar pasta do Drive
    const pasta = DriveApp.getFolderById(PASTA_DRIVE_ID);
    console.log('✅ Pasta Drive OK:', pasta.getName());
    
    console.log('🎉 SISTEMA TESTADO COM SUCESSO!');
    console.log('📊 Verifique sua planilha:', planilha.getUrl());
    console.log('📁 Verifique sua pasta:', 'https://drive.google.com/drive/folders/' + PASTA_DRIVE_ID);
    console.log('🚀 Agora você pode publicar como Web App!');
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
    return false;
  }
}

/**
 * FUNÇÃO 3: doPost - Receber dados do frontend
 */
function doPost(e) {
  try {
    console.log('📨 Requisição recebida');
    console.log('🔍 Verificando estrutura da requisição...');
    
    let dados;
    
    // Tentativa 1: Dados JSON no postData
    if (e && e.postData && e.postData.contents) {
      try {
        dados = JSON.parse(e.postData.contents);
        console.log('✅ Dados JSON recebidos:', dados.nome || 'sem nome', dados.categoria || 'sem categoria');
      } catch (parseError) {
        console.log('⚠️ Erro ao interpretar JSON:', parseError.message);
        console.log('📄 Conteúdo recebido:', e.postData.contents.substring(0, 200) + '...');
      }
    }
    
    // Tentativa 2: Dados em parameters (FormData)
    if (!dados && e && e.parameter) {
      console.log('🔄 Tentando ler como FormData...');
      dados = {
        nome: e.parameter.nome,
        categoria: e.parameter.categoria,
        estampa: e.parameter.estampa,
        tamanho: e.parameter.tamanho,
        quantidade: parseInt(e.parameter.quantidade) || 0,
        foto: {
          name: e.parameter.foto_name,
          type: e.parameter.foto_type,
          data: e.parameter.foto_data
        },
        timestamp: e.parameter.timestamp || new Date().toISOString()
      };
      console.log('✅ Dados FormData convertidos:', dados.nome, dados.categoria);
    }
    
    // Se ainda não temos dados
    if (!dados) {
      console.log('❌ Nenhum dado foi identificado');
      console.log('🔍 Estrutura da requisição:', JSON.stringify(e, null, 2));
      return criarResposta({
        success: false,
        error: 'Nenhum dado foi enviado ou formato inválido'
      });
    }
    
    // Validar campos obrigatórios
    const camposObrigatorios = ['nome', 'categoria', 'estampa', 'tamanho', 'quantidade'];
    for (const campo of camposObrigatorios) {
      if (!dados[campo]) {
        console.log(`❌ Campo obrigatório ausente: ${campo}`);
        return criarResposta({
          success: false,
          error: `Campo obrigatório: ${campo}`
        });
      }
    }
    
    // Validar dados da foto
    console.log('🔍 Validando dados da foto...');
    if (!dados.foto) {
      console.log('❌ Dados da foto ausentes');
      return criarResposta({
        success: false,
        error: 'Foto é obrigatória'
      });
    }
    
    if (!dados.foto.data) {
      console.log('❌ Dados base64 da foto ausentes');
      return criarResposta({
        success: false,
        error: 'Dados da foto inválidos (sem base64)'
      });
    }
    
    console.log('✅ Validação da foto OK');
    
    // Upload da foto
    console.log('📸 Fazendo upload da foto...');
    const urlFoto = uploadFotoBasico(dados.foto);
    console.log('✅ Foto uploaded:', urlFoto);
    
    // Inserir na planilha
    console.log('📝 Inserindo dados na planilha...');
    const resultado = inserirNaPlanilha(dados, urlFoto);
    
    if (resultado.success) {
      console.log('✅ Roupa cadastrada com sucesso na linha:', resultado.linha);
      return criarResposta({
        success: true,
        message: 'Roupa cadastrada com sucesso!',
        data: {
          linha: resultado.linha,
          urlFoto: urlFoto
        }
      });
    } else {
      console.log('❌ Erro ao inserir na planilha:', resultado.error);
      return criarResposta({
        success: false,
        error: 'Erro ao salvar: ' + resultado.error
      });
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return criarResposta({
      success: false,
      error: 'Erro interno: ' + error.message
    });
  }
}

/**
 * FUNÇÃO 4: Upload básico de foto
 */
function uploadFotoBasico(dadosFoto) {
  try {
    console.log('📸 Iniciando upload da foto...');
    
    // Validar se os dados da foto existem
    if (!dadosFoto) {
      throw new Error('Dados da foto não fornecidos');
    }
    
    console.log('🔍 Verificando estrutura da foto...');
    console.log('📄 Propriedades disponíveis:', Object.keys(dadosFoto));
    
    if (!dadosFoto.data) {
      throw new Error('Dados base64 da foto não encontrados (propriedade "data" ausente)');
    }
    
    if (!dadosFoto.type) {
      console.log('⚠️ Tipo da foto não especificado, assumindo image/jpeg');
      dadosFoto.type = 'image/jpeg';
    }
    
    if (!dadosFoto.name) {
      console.log('⚠️ Nome da foto não especificado, gerando nome automático');
      const timestamp = new Date().getTime();
      dadosFoto.name = `foto_${timestamp}.jpg`;
    }
    
    console.log('✅ Dados da foto validados:');
    console.log('   - Nome:', dadosFoto.name);
    console.log('   - Tipo:', dadosFoto.type);
    console.log('   - Tamanho dos dados:', dadosFoto.data.length, 'caracteres');
    
    // Limpar dados base64 (remover prefixo se existir)
    let dadosLimpos = dadosFoto.data;
    if (dadosLimpos.includes('base64,')) {
      dadosLimpos = dadosLimpos.split('base64,')[1];
      console.log('🧹 Prefixo base64 removido');
    }
    
    // Converter base64 para blob
    console.log('🔄 Convertendo base64 para blob...');
    const blob = Utilities.newBlob(
      Utilities.base64Decode(dadosLimpos),
      dadosFoto.type,
      dadosFoto.name
    );
    
    console.log('✅ Blob criado, tamanho:', blob.getBytes().length, 'bytes');
    
    // Pasta de destino
    console.log('📁 Acessando pasta do Drive...');
    const pasta = DriveApp.getFolderById(PASTA_DRIVE_ID);
    console.log('✅ Pasta acessada:', pasta.getName());
    
    // Nome único para o arquivo
    const timestamp = new Date().getTime();
    const extensao = dadosFoto.name.split('.').pop() || 'jpg';
    const nomeArquivo = `roupa_${timestamp}.${extensao}`;
    
    console.log('💾 Criando arquivo:', nomeArquivo);
    
    // Criar arquivo
    const arquivo = pasta.createFile(blob.setName(nomeArquivo));
    console.log('✅ Arquivo criado com ID:', arquivo.getId());
    
    // Tornar público
    console.log('🌐 Tornando arquivo público...');
    arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Retornar URL
    const url = `https://drive.google.com/file/d/${arquivo.getId()}/view`;
    console.log('✅ Upload concluído, URL:', url);
    
    return url;
    
  } catch (error) {
    console.log('❌ Erro no upload:', error.message);
    console.log('🔍 Dados recebidos:', JSON.stringify(dadosFoto, null, 2));
    throw new Error('Falha no upload da foto: ' + error.message);
  }
}

/**
 * FUNÇÃO 5: Inserir dados na planilha
 */
function inserirNaPlanilha(dados, urlFoto) {
  try {
    // Abrir planilha
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    let aba = planilha.getSheetByName(NOME_ABA);
    
    // Criar aba se não existir
    if (!aba) {
      aba = planilha.insertSheet(NOME_ABA);
      
      // Cabeçalhos
      const cabecalhos = [
        'Data/Hora', 'Nome da Roupa', 'Categoria', 
        'Estampa', 'Tamanho', 'Quantidade', 'Foto (Link)'
      ];
      
      aba.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
      
      // Formatação
      const rangeHeader = aba.getRange(1, 1, 1, cabecalhos.length);
      rangeHeader.setFontWeight('bold');
      rangeHeader.setBackground('#4285f4');
      rangeHeader.setFontColor('white');
    }
    
    // Preparar dados
    const dataHora = new Date().toLocaleString('pt-BR');
    const novaLinha = [
      dataHora,
      dados.nome,
      dados.categoria,
      dados.estampa,
      dados.tamanho,
      dados.quantidade,
      urlFoto
    ];
    
    // Inserir
    const proximaLinha = aba.getLastRow() + 1;
    aba.getRange(proximaLinha, 1, 1, novaLinha.length).setValues([novaLinha]);
    
    // Auto-ajustar colunas
    aba.autoResizeColumns(1, novaLinha.length);
    
    return {
      success: true,
      linha: proximaLinha
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * FUNÇÃO 6: Criar resposta com CORS (Compatível com Legacy)
 */
function criarResposta(data) {
  try {
    const response = ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
    
    // No modo legacy, não usamos setHeaders(), o CORS é configurado na publicação
    console.log('✅ Resposta criada:', response);
    return response;
    
  } catch (error) {
    console.log('❌ Erro ao criar resposta:', error.message);
    
    // Fallback básico se houver problema
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Erro interno: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * FUNÇÃO 7: doOptions - Lidar com requisições CORS preflight
 */
function doOptions(e) {
  console.log('🔄 Requisição OPTIONS recebida (CORS preflight)');
  
  // No modo legacy, retornamos uma resposta simples
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * FUNÇÃO 8: doGet - Página de status
 */
function doGet() {
  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 30px; 
            max-width: 600px; 
            margin: 0 auto;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .status { 
            padding: 15px; 
            border-radius: 8px; 
            margin: 15px 0; 
            font-weight: 500;
          }
          .success { 
            background: #d4edda; 
            color: #155724; 
            border-left: 4px solid #28a745;
          }
          .info { 
            background: #d1ecf1; 
            color: #0c5460; 
            border-left: 4px solid #17a2b8;
          }
          h2 { color: #333; margin-bottom: 20px; }
          .links { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .links a { color: #856404; text-decoration: none; font-weight: bold; }
          .links a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🚀 Sistema de Cadastro de Roupas</h2>
          
          <div class="status success">
            <strong>Status:</strong> ✅ Script funcionando em modo básico
          </div>
          
          <div class="status info">
            <strong>Última verificação:</strong> ${new Date().toLocaleString('pt-BR')}
          </div>
          
          <div class="status info">
            <strong>Modo:</strong> Legacy (sem dependências do Google Cloud Console)
          </div>
          
          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
          
          <h3>📊 Configurações Atuais:</h3>
          <ul>
            <li><strong>Planilha ID:</strong> ${PLANILHA_ID}</li>
            <li><strong>Pasta Drive ID:</strong> ${PASTA_DRIVE_ID}</li>
            <li><strong>Nome da Aba:</strong> ${NOME_ABA}</li>
          </ul>
          
          <div class="links">
            <h3>🔗 Links Úteis:</h3>
            <p>📊 <a href="https://docs.google.com/spreadsheets/d/${PLANILHA_ID}/edit" target="_blank">Abrir Planilha</a></p>
            <p>📁 <a href="https://drive.google.com/drive/folders/${PASTA_DRIVE_ID}" target="_blank">Abrir Pasta de Fotos</a></p>
          </div>
          
          <h3>⚡ Recursos Habilitados:</h3>
          <ul>
            <li>✅ CORS configurado</li>
            <li>✅ Upload de imagens</li>
            <li>✅ Inserção no Google Sheets</li>
            <li>✅ Modo básico (sem APIs avançadas)</li>
            <li>✅ Logs detalhados</li>
          </ul>
          
          <div class="status info">
            <strong>📝 Primeira execução:</strong> Execute <code>autorizarBasico()</code> e depois <code>testarSistema()</code>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * FUNÇÃO 9: Testar upload de foto isoladamente
 */
function testarUploadFoto() {
  console.log('🧪 Testando upload de foto...');
  
  // Imagem 1x1 pixel transparente em base64 (PNG)
  const fotoTeste = {
    name: 'teste_upload.png',
    type: 'image/png',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  };
  
  try {
    console.log('📋 Dados da foto teste:', fotoTeste);
    const url = uploadFotoBasico(fotoTeste);
    console.log('✅ Teste de upload bem-sucedido!');
    console.log('🔗 URL da foto:', url);
    return url;
  } catch (error) {
    console.log('❌ Teste de upload falhou:', error.message);
    return false;
  }
}

/**
 * FUNÇÃO 10: Testar doPost localmente
 */
function testarDoPost() {
  console.log('🧪 Testando função doPost...');
  
  // Simular dados do frontend
  const dadosSimulados = {
    postData: {
      contents: JSON.stringify({
        nome: 'Camiseta Teste',
        categoria: 'Camisetas',
        estampa: 'Floral',
        tamanho: 'M',
        quantidade: 3,
        foto: {
          name: 'teste.jpg',
          type: 'image/jpeg',
          data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        },
        timestamp: new Date().toISOString()
      })
    }
  };
  
  try {
    const resultado = doPost(dadosSimulados);
    console.log('✅ Teste doPost concluído');
    console.log('📤 Resposta:', resultado.getContent());
    return true;
  } catch (error) {
    console.log('❌ Erro no teste doPost:', error.message);
    return false;
  }
} 