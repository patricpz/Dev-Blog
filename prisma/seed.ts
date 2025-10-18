import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem reversa das dependências)
  console.log('🧹 Limpando dados existentes...');
  await prisma.articleReview.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.follower.deleteMany();
  await prisma.clap.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin do Sistema',
      email: 'admin@blog.com',
      role: 'admin',
      bio: 'Administrador do blog',
      profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  });

  const moderador = await prisma.user.create({
    data: {
      name: 'Maria Moderadora',
      email: 'moderador@blog.com',
      role: 'moderador',
      bio: 'Moderadora do blog',
      profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
  });

  const autor1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@blog.com',
      role: 'autor',
      bio: 'Escritor apaixonado por tecnologia e inovação',
      profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  });

  const autor2 = await prisma.user.create({
    data: {
      name: 'Ana Costa',
      email: 'ana@blog.com',
      role: 'autor',
      bio: 'Desenvolvedora e escritora técnica',
      profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  });

  const leitor1 = await prisma.user.create({
    data: {
      name: 'Carlos Leitor',
      email: 'carlos@blog.com',
      role: 'leitor',
      bio: 'Leitor ávido e entusiasta de tecnologia',
      profile_picture_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  });

  const leitor2 = await prisma.user.create({
    data: {
      name: 'Sofia Santos',
      email: 'sofia@blog.com',
      role: 'leitor',
      bio: 'Interessada em programação e design',
      profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
  });

  // Criar tags
  console.log('🏷️ Criando tags...');
  const tagTech = await prisma.tag.create({
    data: { name: 'Tecnologia' },
  });

  const tagWeb = await prisma.tag.create({
    data: { name: 'Desenvolvimento Web' },
  });

  const tagReact = await prisma.tag.create({
    data: { name: 'React' },
  });

  const tagNext = await prisma.tag.create({
    data: { name: 'Next.js' },
  });

  const tagJS = await prisma.tag.create({
    data: { name: 'JavaScript' },
  });

  const tagCSS = await prisma.tag.create({
    data: { name: 'CSS' },
  });

  const tagDesign = await prisma.tag.create({
    data: { name: 'Design' },
  });

  const tagTutorial = await prisma.tag.create({
    data: { name: 'Tutorial' },
  });

  // Criar artigos
  console.log('📝 Criando artigos...');
  const artigo1 = await prisma.article.create({
    data: {
      author_id: autor1.id,
      title: 'Como Construir uma Aplicação Full-Stack com Next.js',
      subtitle: 'Um guia completo para iniciantes',
      content: `
# Introdução ao Next.js

Next.js é um framework React que oferece funcionalidades como renderização do lado do servidor (SSR), geração de sites estáticos (SSG) e roteamento baseado em arquivos.

## Principais Características

- **Server-Side Rendering (SSR)**: Melhora o SEO e a performance
- **Static Site Generation (SSG)**: Gera páginas estáticas no build
- **API Routes**: Cria APIs facilmente
- **Roteamento Automático**: Baseado na estrutura de arquivos

## Exemplo Prático

\`\`\`javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World!' })
}
\`\`\`

## Conclusão

Next.js é uma excelente escolha para desenvolvedores que querem criar aplicações React modernas e performáticas.
      `,
      cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      status: 'publicado',
      published_at: new Date('2024-01-15'),
    },
  });

  const artigo2 = await prisma.article.create({
    data: {
      author_id: autor2.id,
      title: 'Design System: Criando Componentes Reutilizáveis',
      subtitle: 'Como desenvolver um design system eficiente',
      content: `
# Design System: O que é e por que usar?

Um design system é uma coleção de componentes, padrões e diretrizes que garantem consistência visual e funcional em uma aplicação.

## Benefícios

- **Consistência**: Interface uniforme
- **Eficiência**: Desenvolvimento mais rápido
- **Manutenibilidade**: Fácil atualização
- **Escalabilidade**: Cresce com o projeto

## Componentes Essenciais

### Botões
- Primário
- Secundário
- Outline
- Ghost

### Inputs
- Text
- Email
- Password
- Textarea

## Implementação

\`\`\`jsx
const Button = ({ variant, children, ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-medium"
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }
  
  return (
    <button className={\`\${baseStyles} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  )
}
\`\`\`
      `,
      cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
      status: 'publicado',
      published_at: new Date('2024-01-20'),
    },
  });

  const artigo3 = await prisma.article.create({
    data: {
      author_id: autor1.id,
      title: 'JavaScript Moderno: ES6+ Features',
      subtitle: 'Explore as principais funcionalidades do JavaScript moderno',
      content: `
# JavaScript Moderno: ES6+

O JavaScript evoluiu muito desde o ES6 (ES2015). Vamos explorar as principais funcionalidades modernas.

## Arrow Functions

\`\`\`javascript
// Antes
function add(a, b) {
  return a + b;
}

// Depois
const add = (a, b) => a + b;
\`\`\`

## Destructuring

\`\`\`javascript
const user = { name: 'João', age: 30, city: 'São Paulo' };
const { name, age } = user;
\`\`\`

## Async/Await

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
  }
}
\`\`\`

## Modules

\`\`\`javascript
// export
export const utils = {
  formatDate: (date) => new Date(date).toLocaleDateString()
};

// import
import { utils } from './utils.js';
\`\`\`
      `,
      cover_image_url: 'https://images.unsplash.com/photo-1579468118864-70b97144aae9?w=800&h=400&fit=crop',
      status: 'publicado',
      published_at: new Date('2024-01-25'),
    },
  });

  const artigo4 = await prisma.article.create({
    data: {
      author_id: autor2.id,
      title: 'CSS Grid vs Flexbox: Quando Usar Cada Um',
      subtitle: 'Entenda as diferenças e aplicações práticas',
      content: `
# CSS Grid vs Flexbox

Dois sistemas de layout poderosos, mas com propósitos diferentes.

## Flexbox

Ideal para layouts unidimensionais (linha ou coluna).

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid

Perfeito para layouts bidimensionais (linhas e colunas).

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
\`\`\`

## Quando Usar

### Use Flexbox para:
- Alinhamento de itens
- Distribuição de espaço
- Layouts simples

### Use Grid para:
- Layouts complexos
- Posicionamento preciso
- Estruturas bidimensionais

## Exemplo Prático

\`\`\`css
/* Header com Flexbox */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Layout principal com Grid */
.main-layout {
  display: grid;
  grid-template-areas: 
    "sidebar content"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`
      `,
      cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      status: 'pendente',
    },
  });

  const artigo5 = await prisma.article.create({
    data: {
      author_id: autor1.id,
      title: 'React Hooks: useState e useEffect',
      subtitle: 'Dominando os hooks mais importantes do React',
      content: `
# React Hooks: useState e useEffect

Os hooks revolucionaram o desenvolvimento com React, permitindo usar estado e efeitos em componentes funcionais.

## useState

Gerencia estado local em componentes funcionais.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}
\`\`\`

## useEffect

Executa efeitos colaterais em componentes funcionais.

\`\`\`jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []); // Array de dependências vazio = executa apenas uma vez

  if (loading) return <div>Carregando...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
\`\`\`

## Dicas Importantes

- Use array de dependências no useEffect
- Evite loops infinitos
- Limpe recursos quando necessário
      `,
      cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      status: 'rascunho',
    },
  });

  // Associar tags aos artigos
  console.log('🔗 Associando tags aos artigos...');
  await prisma.articleTag.createMany({
    data: [
      { article_id: artigo1.id, tag_id: tagTech.id },
      { article_id: artigo1.id, tag_id: tagWeb.id },
      { article_id: artigo1.id, tag_id: tagNext.id },
      { article_id: artigo1.id, tag_id: tagTutorial.id },
      
      { article_id: artigo2.id, tag_id: tagDesign.id },
      { article_id: artigo2.id, tag_id: tagWeb.id },
      { article_id: artigo2.id, tag_id: tagTutorial.id },
      
      { article_id: artigo3.id, tag_id: tagJS.id },
      { article_id: artigo3.id, tag_id: tagTech.id },
      { article_id: artigo3.id, tag_id: tagTutorial.id },
      
      { article_id: artigo4.id, tag_id: tagCSS.id },
      { article_id: artigo4.id, tag_id: tagWeb.id },
      { article_id: artigo4.id, tag_id: tagTutorial.id },
      
      { article_id: artigo5.id, tag_id: tagReact.id },
      { article_id: artigo5.id, tag_id: tagJS.id },
      { article_id: artigo5.id, tag_id: tagTutorial.id },
    ],
  });

  // Criar alguns comentários
  console.log('💬 Criando comentários...');
  await prisma.comment.createMany({
    data: [
      {
        article_id: artigo1.id,
        user_id: leitor1.id,
        content: 'Excelente artigo! Muito bem explicado.',
        created_at: new Date('2024-01-16'),
      },
      {
        article_id: artigo1.id,
        user_id: leitor2.id,
        content: 'Obrigado pelo tutorial! Me ajudou muito.',
        created_at: new Date('2024-01-17'),
      },
      {
        article_id: artigo2.id,
        user_id: leitor1.id,
        content: 'Design systems são fundamentais para projetos grandes.',
        created_at: new Date('2024-01-21'),
      },
    ],
  });

  // Criar alguns claps
  console.log('👏 Criando claps...');
  await prisma.clap.createMany({
    data: [
      { article_id: artigo1.id, user_id: leitor1.id },
      { article_id: artigo1.id, user_id: leitor2.id },
      { article_id: artigo1.id, user_id: autor2.id },
      { article_id: artigo2.id, user_id: leitor1.id },
      { article_id: artigo2.id, user_id: autor1.id },
      { article_id: artigo3.id, user_id: leitor2.id },
    ],
  });

  // Criar seguidores
  console.log('👥 Criando seguidores...');
  await prisma.follower.createMany({
    data: [
      { follower_id: leitor1.id, followed_id: autor1.id },
      { follower_id: leitor1.id, followed_id: autor2.id },
      { follower_id: leitor2.id, followed_id: autor1.id },
      { follower_id: autor2.id, followed_id: autor1.id },
    ],
  });

  // Criar notificações
  console.log('🔔 Criando notificações...');
  await prisma.notification.createMany({
    data: [
      {
        user_id: autor1.id,
        type: 'seguido',
        message: 'Carlos Leitor começou a te seguir',
        link: '/user/carlos-leitor',
      },
      {
        user_id: autor1.id,
        type: 'comentario',
        message: 'Carlos Leitor comentou no seu artigo',
        link: `/article/${artigo1.id}`,
      },
      {
        user_id: autor2.id,
        type: 'seguido',
        message: 'Carlos Leitor começou a te seguir',
        link: '/user/carlos-leitor',
      },
    ],
  });

  // Criar eventos
  console.log('📅 Criando eventos...');
  await prisma.event.createMany({
    data: [
      {
        title: 'Workshop de Next.js',
        description: 'Aprenda Next.js do zero ao avançado',
        location: 'São Paulo, SP',
        start_date: new Date('2024-02-15T19:00:00'),
        end_date: new Date('2024-02-15T22:00:00'),
        link: 'https://example.com/workshop-nextjs',
      },
      {
        title: 'Meetup de Desenvolvimento Web',
        description: 'Discussão sobre as últimas tendências em desenvolvimento web',
        location: 'Rio de Janeiro, RJ',
        start_date: new Date('2024-02-20T18:30:00'),
        end_date: new Date('2024-02-20T21:00:00'),
        link: 'https://example.com/meetup-web',
      },
    ],
  });

  // Criar reviews de artigos
  console.log('📝 Criando reviews...');
  await prisma.articleReview.createMany({
    data: [
      {
        article_id: artigo4.id,
        reviewer_id: moderador.id,
        status: 'revisar',
        comments: 'Artigo interessante, mas precisa de mais exemplos práticos.',
        reviewed_at: new Date('2024-01-26'),
      },
    ],
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`👥 Usuários: 6 (1 admin, 1 moderador, 2 autores, 2 leitores)`);
  console.log(`📝 Artigos: 5 (3 publicados, 1 pendente, 1 rascunho)`);
  console.log(`🏷️ Tags: 8`);
  console.log(`💬 Comentários: 3`);
  console.log(`👏 Claps: 6`);
  console.log(`👥 Seguidores: 4 relacionamentos`);
  console.log(`🔔 Notificações: 3`);
  console.log(`📅 Eventos: 2`);
  console.log(`📝 Reviews: 1`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
