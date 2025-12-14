import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield,
  Clock,
  Users,
  Ban,
  Volume2,
  Calendar,
  CalendarDays,
  FileText,
  Plus,
  X,
  Edit3,
  Check,
  Search,
  Filter,
  Copy,
  Trash2,
  AlertCircle,
  Info,
  UtensilsCrossed,
  Dog,
  Cigarette
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import rulesRestrictionsPgSchema, { RULE_CATEGORIES, SAMPLE_RULES } from '../../../schemas/rulesRestrictionsPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Icon mapping
const ICON_MAP = {
  Clock,
  Users,
  Ban,
  Cigarette,
  UtensilsCrossed,
  Dog,
  Volume2,
  Calendar,
  CalendarDays,
  FileText,
  Shield
};

export default function RulesRestrictionsPgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingRuleIndex, setEditingRuleIndex] = useState(-1);
  const [newRule, setNewRule] = useState({ key: '', value: '' });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState(null);

  const logger = useMemo(() => createStepLogger('Rules & Restrictions PG Step V2'), []);

  const form = useForm({
    resolver: zodResolver(rulesRestrictionsPgSchema),
    mode: 'onChange',
    defaultValues: {
      rules: formData?.rules || [],
      // Legacy fields for backward compatibility
      gateClosingTime: formData?.gateClosingTime || '',
      visitorPolicy: formData?.visitorPolicy || undefined,
      visitorTimings: formData?.visitorTimings || '',
      isAlcoholAllowed: formData?.isAlcoholAllowed || false,
      alcoholAllowed: formData?.alcoholAllowed || '',
      isSmokingAllowed: formData?.isSmokingAllowed || false,
      smokingAllowed: formData?.smokingAllowed || '',
      smokingArea: formData?.smokingArea || undefined,
      isNonVegAllowed: formData?.isNonVegAllowed || false,
      nonVegAllowed: formData?.nonVegAllowed || '',
      arePetsAllowed: formData?.arePetsAllowed || false,
      petsAllowed: formData?.petsAllowed || '',
      noisePolicy: formData?.noisePolicy || '',
      quietHoursStart: formData?.quietHoursStart || '',
      quietHoursEnd: formData?.quietHoursEnd || '',
      minimumStayPeriod: formData?.minimumStayPeriod || undefined,
      minimumStay: formData?.minimumStay || '',
      noticePeriod: formData?.noticePeriod || undefined,
      moveOutNotice: formData?.moveOutNotice || '',
      additionalRules: formData?.additionalRules || '',
      other: formData?.other || '',
    },
  });

  const { fields: ruleFields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'rules',
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Filter rule categories based on search and category
  const filteredCategories = useMemo(() => {
    return RULE_CATEGORIES.filter(category => {
      const matchesSearch = category.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(RULE_CATEGORIES.map(cat => cat.category))];
    return cats.sort();
  }, []);

  // Add rule from category
  const addRuleFromCategory = (category) => {
    const existingRule = ruleFields.find(rule => rule.key === category.key);
    if (existingRule) {
      // If rule exists, focus on it
      const index = ruleFields.findIndex(rule => rule.key === category.key);
      setEditingRuleIndex(index);
      return;
    }

    append({
      key: category.key,
      value: category.suggestions[0] || ''
    });
    setSelectedRuleCategory(null);
  };

  // Add custom rule
  const addCustomRule = () => {
    if (!newRule.key.trim() || !newRule.value.trim()) return;
    
    // Check for duplicate keys
    const existingRule = ruleFields.find(rule => rule.key.toLowerCase() === newRule.key.toLowerCase());
    if (existingRule) {
      // Update existing rule
      const index = ruleFields.findIndex(rule => rule.key.toLowerCase() === newRule.key.toLowerCase());
      update(index, newRule);
    } else {
      append(newRule);
    }
    
    setNewRule({ key: '', value: '' });
    setShowAddDialog(false);
  };

  // Update rule
  const updateRule = (index, field, value) => {
    const currentRule = ruleFields[index];
    update(index, {
      ...currentRule,
      [field]: value
    });
  };

  // Load sample rules
  const loadSampleRules = () => {
    // Clear existing rules first
    while (ruleFields.length > 0) {
      remove(0);
    }
    
    // Add sample rules
    SAMPLE_RULES.forEach(rule => {
      append(rule);
    });
  };

  // Export rules as JSON
  const exportRules = () => {
    const rulesData = form.getValues('rules');
    const dataStr = JSON.stringify(rulesData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'property-rules.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Rules & Restrictions
        </h2>
        <p className="text-muted-foreground text-sm">
          Define property rules and restrictions to ensure a comfortable living environment
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Rules Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Property Rules ({ruleFields.length})
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadSampleRules}
                  >
                    Load Sample Rules
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={exportRules}
                    disabled={ruleFields.length === 0}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Property Rule</DialogTitle>
                      </DialogHeader>
                      
                      <Tabs defaultValue="categories" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="categories">From Categories</TabsTrigger>
                          <TabsTrigger value="custom">Custom Rule</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="categories" className="space-y-4">
                          {/* Search and Filter */}
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                              <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search rule categories..."
                                className="pl-9"
                              />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Rule Categories Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {filteredCategories.map((category) => {
                              const Icon = ICON_MAP[category.icon] || FileText;
                              const existingRule = ruleFields.find(rule => rule.key === category.key);
                              
                              return (
                                <div
                                  key={category.key}
                                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-orange-500 ${
                                    existingRule ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-muted'
                                  }`}
                                  onClick={() => addRuleFromCategory(category)}
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{category.key}</h4>
                                      <p className="text-xs text-muted-foreground mb-2">
                                        {category.description}
                                      </p>
                                      <Badge variant="outline" className="text-xs">
                                        {category.category}
                                      </Badge>
                                      {existingRule && (
                                        <Badge className="ml-2 text-xs">
                                          <Check className="w-3 h-3 mr-1" />
                                          Added
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="custom" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Rule Name</Label>
                              <Input
                                value={newRule.key}
                                onChange={(e) => setNewRule({ ...newRule, key: e.target.value })}
                                placeholder="e.g., Parking Policy, Laundry Hours..."
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Rule Description</Label>
                              <Textarea
                                value={newRule.value}
                                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                                placeholder="e.g., Parking available for 2-wheelers only..."
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            
                            <Button
                              type="button"
                              onClick={addCustomRule}
                              disabled={!newRule.key.trim() || !newRule.value.trim()}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Custom Rule
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {ruleFields.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Rules Added</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Add property rules to help tenants understand expectations
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadSampleRules}
                  >
                    Load Sample Rules
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {ruleFields.map((rule, index) => {
                      const categoryInfo = RULE_CATEGORIES.find(cat => cat.key === rule.key);
                      const Icon = categoryInfo ? ICON_MAP[categoryInfo.icon] : FileText;
                      const isEditing = editingRuleIndex === index;
                      
                      return (
                        <motion.div
                          key={rule.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border rounded-lg p-4"
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                value={rule.key}
                                onChange={(e) => updateRule(index, 'key', e.target.value)}
                                placeholder="Rule name..."
                                className="font-medium"
                              />
                              <Textarea
                                value={rule.value}
                                onChange={(e) => updateRule(index, 'value', e.target.value)}
                                placeholder="Rule description..."
                                rows={2}
                              />
                              
                              {categoryInfo?.suggestions && (
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">Suggestions:</Label>
                                  <div className="flex flex-wrap gap-1">
                                    {categoryInfo.suggestions.map((suggestion) => (
                                      <Badge
                                        key={suggestion}
                                        variant="outline"
                                        className="cursor-pointer text-xs"
                                        onClick={() => updateRule(index, 'value', suggestion)}
                                      >
                                        {suggestion}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingRuleIndex(-1)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => setEditingRuleIndex(-1)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <Icon className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1">{rule.key}</h4>
                                  <p className="text-sm text-muted-foreground">{rule.value}</p>
                                  {categoryInfo && (
                                    <Badge variant="outline" className="mt-2 text-xs">
                                      {categoryInfo.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingRuleIndex(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Errors */}
          {form.formState.errors.rules && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-400">Rules Validation Error</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {form.formState.errors.rules.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Tips for Effective Rules
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Keep rules clear and specific to avoid confusion</li>
                    <li>• Include timing details where applicable (e.g., "Quiet hours: 10 PM - 7 AM")</li>
                    <li>• Be reasonable and consider tenant comfort</li>
                    <li>• Update rules as needed based on community feedback</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onSaveAndContinue={form.handleSubmit(onSubmit)}
            onBack={previousStep}
            nextDisabled={!form.formState.isValid || ruleFields.length === 0}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}