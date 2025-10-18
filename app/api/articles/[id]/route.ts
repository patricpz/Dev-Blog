import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { params } = context as { params: { id: string } };
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const articleId = parseInt(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'ID do artigo inválido' },
        { status: 400 }
      );
    }

    // Buscar o usuário pelo email da sessão
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar o artigo
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o autor do artigo ou tem permissão de admin/moderador
    if (article.author_id !== user.id && user.role !== 'admin' && user.role !== 'moderador') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      status: article.status,
      cover_image_url: article.cover_image_url,
      author: article.author,
      tags: article.tags.map(t => t.tag),
      created_at: article.created_at,
      updated_at: article.updated_at,
      published_at: article.published_at,
    });

  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { params } = context as { params: { id: string } };
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const articleId = parseInt(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'ID do artigo inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, subtitle, content, coverImageUrl, status } = body;

    // Validações básicas
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o usuário pelo email da sessão
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o artigo existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o autor do artigo ou tem permissão de admin/moderador
    if (existingArticle.author_id !== user.id && user.role !== 'admin' && user.role !== 'moderador') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Atualizar o artigo
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        content: content.trim(),
        cover_image_url: coverImageUrl?.trim() || null,
        status: status || existingArticle.status,
        published_at: status === 'publicado' ? new Date() : existingArticle.published_at,
        updated_at: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json({
      id: updatedArticle.id,
      title: updatedArticle.title,
      subtitle: updatedArticle.subtitle,
      content: updatedArticle.content,
      status: updatedArticle.status,
      cover_image_url: updatedArticle.cover_image_url,
      author: updatedArticle.author,
      created_at: updatedArticle.created_at,
      updated_at: updatedArticle.updated_at,
      published_at: updatedArticle.published_at,
    });

  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
