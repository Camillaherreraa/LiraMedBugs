# GABARITO - CAÇA AOS BUGS (LiraMed)

Este é o documento secreto contendo o gabarito de todos os bugs inseridos no sistema LiraMed para a dinâmica "Caça aos Bugs" da disciplina de Teste de Software. Todos os bugs estão focados exclusivamente no fluxo de Cadastro e Login.

**Total de Bugs**: 12
**Distribuição**: 8 Fáceis, 3 Médios, 1 Difícil.

---

### Tabela de Bugs

| ID | Título do Bug | Tipo | Severidade | Onde Ocorre | Como Reproduzir | Como Corrigir |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Ícone do botão voltar invertido | Interface (UI) | Baixa | `login.html` | Observe a seta do botão "Voltar para Home". Ela aponta para a direita em vez da esquerda. | Trocar a classe `<i class="fas fa-arrow-right">` por `fa-arrow-left` (Linha ~21). |
| **02** | Fundo escuro na aba inativa | Interface (UI) | Baixa | `css/auth.css` | O texto "Cadastro" fica ilegível (escuro no escuro) antes de clicar na aba. | Remover a linha `background: var(--primary-dark-blue);` da classe `.auth-tab` (Linha ~70). |
| **03** | Email do login sem validação nativa | Validação | Baixa | `login.html` | Tente logar com o e-mail em branco; o HTML5 não irá impedir o envio. | Adicionar a palavra `required` no final da tag `<input type="email" id="login-email">` (Linha ~52). |
| **04** | Email de cadastro com tipo incorreto | Validação | Baixa | `login.html` | Tente se cadastrar com um e-mail sem "@" (ex: "teste"). O HTML5 não avisará sobre o formato. | Alterar `<input type="text" id="reg-email">` para `type="email"` (Linha ~76). |
| **05** | Botão de Google no Cadastro quebrado | Funcional | Baixa | `login.html` | Clique em "Cadastrar com Facebook" (que deveria ser Google). Nada acontece. | Adicionar a classe `btn-google` na tag `<button type="button" class="">` (Linha ~64). |
| **06** | Mensagem errada de senha curta | Extra (Livre) | Baixa | `js/auth.js` | Tente se cadastrar com senha menor que 6 caracteres. O erro diz "60 caracteres". | Mudar o texto do `showMessage` de "60 caracteres" para "6 caracteres" (Linha ~99). |
| **07** | Texto do botão "Facebook" errado | Extra (Livre) | Baixa | `login.html` | O botão que exibe o logo do Google está escrito "Cadastrar com Facebook". | Mudar o texto dentro da tag `<button>` de "Cadastrar com Facebook" para "Cadastrar com Google" (Linha ~66). |
| **08** | Placeholder do login errado | Extra (Livre) | Baixa | `login.html` | A caixinha de senha no formulário de login exibe a dica "Sua Senha" no código, mas aqui foi substituída. | Alterar o `placeholder` da tag de e-mail de "Sua Senha" para "Seu E-mail" (Linha ~52). |
| **09** | Formulários de Login e Cadastro sobrepostos | Lógico | Média | `js/auth.js` | Clique na aba "Cadastro". O formulário de login não some, ficando os dois misturados. | Descomentar o código `loginForm.classList.remove('active');` no evento de clique da `registerTab` (Linha ~88). |
| **10** | Redirecionamento 404 após Login | Funcional | Média | `js/auth.js` | Faça o login com sucesso e aguarde. Será redirecionado para `loj.html` (Página não encontrada). | Mudar o redirecionamento de `window.location.href = 'loj.html';` para `'loja.html';` (Linha ~132). |
| **11** | Demora infinita ao Cadastrar | Funcional | Média | `js/auth.js` | Conclua um cadastro válido. A tela ficará travada na mensagem de sucesso por muito tempo (150s). | Mudar o valor do `setTimeout` de `150000` para `1500` milissegundos (Linha ~114). |
| **12** | Recarregamento de página impede o Login | Lógico | Alta | `js/auth.js` | Tente fazer o login com e-mail e senha. A página pisca (recarrega) e não loga. | Descomentar a linha `e.preventDefault();` no evento de `submit` do `loginForm` (Linha ~121). |
