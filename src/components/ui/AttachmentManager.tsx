import { useState } from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

interface AttachmentManagerProps {
  attachments: (string | { name: string; url: string; size?: number; type?: string })[];
  onAddAttachment: (file: File) => void;
  onRemoveAttachment: (index: number) => void;
  className?: string;
}

export default function AttachmentManager({ 
  attachments, 
  onAddAttachment, 
  onRemoveAttachment,
  className = ''
}: AttachmentManagerProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    try {
      onAddAttachment(file);
      setUploadError(null);
    } catch (error: any) {
      console.error('[AttachmentManager] ❌ Erro ao anexar arquivo:', error);
      
      // Tratar diferentes tipos de erro
      if (error.code === 'INVALID_FILE_TYPE') {
        setUploadError(`Tipo "${error.receivedType}" não permitido para o arquivo "${error.fileName}".`);
      } else if (error.message?.includes('File size too large')) {
        setUploadError('Arquivo muito grande. Máximo permitido: 10MB');
      } else {
        setUploadError(error.message || 'Erro ao anexar arquivo');
      }
    }
  };

  const formatFileName = (fileName: string): string => {
    if (fileName.length > 25) {
      return fileName.substring(0, 22) + '...';
    }
    return fileName;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconClass = 'w-4 h-4';
    
    switch (extension) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-400`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-400`} />;
      case 'xls':
      case 'xlsx':
        return <FileText className={`${iconClass} text-green-400`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className={`${iconClass} text-purple-400`} />;
      default:
        return <FileText className={`${iconClass} text-notion-text-muted`} />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Componente de Upload */}
      <div>
        <label className="block text-sm font-medium text-notion-text mb-2">
          Anexos
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          acceptedTypes={[
            'image/jpeg',
            'image/png', 
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ]}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </div>

      {/* Lista de Anexos Existentes */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-notion-text">
            Arquivos Anexados ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment, index) => {
              const fileName = typeof attachment === 'string' 
                ? attachment.split('/').pop() || attachment 
                : (attachment as any).name || `Arquivo ${index + 1}`;
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-notion-hover/50 border border-notion-border/40 rounded-lg group hover:bg-notion-hover transition-all duration-200"
                >
                  {/* Ícone do Arquivo */}
                  <div className="flex-shrink-0">
                    {getFileIcon(fileName)}
                  </div>

                  {/* Informações do Arquivo */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-notion-text truncate">
                      {formatFileName(fileName)}
                    </p>
                    <p className="text-xs text-notion-text-muted">
                      {typeof attachment === 'string' ? 'Anexo' : 'Novo anexo'}
                    </p>
                  </div>

                  {/* Botão de Remover */}
                  <button
                    onClick={() => onRemoveAttachment(index)}
                    className="p-1.5 text-notion-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 flex-shrink-0"
                    title="Remover anexo"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensagem de Erro Global */}
      {uploadError && (
        <div className="p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-red-400 font-medium mb-1">Erro no Upload</h4>
              <p className="text-red-300 text-sm">{uploadError}</p>
              <div className="mt-2 text-xs text-red-400/80">
                <p>• Verifique se o arquivo é um dos tipos permitidos</p>
                <p>• Certifique-se que o arquivo não ultrapassa 10MB</p>
                <p>• Arquivos executáveis são bloqueados por segurança</p>
              </div>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Informações de Ajuda */}
      <div className="text-xs text-notion-text-muted space-y-1 p-3 bg-notion-hover/20 rounded-lg">
        <p className="font-medium mb-2">💡 Dicas de Upload:</p>
        <p>• Arraste e solte arquivos diretamente na área</p>
        <p>• Clique para selecionar arquivos do seu computador</p>
        <p>• Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF</p>
        <p>• Tamanho máximo: 10MB por arquivo</p>
        <p>• Múltiplos arquivos podem ser anexados</p>
      </div>
    </div>
  );
}
