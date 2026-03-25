PLANEJEI - ARQUIVOS EDITADOS

O que foi ajustado:
- Home nova
- Pricing nova
- Login e logout do app
- Área administrativa interna com login separado
- Dashboard principal reorganizado
- Estrutura pronta para links de pagamento do Mercado Pago

ONDE CONFIGURAR:
1) Credenciais do admin:
   client/src/config/admin.ts
   ou variáveis:
   VITE_ADMIN_EMAIL
   VITE_ADMIN_PASSWORD

2) Links de pagamento:
   client/src/config/payments.ts
   ou variáveis:
   VITE_MP_BASIC_URL
   VITE_MP_PREMIUM_URL

ROTAS PRINCIPAIS:
- /           Início
- /login      Login do usuário
- /signup     Cadastro simples
- /pricing    Planos
- /dashboard  App
- /admin-login Login do admin
- /admin      Painel interno

OBSERVAÇÃO:
A área administrativa nesta versão está protegida no front-end. Para segurança forte de produção, o ideal é migrar o login do admin para validação no servidor.
