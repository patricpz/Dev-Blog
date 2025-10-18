# 🌱 Instruções para Seed do Banco de Dados

Este documento explica como executar o script de seed para popular o banco de dados com dados de exemplo.

## 📋 Pré-requisitos

1. **Banco de dados configurado**: Certifique-se de que sua `DATABASE_URL` está configurada no arquivo `.env`
2. **Dependências instaladas**: Execute `npm install` para instalar todas as dependências
3. **Migrações aplicadas**: Execute `npx prisma migrate deploy` para aplicar as migrações

## 🚀 Como Executar o Seed

### Opção 1: Seed Simples
```bash
npm run db:seed
```

### Opção 2: Reset Completo + Seed
```bash
npm run db:reset
```

## 📊 Dados que Serão Criados

O script de seed criará os seguintes dados:

### 👥 Usuários (6)
- **Admin**: admin@blog.com (role: admin)
- **Moderador**: moderador@blog.com (role: moderador)
- **Autores**: joao@blog.com, ana@blog.com (role: autor)
- **Leitores**: carlos@blog.com, sofia@blog.com (role: leitor)

### 📝 Artigos (5)
- **3 Publicados**: Artigos sobre Next.js, Design System, JavaScript Moderno
- **1 Pendente**: Artigo sobre CSS Grid vs Flexbox
- **1 Rascunho**: Artigo sobre React Hooks

### 🏷️ Tags (8)
- Tecnologia, Desenvolvimento Web, React, Next.js, JavaScript, CSS, Design, Tutorial

### 💬 Comentários (3)
- Comentários de exemplo nos artigos publicados

### 👏 Claps (6)
- Curtidas distribuídas entre os artigos

### 👥 Seguidores (4)
- Relacionamentos de seguidores entre usuários

### 🔔 Notificações (3)
- Notificações de exemplo para usuários

### 📅 Eventos (2)
- Workshop de Next.js
- Meetup de Desenvolvimento Web

### 📝 Reviews (1)
- Review de artigo pendente

## 🔧 Comandos Úteis

### Verificar Status do Banco
```bash
npx prisma studio
```

### Aplicar Migrações
```bash
npx prisma migrate deploy
```

### Gerar Cliente Prisma
```bash
npx prisma generate
```

### Reset Completo do Banco
```bash
npx prisma migrate reset
```

## ⚠️ Importante

- **O script limpa todos os dados existentes** antes de inserir os novos
- **Execute apenas em ambiente de desenvolvimento** ou quando necessário
- **Faça backup** de dados importantes antes de executar em produção

## 🐛 Solução de Problemas

### Erro: "Cannot find module 'tsx'"
```bash
npm install tsx --save-dev
```

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` está correta no `.env`
- Certifique-se de que o banco está acessível

### Erro: "Table doesn't exist"
```bash
npx prisma migrate deploy
npx prisma generate
```

## 📝 Personalização

Para modificar os dados do seed, edite o arquivo `prisma/seed.ts`:

- **Usuários**: Modifique os dados na seção "Criar usuários"
- **Artigos**: Adicione/remova artigos na seção "Criar artigos"
- **Tags**: Personalize as tags na seção "Criar tags"
- **Relacionamentos**: Ajuste os relacionamentos conforme necessário

## ✅ Verificação

Após executar o seed, você pode verificar os dados:

1. **Prisma Studio**: `npx prisma studio`
2. **Console do Neon**: Acesse seu painel do Neon
3. **Aplicação**: Execute `npm run dev` e navegue pela aplicação

## 🎯 Próximos Passos

1. Execute o seed: `npm run db:seed`
2. Inicie a aplicação: `npm run dev`
3. Teste as funcionalidades com os dados de exemplo
4. Personalize conforme necessário
