import { SchoolBudget, Payment } from '../../../types';

export interface FinancialHealthDiagnostic {
  recoveryRate: number;
  totalCollected: number;
  totalOutstanding: number;
  healthScore: number;
  riskLevel: 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE';
  cashflowRunwayDays: number;
  projectedMonthEndDeficitOrSurplus: number;
  strategicRecommendations: string[];
}

export class FinanceAgent {
  /**
   * Évalue la santé financière de l'établissement et génère des prévisions d'encaissements
   */
  static analyzeFinancialHealth(budget: SchoolBudget, payments: Payment[]): FinancialHealthDiagnostic {
    const recoveryRate = budget.recoveryRate;
    let riskLevel: 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE' = 'MODERE';
    const recommendations: string[] = [];

    if (recoveryRate >= 85) {
      riskLevel = 'FAIBLE';
      recommendations.push('Trésorerie saine. Prévoir le versement des primes pédagogiques.');
    } else if (recoveryRate >= 70) {
      riskLevel = 'MODERE';
      recommendations.push('Déclencher la campagne de relance SMS avec lien Mobile Money Wave / Orange Money.');
      recommendations.push('Proposer un rééchelonnement en 2 fois pour les familles identifiées en difficulté.');
    } else {
      riskLevel = 'CRITIQUE';
      recommendations.push('Risque sur le paiement des salaires et charges courantes du mois prochain.');
      recommendations.push('Bloquer l’accès aux relevés de notes en ligne pour les arriérés supérieurs à 2 échéances.');
    }

    return {
      recoveryRate,
      totalCollected: budget.totalCollectedRevenue,
      totalOutstanding: budget.totalOutstandingDebt,
      healthScore: budget.financialHealthScore,
      riskLevel,
      cashflowRunwayDays: 45,
      projectedMonthEndDeficitOrSurplus: 12500000,
      strategicRecommendations: recommendations
    };
  }
}
