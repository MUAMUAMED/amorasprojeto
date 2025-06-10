# 👕 Sistema de Cadastro de Roupas

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)

Um sistema web moderno e elegante para cadastrar roupas e gerenciar estoque, com integração automática ao Google Sheets e Google Drive.

## 🎯 Demo Online

> **Status:** ✅ Funcionando | **Última atualização:** Junho 2025

![Sistema Demo](https://img.shields.io/badge/Demo-Funcionando-success?style=for-the-badge)

**🔗 [Ver Demo ao Vivo](https://muamuamed.github.io/sistema-cadastro-roupas/)**

## 🌟 Funcionalidades

- ✅ **Interface Moderna**: Design responsivo com gradientes e animações
- 📸 **Upload de Fotos**: Preview instantâneo e armazenamento automático
- 📊 **Google Sheets**: Salvamento automático dos dados em planilha
- ☁️ **Google Drive**: Backup seguro das fotos na nuvem
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance**: Interface rápida com validações em tempo real
- 🔒 **Seguro**: Integração segura com APIs do Google

## 📸 Screenshots

### Interface Principal
![Interface Principal](https://via.placeholder.com/800x600/4facfe/ffffff?text=Interface+Principal)

### Formulário de Cadastro
![Formulário](https://via.placeholder.com/800x400/00f2fe/ffffff?text=Formulário+de+Cadastro)

## 🗂️ Estrutura do Projeto

```
sistema-cadastro-roupas/
├── 📄 index.html              # Interface principal do sistema
├── 🎨 styles.css              # Estilos e design responsivo
├── ⚡ script.js               # Lógica do frontend
├── 🔧 google-apps-script.gs   # Backend para Google Apps Script
├── 🔧 google-apps-script-legacy.gs # Versão legacy (compatibilidade)
└── 📚 README.md               # Documentação completa
```

## 🚀 Instalação Rápida

### Pré-requisitos
- Conta Google (Gmail)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seuusuario/sistema-cadastro-roupas.git
cd sistema-cadastro-roupas
```

### 2️⃣ Configure o Google Workspace
1. **Crie uma planilha** no [Google Sheets](https://sheets.google.com)
2. **Crie uma pasta** no [Google Drive](https://drive.google.com)
3. **Anote os IDs** (disponíveis nas URLs)

### 3️⃣ Configure o Google Apps Script
1. Acesse [script.google.com](https://script.google.com)
2. Crie novo projeto e cole o código de `google-apps-script.gs`
3. Configure os IDs da planilha e pasta
4. Publique como Web App

### 4️⃣ Configure o Frontend
1. Edite `script.js` com a URL do seu Web App
2. Abra `index.html` no navegador

### 5️⃣ Teste o Sistema
Preencha o formulário e veja a mágica acontecer! ✨

## 🌐 Deploy Automático

Este projeto está configurado com **GitHub Pages** para deploy automático:

- ✅ **Deploy automático** a cada push na branch `main`
- ✅ **GitHub Actions** configurado
- ✅ **HTTPS** habilitado por padrão
- ✅ **URL personalizada**: `https://seuusuario.github.io/sistema-cadastro-roupas/`

### Para habilitar no seu fork:
1. Vá em **Settings** do repositório
2. **Pages** → **Source**: GitHub Actions
3. Aguarde o deploy (2-3 minutos)

## 🎯 Como Usar

1. **📝 Preencha os dados da roupa**
   - Nome, categoria, estampa, tamanho
   - Quantidade em estoque
   
2. **📸 Adicione uma foto**
   - Arraste ou clique para selecionar
   - Preview automático
   
3. **💾 Cadastre**
   - Clique em "Cadastrar Roupa"
   - Aguarde a confirmação

4. **📊 Visualize os dados**
   - Abra sua planilha Google Sheets
   - Veja todos os dados organizados

## ⚙️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Flexbox, Grid, animações e gradientes
- **JavaScript ES6+**: Fetch API, async/await, módulos

### Backend
- **Google Apps Script**: Runtime JavaScript na nuvem
- **Google Sheets API**: Armazenamento de dados
- **Google Drive API**: Armazenamento de arquivos

### Recursos Avançados
- **CORS** configurado para requisições cross-origin
- **Validação** de arquivos e dados
- **Loading states** para melhor UX
- **Error handling** robusto

## 🔧 Configuração Avançada

<details>
<summary>Clique para ver configurações detalhadas</summary>

### Personalizar Categorias
```javascript
// Em index.html, adicione novas categorias:
<option value="Nova Categoria">Nova Categoria</option>
```

### Personalizar Validações
```javascript
// Em script.js, modifique as validações:
if (file.size > 10 * 1024 * 1024) { // 10MB
    alert('Arquivo muito grande');
    return;
}
```

### Personalizar Design
```css
/* Em styles.css, modifique as cores: */
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #4facfe;
}
```

</details>

## 📊 Estrutura dos Dados

| Campo | Tipo | Exemplo |
|-------|------|---------|
| Data/Hora | DateTime | 15/12/2024 14:30:22 |
| Nome | String | Camiseta Básica Azul |
| Categoria | Enum | Camiseta, Calça, Vestido |
| Estampa | String | Lisa, Floral, Geométrica |
| Tamanho | Enum | P, M, G, GG |
| Quantidade | Number | 5 |
| Foto | URL | https://drive.google.com/... |

## 🚨 Solução de Problemas

<details>
<summary>❌ Erro ao cadastrar roupa</summary>

**Possíveis causas:**
- IDs da planilha/pasta incorretos
- Web App não publicado
- Permissões insuficientes

**Soluções:**
1. Verifique os IDs no código
2. Republique o Web App
3. Execute `autorizarBasico()` no Apps Script
</details>

<details>
<summary>📸 Foto não aparece na planilha</summary>

**Possíveis causas:**
- Pasta do Drive não pública
- ID da pasta incorreto
- Arquivo muito grande

**Soluções:**
1. Torne a pasta pública
2. Verifique o ID da pasta
3. Use imagens menores que 5MB
</details>

## 🛡️ Segurança e Privacidade

- ✅ **Dados Privados**: Suas informações ficam no seu Google Workspace
- ✅ **Sem Servidor Externo**: Tudo roda no Google Apps Script
- ✅ **Código Aberto**: Você pode auditar todo o código
- ✅ **Controle Total**: Você tem acesso completo aos seus dados

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** este repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙋‍♂️ Suporte

Encontrou algum problema ou tem uma sugestão? 

- 🐛 [Reportar Bug](../../issues)
- 💡 [Sugerir Feature](../../issues)
- 📧 [Contato Direto](mailto:seuemail@gmail.com)

## ⭐ Gostou do Projeto?

Se este projeto foi útil para você, considere dar uma ⭐ no repositório!

---

**Feito com ❤️ para facilitar o gerenciamento de estoque de roupas** 

![Visitors](https://visitor-badge.glitch.me/badge?page_id=seuusuario.sistema-cadastro-roupas) 