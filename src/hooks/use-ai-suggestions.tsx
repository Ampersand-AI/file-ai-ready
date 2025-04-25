import { useState, useEffect } from 'react';
import ClaudeService from '@/services/claude-service';
import { claudeApiConfig } from '@/config/api-config';

interface UseSuggestionsProps {
  input?: string;
  fieldType: string;
  minLength?: number;
  maxSuggestions?: number;
}

interface UseSuggestionsResult {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  isUsingRealAPI: boolean;
}

/**
 * A hook to generate AI-powered suggestions using Claude 3.7 Sonnet
 */
export function useAISuggestions({
  input,
  fieldType,
  minLength = 3,
  maxSuggestions = 4,
}: UseSuggestionsProps): UseSuggestionsResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingRealAPI, setIsUsingRealAPI] = useState(claudeApiConfig.USE_REAL_API);

  // Reset state when API mode changes
  useEffect(() => {
    setIsUsingRealAPI(claudeApiConfig.USE_REAL_API);
  }, [claudeApiConfig.USE_REAL_API]);

  useEffect(() => {
    // Reset if input is too short
    if (!input || input.trim().length < minLength) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Track current request to handle race conditions
    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    // Generate suggestions using Claude 3.7 Sonnet
    const generateSuggestions = async () => {
      try {
        const response = await ClaudeService.generateSuggestions({
          input,
          fieldType,
          maxSuggestions
        });

        // Only update state if this is still the current request
        if (isCurrent) {
          if (response.error) {
            setError(response.error);
            setSuggestions([]); // Clear suggestions on error
          } else {
            setSuggestions(response.suggestions);
            setError(null); // Clear any previous errors
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isCurrent) {
          console.error('Error generating suggestions:', err);
          setError('Failed to generate suggestions. Please try again.');
          setSuggestions([]);
          setIsLoading(false);
        }
      }
    };

    // Add a slight delay to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      generateSuggestions();
    }, 600);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      isCurrent = false;
    };
  }, [input, fieldType, minLength, maxSuggestions]);

  return { suggestions, isLoading, error, isUsingRealAPI };
}

// Mock suggestion generator - would be replaced with AI service
function getMockSuggestions(type: string, input: string): string[] {
  const suggestions: Record<string, string[]> = {
    'trademark-name': [
      'Ensure your mark is distinctive and not merely descriptive',
      'Consider broader protection with slight variations',
      'Check for potential conflicts with existing marks',
      'Use a strong, memorable mark that relates to your brand identity'
    ],
    'owner-info': [
      'Verify legal name matches other business documents',
      'Ensure address information is current and complete',
      'Consider including DBA or alternative business names if relevant',
      'Make sure entity type selection matches business registration'
    ],
    'business-description': [
      'Be specific about products/services to help with classification',
      'Include key industry terms that relate to your offerings',
      'Describe target markets and distribution channels',
      'Mention unique aspects of your business model'
    ],
    'goods-services': [
      'Be specific about exact products or services',
      'Consider including related items in the same class',
      'Use standard industry terminology for clarity',
      'Group similar items within the same classification'
    ],
    'usage-evidence': [
      'Ensure specimens clearly show the mark as actually used',
      'Use high-quality images showing mark on products/services',
      'Include evidence from multiple channels if available',
      'Ensure dates are accurate and can be verified'
    ],
    'patent-title': [
      'Use technical terms specific to your field',
      'Keep the title concise but descriptive',
      'Avoid unnecessary articles and prepositions',
      'Include key distinctive elements of the invention'
    ],
    'patent-description': [
      'Include sufficient detail for reproduction by skilled person',
      'Describe all possible embodiments and variations',
      'Use clear, precise technical language',
      'Include practical applications and advantages'
    ],
    'patent-claims': [
      'Start with broad independent claims',
      'Add narrower dependent claims',
      'Use precise language to define scope of protection',
      'Ensure claims are supported by the description'
    ],
    'default': [
      'Be clear and specific in your description',
      'Include all relevant details',
      'Use standard terminology in your field',
      'Ensure consistency throughout your application'
    ]
  };

  // Return relevant suggestions or default suggestions
  return suggestions[type] || suggestions['default'];
}

export default useAISuggestions; 