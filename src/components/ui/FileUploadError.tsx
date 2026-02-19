import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadErrorProps {
  error: any;
  onRetry?: () => void;
  className?: string;
}

export default function FileUploadError({ error, onRetry, className = '' }: FileUploadErrorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  // Extrair mensagem amigável do erro
  const getUserMessage = (error: any): string => {
    if (error?.details?.userMessage) {
      return error.details.userMessage;
    }
    
    if (error?.error === 'UPLOAD_ERROR') {
      switch (error?.details?.code) {
        case 'INVALID_FILE_TYPE':
          return `O arquivo "${error.details.fileName}" não é permitido. Use apenas PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou GIF.`;
        case 'FILE_TOO_LARGE':
          return 'Arquivo muito grande. O tamanho máximo permitido é 10MB.';
        default:
          return 'Erro no upload do arquivo.';
      }
    }
    
    return error?.message || 'Ocorreu um erro ao fazer o upload do arquivo.';
  };

  const getErrorIcon = () => {
    if (error?.details?.code === 'INVALID_FILE_TYPE') {
      return <AlertCircle size={20} className="text-red-400" />;
    }
    if (error?.details?.code === 'FILE_TOO_LARGE') {
      return <AlertCircle size={20} className="text-orange-400" />;
    }
    return <AlertCircle size={20} className="text-red-400" />;
  };

  const getErrorColor = () => {
    if (error?.details?.code === 'FILE_TOO_LARGE') {
      return 'border-orange-400/30 bg-orange-900/20';
    }
    return 'border-red-400/30 bg-red-900/20';
  };

  const getTextColor = () => {
    if (error?.details?.code === 'FILE_TOO_LARGE') {
      return 'text-orange-400';
    }
    return 'text-red-400';
  };

  const userMessage = getUserMessage(error);

  return (
    <div className={`
      p-4 border rounded-lg transition-all duration-300
      ${getErrorColor()}
      ${className}
    `}>
      <div className="flex items-start gap-3">
        {/* Ícone do Erro */}
        <div className="flex-shrink-0 mt-0.5">
          {getErrorIcon()}
        </div>

        {/* Conteúdo do Erro */}
        <div className="flex-1 min-w-0">
          {/* Título e Mensagem Principal */}
          <div className="mb-2">
            <h4 className={`font-medium mb-1 ${getTextColor()}`}>
              Erro no Upload
            </h4>
            <p className="text-sm text-notion-text">
              {userMessage}
            </p>
          </div>

          {/* Detalhes Técnicos (Expandível) */}
          {(error?.details || error?.code) && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-xs ${getTextColor()} hover:opacity-80 transition-opacity flex items-center gap-1`}
              >
                <span>{isExpanded ? 'Ocultar' : 'Mostrar'} detalhes técnicos</span>
                <X 
                  size={12} 
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`} 
                />
              </button>

              {isExpanded && (
                <div className="mt-2 p-2 bg-black/30 rounded text-xs space-y-1">
                  {error?.details?.code && (
                    <div>
                      <span className="text-notion-text-muted">Código:</span>
                      <span className="ml-2 text-notion-text font-mono">{error.details.code}</span>
                    </div>
                  )}
                  
                  {error?.details?.fileName && (
                    <div>
                      <span className="text-notion-text-muted">Arquivo:</span>
                      <span className="ml-2 text-notion-text font-mono">{error.details.fileName}</span>
                    </div>
                  )}
                  
                  {error?.details?.receivedType && (
                    <div>
                      <span className="text-notion-text-muted">Tipo recebido:</span>
                      <span className="ml-2 text-notion-text font-mono">{error.details.receivedType}</span>
                    </div>
                  )}
                  
                  {error?.details?.maxSize && (
                    <div>
                      <span className="text-notion-text-muted">Tamanho máximo:</span>
                      <span className="ml-2 text-notion-text font-mono">{error.details.maxSize}</span>
                    </div>
                  )}
                  
                  {error?.statusCode && (
                    <div>
                      <span className="text-notion-text-muted">Status HTTP:</span>
                      <span className="ml-2 text-notion-text font-mono">{error.statusCode}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="mt-3 flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 bg-notion-hover text-notion-text rounded text-sm hover:bg-notion-hover/80 transition-colors flex items-center gap-1"
              >
                <Upload size={14} />
                Tentar novamente
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 border border-notion-border text-notion-text rounded text-sm hover:bg-notion-hover transition-colors"
            >
              Limpar
            </button>
          </div>

          {/* Dicas Úteis */}
          <div className="mt-3 text-xs text-notion-text-muted space-y-1">
            <p>💡 <strong>Dicas:</strong></p>
            <ul className="ml-4 space-y-0.5">
              <li>• Verifique o formato do arquivo (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF)</li>
              <li>• Certifique-se que o arquivo não ultrapassa 10MB</li>
              <li>• Arquivos executáveis (.exe, .bat, .msi) são bloqueados por segurança</li>
              <li>• Se o problema persistir, tente converter o arquivo para um formato permitido</li>
            </ul>
          </div>
        </div>

        {/* Botão Fechar */}
        <button
          onClick={() => {
            // Limpar erro do estado pai
            if (onRetry) {
              onRetry();
            }
          }}
          className={`flex-shrink-0 p-1 rounded hover:bg-black/20 transition-colors ${getTextColor()}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
