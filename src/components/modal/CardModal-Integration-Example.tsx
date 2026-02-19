// Adicionar ao CardModal.tsx - Exemplo de integração

import { useCardModalUploadError } from '../../hooks/useCardModalUploadError';
import FileUploadError from '../ui/FileUploadError';

// No componente CardModal
export default function CardModal({ card, onClose, onUpdate }: CardModalProps) {
  // ... outros hooks
  
  const { uploadError, handleUploadError, clearError, hasError } = useCardModalUploadError();

  // Na função onChange do upload
  const onChange = async (file: File) => {
    console.log('[CardModal] 📎 Iniciando upload do arquivo:', file.name);
    
    try {
      const uploadResult = await taskService.uploadAttachment(file);
      
      // Sucesso - adicionar attachment à task
      console.log('[CardModal] ✅ Upload successful:', uploadResult);
      
      // Adicionar ao formulário
      const currentAttachments = form.getFieldValue('attachments') || [];
      form.setFieldValue('attachments', [
        ...currentAttachments,
        {
          id: uploadResult.name,
          name: uploadResult.name,
          url: uploadResult.url,
          size: uploadResult.size,
          type: uploadResult.type
        }
      ]);
      
      clearError(); // Limpar qualquer erro anterior
      
    } catch (error: any) {
      console.log('[CardModal] ❌ Erro capturado no upload:', error);
      handleUploadError(error); // Captura e exibe erro
    }
  };

  // No JSX do formulário - adicionar após os campos de anexo
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-notion-sidebar border border-notion-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* ... header e outros campos */}
        
        {/* Erro de Upload */}
        {hasError && (
          <div className="px-8 pb-4">
            <FileUploadError
              error={uploadError}
              onRetry={() => {
                clearError();
                // Limpar input de arquivo se existir
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = '';
                }
              }}
            />
          </div>
        )}
        
        {/* ... resto do formulário */}
      </div>
    </div>
  );
}
