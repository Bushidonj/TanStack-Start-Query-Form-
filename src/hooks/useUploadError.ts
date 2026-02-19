// Hook para tratamento de erros de upload
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

export function useUploadError() {
  const [uploadError, setUploadError] = useState<UploadError | null>(null);

  const handleError = useCallback((error: any) => {
    console.error('[useUploadError] ❌ Erro capturado:', error);
    
    // Tratar erro de upload específico
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
    handleError,
    clearError,
    hasError: !!uploadError,
    isFileTypeError: uploadError?.details?.code === 'INVALID_FILE_TYPE',
    isFileSizeError: uploadError?.details?.code === 'FILE_TOO_LARGE',
    errorMessage: uploadError?.details?.userMessage || uploadError?.message,
    errorDetails: uploadError?.details
  };
}
