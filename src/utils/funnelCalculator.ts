export interface CampaignStep {
  id: string;
  name: string;
  type: string;
  views: number;
  proceeds: number;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  device: string;
  steps: CampaignStep[];
}

export interface CalculatedStep {
  id: string;
  name: string;
  type: string;
  views: number;
  proceeds: number;
  description: string;
  conversionRate: number; // % of visitors who proceeded from this step: (proceeds / views) * 100
  dropoffRate: number;    // % of visitors who dropped off at this step: ((views - proceeds) / views) * 100
  peopleLost: number;     // Absolute number of visitors lost: views - proceeds
  absoluteImpact: number; // Impact of this step's loss on the total starting audience: (peopleLost / startViews) * 100
  isBottleneck: boolean;  // True if this step has the highest relative drop-off rate
}

export interface FunnelMetrics {
  overallConversion: number;
  totalViews: number;
  totalProceeds: number;
  totalLost: number;
  bottleneckStep: CalculatedStep | null;
  calculatedSteps: CalculatedStep[];
}

/**
 * Calculates funnel metrics for a single campaign.
 * Handles single-step and multi-step campaigns gracefully.
 */
export function calculateFunnelMetrics(campaign: Campaign): FunnelMetrics {
  const steps = campaign.steps;
  if (!steps || steps.length === 0) {
    return {
      overallConversion: 0,
      totalViews: 0,
      totalProceeds: 0,
      totalLost: 0,
      bottleneckStep: null,
      calculatedSteps: [],
    };
  }

  const firstStepViews = steps[0].views;
  const lastStepProceeds = steps[steps.length - 1].proceeds;
  
  // Overall conversion is final proceeds divided by initial views
  const overallConversion = firstStepViews > 0 
    ? (lastStepProceeds / firstStepViews) * 100 
    : 0;

  // Calculate metrics for each step
  const calculatedSteps: CalculatedStep[] = steps.map((step) => {
    const conversionRate = step.views > 0 ? (step.proceeds / step.views) * 100 : 0;
    const dropoffRate = 100 - conversionRate;
    const peopleLost = Math.max(0, step.views - step.proceeds);
    const absoluteImpact = firstStepViews > 0 ? (peopleLost / firstStepViews) * 100 : 0;

    return {
      ...step,
      conversionRate,
      dropoffRate,
      peopleLost,
      absoluteImpact,
      isBottleneck: false, // will set below
    };
  });

  // Identify bottleneck: step with highest relative drop-off rate
  // In case of a tie, we look at the one that lost more absolute people.
  let bottleneckIndex = -1;
  let maxDropoff = -1;
  let maxLost = -1;

  calculatedSteps.forEach((step, index) => {
    if (step.dropoffRate > maxDropoff) {
      maxDropoff = step.dropoffRate;
      maxLost = step.peopleLost;
      bottleneckIndex = index;
    } else if (Math.abs(step.dropoffRate - maxDropoff) < 0.0001) {
      // Tie breaker: choose the step that lost more absolute people
      if (step.peopleLost > maxLost) {
        maxLost = step.peopleLost;
        bottleneckIndex = index;
      }
    }
  });

  if (bottleneckIndex !== -1) {
    calculatedSteps[bottleneckIndex].isBottleneck = true;
  }

  return {
    overallConversion,
    totalViews: firstStepViews,
    totalProceeds: lastStepProceeds,
    totalLost: firstStepViews - lastStepProceeds,
    bottleneckStep: bottleneckIndex !== -1 ? calculatedSteps[bottleneckIndex] : null,
    calculatedSteps,
  };
}
