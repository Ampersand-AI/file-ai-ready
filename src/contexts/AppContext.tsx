import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FilingType = 'patent' | 'trademark' | null;

export interface IFileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  category: string;
}

export interface AppContextType {
  filingType: FilingType;
  setFilingType: (type: FilingType) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  uploadedFiles: IFileUpload[];
  addFile: (file: IFileUpload) => void;
  removeFile: (id: string) => void;
  complianceScore: number;
  updateComplianceScore: (score: number) => void;
  aiSuggestionHistory: Record<string, string[]>;
  addAISuggestion: (fieldId: string, suggestion: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filingType, setFilingType] = useState<FilingType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<IFileUpload[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [aiSuggestionHistory, setAISuggestionHistory] = useState<Record<string, string[]>>({});

  const updateFormData = (data: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const addFile = (file: IFileUpload) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const updateComplianceScore = (score: number) => {
    setComplianceScore(score);
  };

  const addAISuggestion = (fieldId: string, suggestion: string) => {
    setAISuggestionHistory((prev) => {
      const existingSuggestions = prev[fieldId] || [];
      
      // Don't add duplicate suggestions
      if (existingSuggestions.includes(suggestion)) {
        return prev;
      }
      
      return {
        ...prev,
        [fieldId]: [...existingSuggestions, suggestion],
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        filingType,
        setFilingType,
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        uploadedFiles,
        addFile,
        removeFile,
        complianceScore,
        updateComplianceScore,
        aiSuggestionHistory,
        addAISuggestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
