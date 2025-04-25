import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AISuggestion from '@/components/ui/ai-suggestion';
import { useToast } from '@/hooks/use-toast';

const TrademarkBasicInfo: React.FC = () => {
  const { formData, updateFormData, addAISuggestion } = useAppContext();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };
  
  const handleUseSuggestion = (suggestion: string) => {
    // Record the suggestion in application history
    addAISuggestion(`trademark-${formData.markName || 'application'}`, suggestion);
    
    // Extract action from suggestion when possible
    if (suggestion.toLowerCase().includes("check") || suggestion.includes("verify")) {
      // Add a verification task
      const existingTasks = formData.verificationTasks || [];
      updateFormData({ 
        verificationTasks: [...existingTasks, {
          id: Date.now().toString(),
          description: suggestion,
          completed: false,
          source: 'ai',
          timestamp: new Date().toISOString()
        }]
      });
      
      toast({
        title: "Task Created",
        description: "Added a verification task based on AI suggestion",
      });
    } else if (suggestion.toLowerCase().includes("consider")) {
      // Add suggestion to consideration list
      const considerations = formData.considerations || [];
      updateFormData({
        considerations: [...considerations, {
          id: Date.now().toString(),
          text: suggestion,
          source: 'ai',
          timestamp: new Date().toISOString()
        }]
      });
      
      toast({
        title: "Consideration Added",
        description: "This insight has been saved to your application notes",
      });
    } else {
      toast({
        title: "Suggestion Applied",
        description: "The AI recommendation has been noted in your application",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="markName">Trademark Name</Label>
        <Input
          id="markName"
          name="markName"
          placeholder="Enter the exact text of your trademark"
          value={formData.markName || ''}
          onChange={handleChange}
        />
        <AISuggestion 
          fieldType="trademark-name" 
          inputValue={formData.markName}
          description="Based on your trademark name, our AI suggests:"
          onUseSuggestion={handleUseSuggestion}
          showUseButtons={true}
        />
      </div>

      <div className="space-y-4">
        <Label>Mark Type</Label>
        <RadioGroup 
          defaultValue={formData.markType || 'standard'} 
          onValueChange={(value) => handleSelectChange('markType', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="cursor-pointer">Standard Character Mark (text only)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="design" id="design" />
            <Label htmlFor="design" className="cursor-pointer">Design Mark (logo or stylized text)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sound" id="sound" />
            <Label htmlFor="sound" className="cursor-pointer">Sound Mark</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.markType === 'design' && (
        <Alert>
          <AlertTitle>Logo Upload Required</AlertTitle>
          <AlertDescription>
            You've selected a Design Mark. Please upload your logo in the Upload Manager section after completing this form.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input
          id="ownerName"
          name="ownerName"
          placeholder="Full legal name of the trademark owner (person or entity)"
          value={formData.ownerName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="ownerType">Owner Type</Label>
        <Select 
          value={formData.ownerType || ''} 
          onValueChange={(value) => handleSelectChange('ownerType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select owner type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="corporation">Corporation</SelectItem>
            <SelectItem value="llc">Limited Liability Company</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="association">Association</SelectItem>
          </SelectContent>
        </Select>
        <AISuggestion 
          fieldType="owner-info" 
          inputValue={formData.ownerName}
          description="AI recommendations for owner information:"
          onUseSuggestion={handleUseSuggestion}
          showUseButtons={true}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="ownerAddress">Owner Address</Label>
        <Textarea
          id="ownerAddress"
          name="ownerAddress"
          placeholder="Full mailing address of the trademark owner"
          rows={3}
          value={formData.ownerAddress || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="filingBasis">Filing Basis</Label>
        <Select 
          value={formData.filingBasis || ''} 
          onValueChange={(value) => handleSelectChange('filingBasis', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filing basis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="use">Use in Commerce (already using the mark)</SelectItem>
            <SelectItem value="intent">Intent to Use (plan to use in the future)</SelectItem>
            <SelectItem value="foreign">Foreign Registration</SelectItem>
            <SelectItem value="treaty">International Treaty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display any saved considerations */}
      {formData.considerations && formData.considerations.length > 0 && (
        <div className="bg-muted/30 p-4 rounded-md border">
          <h3 className="text-sm font-medium mb-2">Saved Considerations</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {formData.considerations.slice(0, 3).map((item: any) => (
              <li key={item.id} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item.text}</span>
              </li>
            ))}
            {formData.considerations.length > 3 && (
              <li className="text-xs italic">+ {formData.considerations.length - 3} more consideration(s)</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrademarkBasicInfo;
