// Hook para tratamento de erros de upload no CardModal
import { useState, useCallback } from 'react';

interface UploadError {
  statusCode: number;
  message: string;
  error: string;
  details?: {
    code: string;
    fileName?: string;
    receivedType?: string;
    allowedTypes?: string[];
    maxSize?: string;
    userMessage?: string;
  };
}

export function useCardModalUploadError() {
  const [uploadError, setUploadError] = useState<UploadError | null>(null);

  const handleUploadError = useCallback((error: any) => {
    console.error('[useCardModalUploadError] ❌ Erro capturado:', error);
    
    // Tratar erro de upload específico do task.service.ts
    if (error?.code === 'UPLOAD_ERROR') {
      setUploadError({
        statusCode: error.statusCode || 400,
        message: error.message || 'Erro no upload',
        error: 'UPLOAD_ERROR',
        details: error.details || {
          code: 'UPLOAD_ERROR',
          userMessage: error.message || 'Ocorreu um erro ao fazer o upload.'
        }
      });
      return;
    }
    
    // Tratar erro de upload específico do backend
    if (error?.response?.data?.error === 'UPLOAD_ERROR') {
      setUploadError(error.response.data);
      return;
    }
    
    // Tratar outros erros HTTP
    if (error?.response?.data) {
      setUploadError(error.response.data);
      return;
    }
    
    // Erro genérico
    setUploadError({
      statusCode: 500,
      message: 'Erro ao fazer upload',
      error: 'UPLOAD_ERROR',
      details: {
        code: 'GENERIC_UPLOAD_ERROR',
        userMessage: 'Ocorreu um erro ao fazer o upload. Tente novamente.'
      }
    });
  }, []);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploadError,
    handleUploadError,
    clearError,
    hasError: !!uploadError,
    isFileTypeError: uploadError?.details?.code === 'INVALID_FILE_TYPE',
    isFileSizeError: uploadError?.details?.code === 'FILE_TOO_LARGE',
    errorMessage: uploadError?.details?.userMessage || uploadError?.message,
    errorDetails: uploadError?.details
  };
}
