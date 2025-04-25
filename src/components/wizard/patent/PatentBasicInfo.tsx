import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AISuggestion from '@/components/ui/ai-suggestion';
import { useToast } from '@/hooks/use-toast';

const PatentBasicInfo: React.FC = () => {
  const { formData, updateFormData, addAISuggestion } = useAppContext();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  const handleTitleSuggestion = (suggestion: string) => {
    // Record the suggestion
    addAISuggestion(`patent-title-${Date.now()}`, suggestion);
    
    // Extract action from suggestion when possible
    if (suggestion.toLowerCase().includes("technical") || 
        suggestion.toLowerCase().includes("terminology")) {
      toast({
        title: "Title Improvement",
        description: "Consider using more technical terminology in your title",
      });
    } else if (suggestion.toLowerCase().includes("concise") || 
               suggestion.toLowerCase().includes("shorter")) {
      toast({
        title: "Title Format",
        description: "Consider making your title more concise and focused",
      });
    } else {
      toast({
        title: "AI Suggestion Applied",
        description: "This recommendation has been noted in your application",
      });
    }
  };

  const handleDescriptionSuggestion = (suggestion: string) => {
    // Record the suggestion
    addAISuggestion(`patent-description-${Date.now()}`, suggestion);
    
    // Add suggestion to description improvements
    const improvements = formData.descriptionImprovements || [];
    updateFormData({
      descriptionImprovements: [...improvements, {
        id: Date.now().toString(),
        text: suggestion,
        source: 'ai',
        timestamp: new Date().toISOString()
      }]
    });
    
    toast({
      title: "Description Improvement Noted",
      description: "The suggestion has been added to your improvement list",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="inventionTitle">Invention Title</Label>
        <Input
          id="inventionTitle"
          name="inventionTitle"
          placeholder="Enter a clear, concise title for your invention"
          value={formData.inventionTitle || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="inventorNames">Inventor Name(s)</Label>
        <Input
          id="inventorNames"
          name="inventorNames"
          placeholder="Full names of all inventors, separated by commas"
          value={formData.inventorNames || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="inventionType">Type of Patent</Label>
        <Select 
          value={formData.inventionType || ''} 
          onValueChange={(value) => handleSelectChange('inventionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select patent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utility">Utility Patent</SelectItem>
            <SelectItem value="design">Design Patent</SelectItem>
            <SelectItem value="plant">Plant Patent</SelectItem>
            <SelectItem value="provisional">Provisional Patent Application</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="briefSummary">Brief Summary</Label>
        <Textarea
          id="briefSummary"
          name="briefSummary"
          placeholder="Provide a brief summary of your invention (1-2 paragraphs)"
          rows={5}
          value={formData.briefSummary || ''}
          onChange={handleChange}
        />
        <AISuggestion 
          fieldType="patent-title" 
          inputValue={formData.inventionTitle}
          description="AI suggestions for your patent title:"
          title="Title Optimization"
          onUseSuggestion={handleTitleSuggestion}
          showUseButtons={true}
        />
        <AISuggestion 
          fieldType="patent-description" 
          inputValue={formData.briefSummary}
          description="AI recommendations for your description:"
          onUseSuggestion={handleDescriptionSuggestion}
          showUseButtons={true}
        />
      </div>
      
      {/* Display any saved description improvements */}
      {formData.descriptionImprovements && formData.descriptionImprovements.length > 0 && (
        <Card className="bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Description Improvement Notes</CardTitle>
            <CardDescription>AI suggestions for enhancing your description</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {formData.descriptionImprovements.map((item: any, index: number) => (
                <li key={item.id} className="flex items-start">
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatentBasicInfo;
