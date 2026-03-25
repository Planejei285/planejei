# Planejei - Setup e Deployment

## 🚀 Visão Geral

**Planejei** é um planner digital SaaS completo para pessoas com TDAH, com sistema de pagamento integrado ao Stripe.

### Stack Tecnológico
- **Frontend:** React 19 + TypeScript + TailwindCSS 4
- **Backend:** Express 4 + tRPC 11 + MySQL/TiDB
- **Pagamento:** Stripe
- **Autenticação:** Manus OAuth

---

## 📋 Checklist de Setup

### 1. Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

```
# Banco de Dados
DATABASE_URL=mysql://user:password@host/database

# Autenticação
JWT_SECRET=seu-secret-jwt
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Manus APIs
BUILT_IN_FORGE_API_KEY=seu-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=seu-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Informações do Proprietário
OWNER_NAME=seu-nome
OWNER_OPEN_ID=seu-open-id
```

### 2. Banco de Dados

Execute as migrações:

```bash
pnpm db:push
```

Isso criará as tabelas:
- `users` - Usuários do sistema
- `subscriptions` - Planos e status de assinatura
- `plannerData` - Dados do planner (tarefas, metas, etc)

### 3. Webhook do Stripe

O webhook está configurado em `/api/stripe/webhook` e processa:

- `checkout.session.completed` - Ativa assinatura
- `customer.subscription.updated` - Atualiza status
- `customer.subscription.deleted` - Cancela assinatura
- `invoice.payment_succeeded` - Pagamento confirmado
- `invoice.payment_failed` - Pagamento falhou

**Importante:** Registre a URL do webhook no Stripe Dashboard:
```
https://seu-dominio.com/api/stripe/webhook
```

### 4. Planos de Assinatura

Os planos estão configurados em `server/stripe-products.ts`:

| Plano | Preço | Tarefas | Recursos |
|-------|-------|---------|----------|
| Free | R$ 0 | 20/mês | Básico |
| Básico | R$ 20/mês | 100/mês | Sincronização |
| Premium | R$ 35/mês | Ilimitado | Tudo |

---

## 🧪 Testes

Execute os testes:

```bash
pnpm test
```

Testes incluem:
- ✅ Autenticação e logout
- ✅ Procedimentos de subscription
- ✅ Validação de planos

---

## 📱 Rotas Principais

### Públicas
- `/` - Home (landing page)
- `/pricing` - Página de planos

### Autenticadas
- `/dashboard` - Painel de planos e upgrade
- `/subscription/success` - Após pagamento bem-sucedido
- `/subscription/cancel` - Cancelamento de checkout

---

## 💳 Testando Pagamentos

### Cartões de Teste do Stripe

```
Sucesso: 4242 4242 4242 4242
Falha: 4000 0000 0000 0002
Requer autenticação: 4000 2500 0000 3155
```

Qualquer data futura e CVC funcionam.

### Testando Webhook Localmente

Use o Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger payment_intent.succeeded
```

---

## 🚀 Deployment

### Pré-requisitos
- Stripe account com sandbox ativado
- Banco de dados MySQL/TiDB
- Variáveis de ambiente configuradas

### Build

```bash
pnpm build
```

Isso gera:
- `dist/` - Aplicação compilada
- `dist/index.js` - Servidor Node.js

### Iniciar Produção

```bash
NODE_ENV=production node dist/index.js
```

---

## 🔒 Segurança

### Checklist
- [ ] Stripe keys estão em variáveis de ambiente (nunca em código)
- [ ] Webhook secret está configurado
- [ ] JWT_SECRET é forte e único
- [ ] HTTPS está ativado em produção
- [ ] Banco de dados tem backup automático
- [ ] Rate limiting está configurado

---

## 📊 Monitoramento

### Logs Importantes

**Servidor:**
```
[OAuth] Initialized with baseURL
[Stripe] Checkout session created
[Webhook] Event processed
[Database] Query executed
```

**Cliente:**
```
[API Query Error]
[API Mutation Error]
[Auth State Changed]
```

### Métricas para Acompanhar

1. **Conversão:** Free → Básico → Premium
2. **Retenção:** Usuários ativos por semana
3. **Pagamentos:** Taxa de sucesso/falha
4. **Performance:** Tempo de resposta da API

---

## 🆘 Troubleshooting

### Webhook não funciona
- [ ] URL registrada no Stripe Dashboard
- [ ] Webhook secret correto
- [ ] Firewall permite POST em `/api/stripe/webhook`
- [ ] Logs mostram erro específico

### Pagamento falha
- [ ] Stripe keys estão corretas
- [ ] Usuário tem email válido
- [ ] Plano existe no Stripe

### Usuário não consegue fazer login
- [ ] OAuth URLs estão corretas
- [ ] JWT_SECRET está configurado
- [ ] Banco de dados está acessível

---

## 📚 Documentação Adicional

- [Stripe API Docs](https://stripe.com/docs/api)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)

---

## 📞 Suporte

Para problemas ou dúvidas, consulte:
- Logs do servidor em `.manus-logs/`
- Stripe Dashboard para eventos de webhook
- Console do navegador para erros do cliente

---

**Última atualização:** 20 de março de 2026
**Versão:** 3.0
