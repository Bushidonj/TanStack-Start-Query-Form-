import React, { useRef, useState } from 'react';
import { X, Upload, FileText, AlertCircle, Check } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number; // em bytes
  className?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes, 
  maxSize, 
  className = '' 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Verificar tipo
    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo "${file.type}" não permitido. Tipos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF`
      };
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `Arquivo muito grande (${sizeMB}MB). Máximo permitido: ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  };

  const handleFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    setUploadSuccess(true);
    onFileSelect(file);
    
    // Limpar sucesso após 3 segundos
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className="w-full">
      {/* Área de Upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-400/10 scale-[1.02]' 
            : 'border-notion-border hover:border-notion-text-muted/50 hover:bg-notion-hover/30'
          }
          ${className}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-3">
          {/* Ícone Principal */}
          <div className={`
            p-3 rounded-full transition-all duration-200
            ${isDragOver 
              ? 'bg-blue-400 text-white scale-110' 
              : 'bg-notion-hover text-notion-text-muted'
            }
          `}>
            <Upload size={24} />
          </div>

          {/* Texto Principal */}
          <div className="text-center">
            <p className="text-notion-text font-medium mb-1">
              {isDragOver ? 'Solte o arquivo aqui' : 'Arraste ou clique para anexar'}
            </p>
            <p className="text-notion-text-muted text-sm">
              Máximo {formatFileSize(maxSize)} • PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF
            </p>
          </div>

          {/* Botão Alternativo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-notion-hover text-notion-text rounded-lg hover:bg-notion-hover/80 transition-colors text-sm font-medium"
          >
            Escolher Arquivo
          </button>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-400/30 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 text-sm font-medium">Erro no upload</p>
            <p className="text-red-300 text-xs mt-1">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mensagem de Sucesso */}
      {uploadSuccess && (
        <div className="mt-3 p-3 bg-green-900/20 border border-green-400/30 rounded-lg flex items-center gap-2">
          <Check size={16} className="text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-400 text-sm font-medium">Arquivo anexado com sucesso!</p>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="mt-3 text-xs text-notion-text-muted">
        <p>• Arquivos maiores que {formatFileSize(maxSize)} serão rejeitados automaticamente</p>
        <p>• Apenas os formatos listados acima são permitidos</p>
        <p>• Arquivos executáveis (.exe, .bat, etc) são bloqueados por segurança</p>
      </div>
    </div>
  );
}
