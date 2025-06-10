# 🔧 Instruções para Configurar Google Apps Script

## ❌ Problema Atual
Os erros de CORS que você está enfrentando acontecem porque:
1. O Google Apps Script não está configurado para aceitar requisições do seu domínio
2. Os cabeçalhos CORS não estão sendo enviados corretamente
3. A configuração de permissões do script não está adequada

## ✅ Solução Completa

### Passo 1: Criar/Configurar o Google Apps Script

1. **Acesse o Google Apps Script:**
   - Vá para https://script.google.com/
   - Faça login com sua conta Google

2. **Crie um novo projeto:**
   - Clique em "Novo projeto"
   - Renomeie para "API Estoque Amoras"

3. **Cole o código:**
   - Apague o código padrão
   - Cole todo o conteúdo do arquivo `google-apps-script-example.js`

### Passo 2: Configurar Google Sheets

1. **Crie uma planilha:**
   - Acesse https://sheets.google.com/
   - Crie uma nova planilha
   - Renomeie para "Estoque Amoras"

2. **Copie o ID da planilha:**
   - Na URL da planilha, copie o ID (parte longa no meio da URL)
   - Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - O ID seria: `1ABC123DEF456GHI789JKL`

3. **Configure o script:**
   - Volte ao Google Apps Script
   - Substitua `SEU_SPREADSHEET_ID_AQUI` pelo ID da sua planilha

### Passo 3: Publicar como Aplicação Web

1. **No Google Apps Script, clique em "Implantar" > "Nova implantação"**

2. **Configure a implantação:**
   - Tipo: "Aplicativo da web"
   - Descrição: "API para estoque de roupas"
   - Executar como: "Eu"
   - Quem tem acesso: "Qualquer pessoa" (IMPORTANTE!)

3. **Clique em "Implantar"**

4. **Copie a URL da aplicação web** (será algo como: `https://script.google.com/macros/s/ABC123.../exec`)

### Passo 4: Atualizar o Código Frontend

1. **No arquivo `script.js`, linha 2:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'SUA_URL_AQUI';
   ```
   - Substitua pela URL que você copiou no passo anterior

### Passo 5: Testar a Integração

1. **Teste direto no navegador:**
   - Acesse sua URL do Google Apps Script diretamente
   - Deve retornar: `{"status":"API funcionando!",...}`

2. **Teste o formulário:**
   - Preencha o formulário na sua aplicação
   - Verifique se os dados aparecem na planilha

## 🛠️ Alterações Feitas no Código

### Frontend (`script.js`)

1. **Mudança na configuração CORS:**
   ```javascript
   // Antes (causava erro)
   mode: 'cors'
   
   // Depois (resolve CORS)
   mode: 'no-cors'
   ```

2. **Fallback com FormData:**
   - Se a primeira tentativa falhar, tenta enviar via FormData
   - Mais compatível com Google Apps Script

3. **Melhor tratamento de erros:**
   - Logs mais detalhados
   - Mensagens de erro mais claras

### Backend (Google Apps Script)

1. **Cabeçalhos CORS adequados:**
   ```javascript
   'Access-Control-Allow-Origin': '*'
   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
   'Access-Control-Allow-Headers': 'Content-Type'
   ```

2. **Suporte a requisições OPTIONS:**
   - Necessário para preflight CORS

3. **Processamento flexível:**
   - Aceita tanto JSON quanto FormData

## 🔍 Verificação de Problemas

### Se ainda houver erros:

1. **Verifique as permissões:**
   - No Google Apps Script: Implantar > Gerenciar implantações
   - Certifique-se que está como "Qualquer pessoa"

2. **Verifique a URL:**
   - A URL deve terminar com `/exec`
   - Não deve conter `/dev`

3. **Teste no console:**
   ```javascript
   // Cole no console do navegador
   fetch('SUA_URL_DO_SCRIPT')
     .then(r => r.text())
     .then(console.log)
     .catch(console.error)
   ```

## 📋 Checklist de Configuração

- [ ] Google Apps Script criado
- [ ] Código colado e configurado
- [ ] Google Sheets criado
- [ ] ID da planilha configurado no script
- [ ] Script publicado como aplicação web
- [ ] Permissões definidas como "Qualquer pessoa"
- [ ] URL copiada e configurada no frontend
- [ ] Teste direto da URL funcionando
- [ ] Teste do formulário funcionando

## 🆘 Suporte

Se os problemas persistirem:

1. **Verifique os logs do Google Apps Script:**
   - No editor do script: Execuções > Ver logs

2. **Verifique o console do navegador:**
   - F12 > Console
   - Procure por mensagens de erro específicas

3. **Teste passo a passo:**
   - Primeiro teste a URL diretamente
   - Depois teste com dados simples
   - Por último teste com foto 