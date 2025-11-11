import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Upload, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const documentTypes = [
  { id: 'registration', label: 'Company Registration Certificate', required: true },
  { id: 'pan', label: 'PAN Card', required: true },
  { id: 'gst', label: 'GST Registration Certificate', required: false },
  { id: 'rera', label: 'RERA Certificate(s)', required: true },
  { id: 'incorporation', label: 'Certificate of Incorporation', required: true },
  { id: 'moa', label: 'Memorandum of Association (MOA)', required: false },
  { id: 'aoa', label: 'Articles of Association (AOA)', required: false },
  { id: 'directors', label: 'List of Directors', required: false },
];

export default function DocumentsUploadStepV2() {
  const { saveAndContinue, previousStep, formData } = useDeveloperFormV2();
  const [uploadedDocs, setUploadedDocs] = useState(formData?.documents || {});

  const handleFileSelect = (docId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload to server and get URL
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }
      }));
    }
  };

  const handleRemoveDoc = (docId) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docId];
      return newDocs;
    });
  };

  const allRequiredUploaded = documentTypes
    .filter(doc => doc.required)
    .every(doc => uploadedDocs[doc.id]);

  const handleContinue = () => {
    saveAndContinue({ documents: uploadedDocs });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Upload Documents
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Please upload all required legal and registration documents
        </p>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24"
      >
        {documentTypes.map((doc, index) => {
          const isUploaded = !!uploadedDocs[doc.id];
          
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              <Card className={cn(
                'border-2 transition-all',
                isUploaded 
                  ? 'border-green-500 bg-green-50/30 dark:bg-green-950/10' 
                  : doc.required 
                    ? 'border-orange-200 hover:border-orange-400' 
                    : 'border-gray-200 hover:border-gray-400'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <FileText className={cn(
                        'w-5 h-5 mt-0.5',
                        isUploaded ? 'text-green-600' : 'text-orange-600'
                      )} />
                      <div>
                        <h4 className="font-semibold text-sm">{doc.label}</h4>
                        {doc.required && !isUploaded && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            Required
                          </Badge>
                        )}
                        {!doc.required && !isUploaded && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isUploaded && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  {isUploaded ? (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">{uploadedDocs[doc.id].name}</p>
                        <p>{(uploadedDocs[doc.id].size / 1024).toFixed(2)} KB</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs flex-1"
                          onClick={() => {
                            const input = document.getElementById(`file-${doc.id}`);
                            input?.click();
                          }}
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveDoc(doc.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full h-9 text-xs"
                      onClick={() => {
                        const input = document.getElementById(`file-${doc.id}`);
                        input?.click();
                      }}
                    >
                      <Upload className="w-3 h-3 mr-2" />
                      Upload File
                    </Button>
                  )}

                  <input
                    id={`file-${doc.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileSelect(doc.id, e)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-24 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg"
      >
        <p className="text-sm text-orange-900 dark:text-orange-100">
          <strong>Note:</strong> Accepted formats: PDF, JPG, PNG. Maximum file size: 5MB per document.
        </p>
      </motion.div>

      {/* Save & Continue Footer */}
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        nextDisabled={!allRequiredUploaded}
        showBack={true}
      />
    </div>
  );
}
