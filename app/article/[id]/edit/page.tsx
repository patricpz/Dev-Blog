'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArticleEditor } from '@/components/ArticleEditor';
import { ArticlePreview } from '@/components/ArticlePreview';
import { 
  SaveIcon, 
  EyeIcon, 
  ArrowLeftIcon, 
  ImageIcon,
  FileTextIcon,
  AlertCircleIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ArticleFormData {
  title: string;
  subtitle: string;
  coverImageUrl: string;
  content: string;
  status: string;
}

export default function EditArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    subtitle: '',
    coverImageUrl: '',
    content: '',
    status: 'rascunho',
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const articleId = params?.id as string;

  // Redirecionar se não estiver autenticado
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Carregar dados do artigo
  useEffect(() => {
    if (articleId && session) {
      loadArticle();
    }
  }, [articleId, session]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${articleId}`);
      
      if (response.ok) {
        const article = await response.json();
        setFormData({
          title: article.title || '',
          subtitle: article.subtitle || '',
          coverImageUrl: article.cover_image_url || '',
          content: article.content || '',
          status: article.status || 'rascunho',
        });
      } else if (response.status === 404) {
        setError('Artigo não encontrado');
      } else if (response.status === 403) {
        setError('Você não tem permissão para editar este artigo');
      } else {
        setError('Erro ao carregar artigo');
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
      setError('Erro ao carregar artigo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      alert('Por favor, adicione um título ao artigo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'rascunho',
        }),
      });

      if (response.ok) {
        alert('Rascunho salvo com sucesso!');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar rascunho');
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert(`Erro ao salvar rascunho: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      alert('Por favor, adicione um título ao artigo.');
      return;
    }

    if (!formData.content.trim()) {
      alert('Por favor, adicione conteúdo ao artigo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'publicado',
        }),
      });

      if (response.ok) {
        showToast('success', 'Artigo publicado com sucesso!');
        router.push(`/article/${articleId}`);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao publicar artigo');
      }
    } catch (error) {
      console.error('Erro ao publicar artigo:', error);
      showToast('error', 'Erro ao publicar artigo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-600 dark:text-gray-400">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Erro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={loadArticle}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Artigo</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Faça as alterações necessárias no seu artigo
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5" />
                  Informações do Artigo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título *
                  </label>
                  <Input
                    placeholder="Digite o título do artigo"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtítulo
                  </label>
                  <Input
                    placeholder="Digite um subtítulo (opcional)"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL da Imagem de Capa
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={formData.coverImageUrl}
                      onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                    />
                    <Button variant="outline" size="sm" className="sm:w-auto">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor de Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Artigo</CardTitle>
              </CardHeader>
              <CardContent>
                {isPreview ? (
                  <ArticlePreview
                    title={formData.title}
                    subtitle={formData.subtitle}
                    content={formData.content}
                    coverImageUrl={formData.coverImageUrl}
                  />
                ) : (
                  <ArticleEditor
                    initialContent={formData.content}
                    onContentChange={handleContentChange}
                    placeholder="Comece a escrever seu artigo... Use a barra de ferramentas acima para formatar o texto."
                    className="min-h-[320px] sm:min-h-[420px] md:min-h-[500px]"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || !formData.title.trim()}
                  className="w-full"
                  variant="outline"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="w-4 h-4 mr-2" />
                  )}
                  Salvar Rascunho
                </Button>
                
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileTextIcon className="w-4 h-4 mr-2" />
                  )}
                  Publicar
                </Button>
                
                <Button
                  onClick={() => setIsPreview(!isPreview)}
                  variant="outline"
                  className="w-full"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  {isPreview ? 'Editar' : 'Visualizar'}
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Status atual:</strong> {formData.status}</p>
                  <p><strong>ID do artigo:</strong> {articleId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
