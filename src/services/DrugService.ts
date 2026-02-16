
export interface DrugData {
  warnings?: string[];
  pregnancy?: string[];
  geriatric?: string[];
  adverseReactions?: string[];
  brandName?: string;
  genericName?: string;
}

export interface InteractionResult {
  severity: string;
  description: string;
  source: string;
}

import { getMockSideEffects, SideEffect } from '../utils/mockAI';

export interface DrugData {
  warnings?: string[];
  pregnancy?: string[];
  geriatric?: string[];
  adverseReactions?: string[];
  brandName?: string;
  genericName?: string;
  mockSideEffects?: SideEffect[]; // Added to carry our mock data
}

export interface InteractionResult {
  severity: string;
  description: string;
  source: string;
}

// const OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json";
// const RXNAV_BASE_URL = "https://rxnav.nlm.nih.gov/REST";
// const INTERACTION_BASE_URL = "https://lhncbc.nlm.nih.gov/RxNav/APIs/api/interaction/list.json";

export const DrugService = {
  /**
   * Fetches drug labeling information from OpenFDA.
   * Note: This is a simplified fetch. OpenFDA results can be complex.
   */
  async fetchDrugData(drugName: string): Promise<DrugData | null> {
    // MOCK DATA IMPLEMENTATION
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(() => resolve(null), 800));

        const sideEffects = getMockSideEffects(drugName);
        
        // Return a structure that matches DrugData but populated with our mock content
        // We map our mock side effects to the specific fields if needed
        const mainWarning = sideEffects.find(s => s.warningMessage)?.warningMessage || "Use with caution.";
        const pregnancyWarning = sideEffects.find(s => s.condition === 'pregnant')?.warningMessage;
        
        return {
            brandName: drugName.toUpperCase(),
            genericName: drugName.toLowerCase(),
            warnings: [mainWarning],
            pregnancy: pregnancyWarning ? [pregnancyWarning] : [],
            adverseReactions: sideEffects.map(s => s.label),
            mockSideEffects: sideEffects
        };

    } catch (error) {
      console.error("Error fetching drug data:", error);
      return null;
    }
  },

  /**
   * Helper to search for a drug and get its RxCUI (concept unique identifier)
   * used for interaction checking.
   */
  async searchDrugRxCui(drugName: string): Promise<string | null> {
    // Mock RxCUI for everything
    return "123456"; 
  },

  /**
   * Fetches interactions for a list of RxCUIs.
   */
  async fetchInteractions(rxcuids: string[]): Promise<InteractionResult[]> {
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));
    
    // MOCK INTERACTIONS
    return [
        {
            severity: "High",
            description: "Potential interaction: Increased risk of side effects when combined.",
            source: "Mock Interaction DB"
        }
    ];
  }
};
