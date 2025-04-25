import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SparklesIcon, Loader2, AlertTriangle, ServerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAISuggestions } from '@/hooks/use-ai-suggestions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AISuggestionProps {
  title?: string;
  description?: string;
  inputValue?: string | undefined;
  fieldType: string;
  className?: string;
  loading?: boolean;
  minLength?: number;
  onUseSuggestion?: (suggestion: string) => void;
  showUseButtons?: boolean;
}

const AISuggestion: React.FC<AISuggestionProps> = ({
  title = "AI Suggestion",
  description = "Based on your input, consider:",
  inputValue,
  fieldType,
  className,
  loading = false,
  minLength = 3,
  onUseSuggestion,
  showUseButtons = false,
}) => {
  const { suggestions, isLoading, error, isUsingRealAPI } = useAISuggestions({
    input: inputValue,
    fieldType,
    minLength,
  });
  
  const [isDev, setIsDev] = useState(false);
  
  // Only show API mode in development
  useEffect(() => {
    setIsDev(import.meta.env.DEV || window.location.hostname === 'localhost');
  }, []);

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isDev && (
              <Badge variant="outline" className="text-xs h-5 px-1.5 bg-yellow-50/50 border-yellow-500/30 text-yellow-700 flex items-center gap-1">
                <ServerIcon className="h-3 w-3" />
                {isUsingRealAPI ? 'API' : 'Sim'}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs h-5 px-1.5 bg-primary/10">
              AI Powered
            </Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Generating intelligent suggestions...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-transparent border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {suggestions.length > 0 ? (
              <ul className="list-disc ml-5 text-sm text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className={cn(showUseButtons && onUseSuggestion ? "mb-2" : "")}>
                    {suggestion}
                    {showUseButtons && onUseSuggestion && (
                      <button 
                        className="ml-2 text-xs text-primary hover:underline"
                        onClick={() => onUseSuggestion(suggestion)}
                      >
                        Apply
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {inputValue && inputValue.length > 0 
                  ? `Add more details (at least ${minLength} characters) to receive AI suggestions`
                  : "Enter information to receive AI-powered suggestions"}
              </p>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-2 px-6 justify-end">
        <p className="text-xs text-muted-foreground italic">Powered by advanced AI</p>
      </CardFooter>
    </Card>
  );
};

export default AISuggestion; 