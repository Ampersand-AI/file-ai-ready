import { claudeApiConfig } from '@/config/api-config';

interface ClaudeResponse {
  suggestions: string[];
  error?: string;
}

export interface GenerateSuggestionsParams {
  input: string;
  fieldType: string;
  maxSuggestions?: number;
}

/**
 * Service for interacting with Claude 3.7 Sonnet API
 * This would typically call the actual Claude API in production
 */
export class ClaudeService {
  /**
   * Generate AI suggestions using Claude 3.7 Sonnet
   */
  static async generateSuggestions({
    input,
    fieldType,
    maxSuggestions = 4
  }: GenerateSuggestionsParams): Promise<ClaudeResponse> {
    try {
      // Check if real API is enabled
      const USE_REAL_API = claudeApiConfig.USE_REAL_API;
      
      if (USE_REAL_API) {
        // Real API call to Claude
        const response = await fetch(claudeApiConfig.ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiConfig.API_KEY,
            'anthropic-version': claudeApiConfig.API_VERSION
          },
          body: JSON.stringify({
            model: claudeApiConfig.MODEL,
            max_tokens: claudeApiConfig.MAX_TOKENS,
            temperature: claudeApiConfig.TEMPERATURE,
            messages: [
              {
                role: 'user',
                content: `Generate ${maxSuggestions} helpful suggestions for a user filling out a "${fieldType}" 
                field in a trademark/patent application form. They've entered: "${input}".
                Provide suggestions that would help them improve their entry.
                Return ONLY the suggestions as a JSON array of strings without any explanation or context.`
              }
            ]
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Claude API error:', errorData);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse the response - Claude returns content as an array of objects
        if (data && data.content && Array.isArray(data.content)) {
          try {
            // Extract the text from the first content item
            const contentText = data.content[0].text;
            // Parse the JSON array of suggestions
            const suggestions = JSON.parse(contentText);
            
            if (Array.isArray(suggestions)) {
              return { suggestions: suggestions.slice(0, maxSuggestions) };
            }
          } catch (parseError) {
            console.error('Error parsing Claude response:', parseError);
          }
        }
        
        // Fallback if parsing fails
        return {
          suggestions: ["Please try again with more specific details"],
          error: "Unable to process the AI response"
        };
      } else {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use the simulation for development/testing
        return {
          suggestions: this.getAdvancedSuggestions(fieldType, input, maxSuggestions)
        };
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      return {
        suggestions: [],
        error: 'Failed to generate suggestions. Please try again.'
      };
    }
  }

  /**
   * Advanced suggestion generator simulating Claude 3.7 Sonnet capabilities
   * In production, this would be replaced with actual API calls
   */
  private static getAdvancedSuggestions(fieldType: string, input: string, maxSuggestions: number): string[] {
    // This simulates more advanced, contextual suggestions that Claude 3.7 Sonnet would provide
    let suggestions: string[] = [];
    
    const cleanInput = input.toLowerCase().trim();
    
    // Simulate Claude analyzing the input and generating contextual suggestions
    switch (fieldType) {
      case 'trademark-name':
        if (cleanInput.length < 5) {
          suggestions = [
            "Consider a more distinctive name that isn't merely descriptive of your products/services",
            "Check USPTO's TESS database to ensure your proposed mark doesn't conflict with existing registrations",
            "If using common words, add unique elements to make your mark more distinctive and protectable",
            "Consider how your mark will appear visually in various marketing contexts"
          ];
        } else if (/\s/.test(cleanInput)) {
          // Multi-word mark
          suggestions = [
            "Your multi-word mark may qualify for stronger protection than single descriptive words",
            `Consider registering "${cleanInput.split(' ')[0]}" separately for broader protection`,
            "Verify that no part of your mark translates to something problematic in major foreign markets",
            "Check for unintended meanings or connotations in slang or other languages"
          ];
        } else if (/[0-9]/.test(cleanInput)) {
          // Contains numbers
          suggestions = [
            "Marks containing numbers can be distinctive, but ensure it's not merely a model number",
            "Consider how your mark will be pronounced when it contains both letters and numbers",
            "Verify the numbers don't have negative cultural associations in target markets",
            "Register both the numeric (123) and spelled-out (one-two-three) versions if relevant"
          ];
        } else {
          suggestions = [
            `"${input}" appears to be a single word mark - ensure it's not merely descriptive of your goods/services`,
            "Consider whether a logo or design element would strengthen your brand identity",
            "Search social media platforms to ensure the name isn't already in use in your industry",
            "Verify domain name availability for your potential trademark"
          ];
        }
        break;
        
      case 'owner-info':
        if (cleanInput.includes("llc") || cleanInput.includes("inc") || cleanInput.includes("corporation")) {
          suggestions = [
            "Ensure your entity name exactly matches your state business registration",
            "Include your state of incorporation or organization",
            "Verify that the signing party has legal authority to represent the entity",
            "Consider whether any DBAs or alternative names should be included in the application"
          ];
        } else {
          suggestions = [
            "For individual ownership, use your full legal name as it appears on official documents",
            "If filing as an individual, consider whether a business entity might offer better protection",
            "Ensure your address information is current and matches other legal documents",
            "Consider privacy implications - registered trademark information becomes public record"
          ];
        }
        break;
        
      case 'business-description':
        if (cleanInput.includes("software") || cleanInput.includes("app") || cleanInput.includes("digital")) {
          suggestions = [
            "Specify the primary functions and purpose of your software or application",
            "Identify target industries and specific user problems your technology solves",
            "Mention deployment methods (cloud, on-premise, mobile) to help with classification",
            "Distinguish between software products vs. software services if applicable"
          ];
        } else if (cleanInput.includes("consult") || cleanInput.includes("service") || cleanInput.includes("advise")) {
          suggestions = [
            "Detail specific services offered rather than general 'consulting services'",
            "Identify the specific industries or markets you serve",
            "Mention delivery methods (in-person, virtual, subscription-based)",
            "Describe qualification or certification requirements for your services"
          ];
        } else {
          suggestions = [
            "Be more specific about your exact products or services to ensure proper classification",
            "Include your primary industry sector and target customers",
            "Mention your geographic scope of operations (local, national, international)",
            "Describe what distinguishes your offerings from competitors"
          ];
        }
        break;
        
      case 'goods-services':
        suggestions = [
          "Use standard terminology found in the USPTO ID Manual for your industry",
          "Group similar items within the same class, but be specific about each item",
          "Balance between breadth (for protection) and specificity (for approval)",
          `For "${input}", consider adding related accessories or complementary services`
        ];
        break;
        
      case 'usage-evidence':
        suggestions = [
          "Provide dated examples showing the exact mark as used in commerce",
          "Ensure specimens clearly show the mark in relation to the goods/services claimed",
          "Include multiple types of evidence (packaging, website, advertisements)",
          "Make sure digital specimens show the URL and date clearly visible"
        ];
        break;
        
      case 'patent-title':
        suggestions = [
          "Use technical terminology specific to your field while remaining concise",
          "Focus on the primary novel feature rather than all aspects of the invention",
          "Avoid person names, trademarks, and marketing terms in the title",
          "Consider broader category terms to maximize scope of protection"
        ];
        break;
        
      case 'patent-description':
        if (cleanInput.length < 100) {
          suggestions = [
            "Expand your description to include all components and their relationships",
            "Add specific examples of how the invention operates in practice",
            "Include multiple embodiments or variations to broaden protection",
            "Describe the problem your invention solves before detailing the solution"
          ];
        } else {
          suggestions = [
            "Ensure you've described the 'best mode' of implementing your invention",
            "Include sufficient detail for a person skilled in the art to reproduce it",
            "Define any specialized terms or non-standard components",
            "Connect your description clearly to the claims you plan to make"
          ];
        }
        break;
        
      case 'patent-claims':
        if (cleanInput.includes("comprising")) {
          suggestions = [
            "Your use of 'comprising' keeps the claim open-ended, which is good for broad protection",
            "Consider adding dependent claims that narrow specific elements",
            "Ensure each element in the claim is supported by your description",
            "Check for potential prior art that might conflict with this particular claim"
          ];
        } else if (cleanInput.includes("consisting of")) {
          suggestions = [
            "'Consisting of' limits your claim to only the listed elements - consider if 'comprising' would be better",
            "Add dependent claims that specify optional features",
            "Consider alternative claiming strategies for different aspects of your invention",
            "This closed-ended claim may be more defensible but offers narrower protection"
          ];
        } else {
          suggestions = [
            "Structure your claim with a preamble, transitional phrase, and body",
            "Use 'comprising' (open-ended) or 'consisting of' (closed) as appropriate",
            "Ensure independent claims capture the broadest reasonable scope",
            "Add multiple dependent claims to protect specific implementations"
          ];
        }
        break;
        
      default:
        suggestions = [
          "Be clear and specific in your description",
          "Provide comprehensive details rather than general statements",
          "Use standard terminology in your field",
          "Focus on distinctive aspects that set your application apart"
        ];
    }
    
    // Context-aware additions based on input content
    if (input.length > 10) {
      if (/[!?]/.test(input)) {
        suggestions.push("Remove unnecessary punctuation like exclamation points from formal application fields");
      }
      
      if (/[A-Z]{5,}/.test(input)) {
        suggestions.push("Avoid using all capital letters in your submission unless referring to an acronym");
      }
      
      if (input.split(' ').some(word => word.length > 15)) {
        suggestions.push("Consider breaking down very long technical terms for clarity");
      }
    }
    
    return suggestions.slice(0, maxSuggestions);
  }
}

export default ClaudeService; 