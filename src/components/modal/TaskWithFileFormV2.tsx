import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { X, FileText, Upload } from 'lucide-react';
import api from '../../services/api';
import { useUploadError } from '../../hooks/useUploadError';
import FileUploadError from '../ui/FileUploadError';

interface TaskWithFileFormProps {
  onClose: () => void;
  onSuccess: (task: any) => void;
  initialData?: any;
}

export default function TaskWithFileForm({ onClose, onSuccess, initialData }: TaskWithFileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadError, handleError, clearError, hasError } = useUploadError();

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'To Do',
      priority: initialData?.priority || 'Média',
      responsible: initialData?.responsible || [],
      tags: initialData?.tags || [],
      attachments: initialData?.attachments || [],
    },
    onSubmit: async (value) => {
      setIsSubmitting(true);
      clearError();

      try {
        // Criar FormData para upload
        const formData = new FormData();
        
        // Adicionar arquivo se selecionado
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
        
        // Adicionar campos da task
        formData.append('title', value.value.title);
        formData.append('description', value.value.description || '');
        formData.append('status', value.value.status);
        formData.append('priority', value.value.priority);
        formData.append('responsible', JSON.stringify(value.value.responsible));
        formData.append('tags', JSON.stringify(value.value.tags));

        console.log('[TaskWithFileForm] 📤 Enviando task com arquivo:', {
          title: value.value.title,
          fileName: selectedFile?.name,
          fileSize: selectedFile?.size
        });

        // Enviar para backend
        const response = await api.post('/tasks/with-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('[TaskWithFileForm] ✅ Task criada com sucesso:', response.data);
        
        // Sucesso
        onSuccess(response.data);
        onClose();
      } catch (error: any) {
        console.error('[TaskWithFileForm] ❌ Erro ao criar task:', error);
        
        // Usar hook de tratamento de erro
        handleError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileSelect = (file: File) => {
    console.log('[TaskWithFileForm] 📎 Arquivo selecionado:', file.name, file.size);
    setSelectedFile(file);
    clearError();
  };

  const handleRemoveFile = () => {
    console.log('[TaskWithFileForm] 🗑️ Arquivo removido');
    setSelectedFile(null);
    clearError();
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-notion-sidebar border border-notion-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-notion-border">
          <h2 className="text-lg font-bold text-notion-text">
            Criar Nova Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted hover:text-notion-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={form.handleSubmit} className="space-y-6">
            {/* Upload de Arquivo */}
            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                Anexo (Opcional)
              </label>
              
              {selectedFile ? (
                <div className="p-4 bg-notion-hover/50 border border-notion-border/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-notion-text">{selectedFile.name}</p>
                        <p className="text-xs text-notion-text-muted">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-notion-border rounded-lg p-8 text-center hover:border-notion-text-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload size={32} className="text-notion-text-muted" />
                    <div>
                      <p className="text-notion-text font-medium">
                        Clique para anexar arquivo
                      </p>
                      <p className="text-sm text-notion-text-muted">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF (máx. 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Campos do Formulário */}
            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                Título *
              </label>
              <form.Field
                name="title"
                children={(field) => (
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-notion-text placeholder-notion-text-muted/30 focus:outline-none focus:border-blue-400"
                    placeholder="Digite o título da task..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-notion-text mb-2">
                Descrição
              </label>
              <form.Field
                name="description"
                children={(field) => (
                  <textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-notion-text placeholder-notion-text-muted/30 focus:outline-none focus:border-blue-400 resize-none"
                    placeholder="Descreva a task..."
                  />
                )}
              />
            </div>

            {/* Erro de Upload */}
            {hasError && (
              <FileUploadError
                error={uploadError}
                onRetry={() => {
                  clearError();
                  setSelectedFile(null);
                }}
              />
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-notion-border text-notion-text rounded-lg hover:bg-notion-hover transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Criar Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
