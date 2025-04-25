import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { claudeApiConfig, toggleRealAPI, isApiConfigured } from '@/config/api-config';
import { ServerIcon, Loader2 } from 'lucide-react';

/**
 * Component for toggling between real API and simulation mode
 * This would typically only be shown in development environments
 */
const APIToggle: React.FC = () => {
  const [isRealAPI, setIsRealAPI] = useState(claudeApiConfig.USE_REAL_API);
  const [apiKey, setApiKey] = useState(claudeApiConfig.API_KEY);
  const [isSaving, setIsSaving] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  // This is just for development, showing only in dev mode
  useEffect(() => {
    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
    setShowToggle(isDev);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsSaving(true);
    
    // Simulate a slight delay as if we're saving the setting
    setTimeout(() => {
      const newState = toggleRealAPI();
      setIsRealAPI(newState);
      setIsSaving(false);
    }, 500);
  };

  const handleSaveKey = () => {
    setIsSaving(true);

    // Simulate saving API key
    setTimeout(() => {
      // In a real app, this would securely store the API key
      claudeApiConfig.API_KEY = apiKey;
      setIsSaving(false);
    }, 500);
  };

  if (!showToggle) return null;

  return (
    <Card className="border-dashed border-yellow-500/50 bg-yellow-50/30 w-96 absolute bottom-4 right-4 z-50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ServerIcon className="h-4 w-4 text-yellow-600" />
          Developer Settings (Claude 3.7 Sonnet)
        </CardTitle>
        <CardDescription>
          Configure API settings (development only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="api-mode" 
            checked={isRealAPI}
            onCheckedChange={handleToggle}
            disabled={isSaving || (!isApiConfigured() && !isRealAPI)}
          />
          <Label htmlFor="api-mode" className="cursor-pointer">Use Real API</Label>
          {isSaving && <Loader2 className="animate-spin h-4 w-4 ml-2" />}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex space-x-2">
            <Input 
              type="password" 
              id="api-key" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="flex-1"
            />
            <Button size="sm" onClick={handleSaveKey} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-2 px-6 justify-end">
        <p className="text-xs text-muted-foreground italic">Status: {isRealAPI ? 'Using real API' : 'Using simulation'}</p>
      </CardFooter>
    </Card>
  );
};

export default APIToggle; 