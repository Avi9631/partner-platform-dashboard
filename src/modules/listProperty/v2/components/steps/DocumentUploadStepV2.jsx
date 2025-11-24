import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Trash2,
  Plus,
  Info,
  Check,
  ChevronsUpDown,
  Tags
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldLabel,
} from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import ProTipV2 from '../shared/ProTipV2';

// Maximum file size
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Accepted file types
const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Default category suggestions
const DEFAULT_CATEGORIES = [
  'Ownership Documents',
  'Legal Documents',
  'Approval Documents',
  'Title Deed',
  'Sale Deed',
  'Registration Papers',
  'NOC',
  'Encumbrance Certificate',
  'Building Approval',
  'Occupancy Certificate',
  'RERA Certificate',
  'Tax Receipt',
  'Utility Bills',
  'Bank Documents',
  'Survey Documents',
  'Other',
];

export default function DocumentUploadStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  const [documents, setDocuments] = useState(formData?.documents || []);
  const [uploadErrors, setUploadErrors] = useState([]);
  
  // Track all categories (default + user-added)
  const [allCategories, setAllCategories] = useState(() => {
    // Extract unique categories from existing documents
    const existingCategories = (formData?.documents || [])
      .map(doc => doc.category)
      .filter(Boolean);
    const uniqueExisting = [...new Set(existingCategories)];
    
    // Combine with defaults, removing duplicates
    const combined = [...DEFAULT_CATEGORIES, ...uniqueExisting];
    return [...new Set(combined)];
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      documents: formData?.documents || [],
    },
  });

  const { setValue } = methods;

  // Optional step, can always continue
  const isValid = true;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle document upload (no category parameter - will be set per document)
  const handleDocumentUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const newErrors = [];
    const validDocuments = [];

    files.forEach((file) => {
      // Validate file type
      if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.`);
        return;
      }

      // Validate file size
      if (file.size > MAX_DOCUMENT_SIZE) {
        newErrors.push(`${file.name}: File too large. Maximum size is 10MB.`);
        return;
      }

      validDocuments.push({
        id: `doc-${Date.now()}-${Math.random()}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category: '',
        title: '',
        description: '',
        docType: '',
        uploadedAt: new Date().toISOString(),
      });
    });

    if (newErrors.length > 0) {
      setUploadErrors(newErrors);
      setTimeout(() => setUploadErrors([]), 5000);
    }

    if (validDocuments.length > 0) {
      const updatedDocuments = [...documents, ...validDocuments];
      setDocuments(updatedDocuments);
      setValue('documents', updatedDocuments, { shouldValidate: true });
    }

    // Reset input
    e.target.value = '';
  }, [documents, setValue]);

  // Update document metadata
  const updateDocumentMetadata = useCallback((id, field, value) => {
    const updated = documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    setDocuments(updated);
    setValue('documents', updated, { shouldValidate: true });
    
    // If category field is updated and it's a new category, add it to the list
    if (field === 'category' && value && !allCategories.includes(value)) {
      setAllCategories(prev => [...prev, value]);
    }
  }, [documents, setValue, allCategories]);

  // Remove document
  const removeDocument = useCallback((id) => {
    const updated = documents.filter(doc => doc.id !== id);
    setDocuments(updated);
    setValue('documents', updated, { shouldValidate: true });
  }, [documents, setValue]);

  // Handle form submission
  const handleContinue = () => {
    const data = {
      documents,
    };
    saveAndContinue(data);
  };

  // Pro tips for document upload
  const documentTips = [
    'Ensure all documents are clear and legible before uploading',
    'Upload certified copies of legal documents when possible',
    'PDFs are preferred for better compatibility and security',
    'Keep original documents ready for verification during site visits',
  ];

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
          Property Documents
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Add legal and ownership documents for verification
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Upload Errors */}
          <AnimatePresence>
            {uploadErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Upload Errors:</p>
                    <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                      {uploadErrors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified Upload Section */}
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="document-upload" className="cursor-pointer flex-shrink-0">
                <input
                  id="document-upload"
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() => document.getElementById('document-upload').click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Documents
                </Button>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  <FileText className="w-3 h-3 mr-1" />
                  {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                </Badge>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    All documents are optional but recommended
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supported: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">No documents uploaded yet</p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Add Documents&quot; to start uploading
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    allCategories={allCategories}
                    onUpdateMetadata={updateDocumentMetadata}
                    onRemove={removeDocument}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <ProTipV2 title="Document Upload Best Practices" tips={documentTips} />
        </div>
      </motion.div>

      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        nextDisabled={!isValid}
        showBack={true}
      />
    </div>
  );
}

/**
 * Document Card Component - Displays individual document with metadata inputs
 */
function DocumentCard({ document, allCategories, onUpdateMetadata, onRemove, formatFileSize }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  
  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return allCategories;
    return allCategories.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [allCategories, categorySearch]);
  
  // Check if search text is a new category (not in list)
  const isNewCategory = categorySearch && 
    !allCategories.some(cat => cat.toLowerCase() === categorySearch.toLowerCase());
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (document.fileType === 'application/pdf') return '📄';
    if (document.fileType.startsWith('image/')) return '🖼️';
    if (document.fileType.includes('word')) return '📝';
    return '📎';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group border-2 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
    >
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* File Icon Thumbnail */}
        <div className="w-full sm:w-28 h-28 sm:h-28 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-4xl sm:text-5xl">{getFileIcon()}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* File Info Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs truncate text-gray-900 dark:text-gray-100">{document.fileName}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatFileSize(document.fileSize)}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={() => onRemove(document.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Document Title - Full Width */}
            <div className="sm:col-span-2">
              <FieldLabel className="text-[10px] mb-1 font-medium">Title</FieldLabel>
              <Input
                placeholder="e.g., Sale Deed Copy"
                value={document.title}
                onChange={(e) => onUpdateMetadata(document.id, 'title', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            
            {/* Doc Type Dropdown */}
            <div>
              <FieldLabel className="text-[10px] mb-1 font-medium flex items-center h-[14px]">Doc Type</FieldLabel>
              <Select
                value={document.docType}
                onValueChange={(value) => onUpdateMetadata(document.id, 'docType', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Category Input */}
            <div>
              <FieldLabel className="text-[10px] mb-1 font-medium flex items-center gap-1 h-[14px]">
                <Tags className="w-2.5 h-2.5" />
                Category
              </FieldLabel>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className={cn(
                      "w-full justify-between h-8 text-xs font-normal",
                      !document.category && "text-muted-foreground"
                    )}
                  >
                    <span className="truncate">{document.category || "Select..."}</span>
                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search or type new category..."
                    value={categorySearch}
                    onValueChange={setCategorySearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isNewCategory ? (
                        <div className="py-2 px-2 text-sm">
                          <p className="text-muted-foreground mb-2">
                            Category not found. Press Enter to add:
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-orange-600 border-orange-500"
                            onClick={() => {
                              onUpdateMetadata(document.id, 'category', categorySearch);
                              setCategoryOpen(false);
                              setCategorySearch('');
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add &quot;{categorySearch}&quot;
                          </Button>
                        </div>
                      ) : (
                        "No categories found."
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredCategories.map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={() => {
                            onUpdateMetadata(document.id, 'category', category);
                            setCategoryOpen(false);
                            setCategorySearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-3 w-3",
                              document.category === category ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
            
            {/* Description Input - Full Width */}
            <div className="sm:col-span-2">
              <FieldLabel className="text-[10px] mb-1 font-medium">Description (Optional)</FieldLabel>
              <Textarea
                placeholder="Add relevant details about this document..."
                value={document.description}
                onChange={(e) => onUpdateMetadata(document.id, 'description', e.target.value)}
                className="text-xs min-h-[52px] resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
