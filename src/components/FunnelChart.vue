<template>
  <div class="funnel-container">
    <div class="funnel-header">
      <h2 class="funnel-title">{{ translations.title[lang] }}</h2>
      <p class="funnel-subtitle">{{ translations.subtitle[lang] }}</p>
    </div>

    <!-- Funnel Steps Pipeline -->
    <div class="pipeline">
      <div v-for="(step, index) in metrics.calculatedSteps" :key="step.id" class="pipeline-node">
        
        <!-- Funnel Step Card -->
        <div 
          class="step-card glass-card"
          :class="{ 'bottleneck-active': step.isBottleneck }"
        >
          <div class="step-card-header">
            <div class="step-badge-number">#{{ index + 1 }}</div>
            <div class="step-meta">
              <h3 class="step-name">{{ step.name }}</h3>
              <span class="step-type-badge">{{ step.type.toUpperCase() }}</span>
            </div>
            
            <div v-if="step.isBottleneck" class="badge badge-bottleneck pulse-hazard">
              🚨 {{ translations.bottleneckBadge[lang] }}
            </div>
          </div>

          <p class="step-desc">{{ step.description }}</p>

          <!-- Metric Rows -->
          <div class="step-metrics-grid">
            <div class="step-stat">
              <span class="stat-lbl">{{ translations.views[lang] }}</span>
              <span class="stat-val">{{ formatNumber(step.views) }}</span>
              <!-- Percentage of initial views -->
              <span class="stat-sub">
                {{ index === 0 ? '100' : getPercentageOfTotal(step.views) }}% {{ translations.ofInitial[lang] }}
              </span>
            </div>

            <div class="step-stat">
              <span class="stat-lbl">
                {{ index === metrics.calculatedSteps.length - 1 ? translations.finalProceeds[lang] : translations.proceeds[lang] }}
              </span>
              <span class="stat-val font-success">{{ formatNumber(step.proceeds) }}</span>
              <span class="stat-sub">
                {{ step.conversionRate.toFixed(1) }}% {{ translations.converted[lang] }}
              </span>
            </div>
          </div>

          <!-- Progress Bar representing size relative to top-of-funnel -->
          <div class="funnel-bar-container">
            <div 
              class="funnel-bar-fill"
              :class="{ 'fill-danger': step.isBottleneck }"
              :style="{ width: getPercentageOfTotal(step.views) + '%' }"
            ></div>
            <div 
              class="funnel-bar-proceeds"
              :style="{ width: getPercentageOfTotal(step.proceeds) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Connection / Drop-off Bridge between steps (except for the last step) -->
        <div v-if="index < metrics.calculatedSteps.length - 1" class="bridge-container">
          <div class="bridge-line" :class="{ 'bridge-line-danger': step.isBottleneck }">
            <div class="bridge-arrow"></div>
          </div>

          <!-- Drop-off details card -->
          <div 
            class="bridge-card glass-card"
            :class="{ 'danger-glow': step.isBottleneck }"
          >
            <div class="bridge-card-header">
              <span class="bridge-title">{{ translations.dropoffTitle[lang] }}</span>
              <span class="loss-count">-{{ formatNumber(step.peopleLost) }} {{ translations.visitors[lang] }}</span>
            </div>
            
            <div class="bridge-stats">
              <div class="bridge-stat-box text-danger">
                <span class="bridge-stat-value">{{ step.dropoffRate.toFixed(1) }}%</span>
                <span class="bridge-stat-desc">{{ translations.relDropoff[lang] }}</span>
              </div>
              
              <div class="bridge-divider"></div>

              <div class="bridge-stat-box text-muted">
                <span class="bridge-stat-value">{{ step.absoluteImpact.toFixed(1) }}%</span>
                <span class="bridge-stat-desc">{{ translations.absImpact[lang] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Final Funnel Completion (After last step) -->
        <div v-else class="funnel-footer-badge">
          <div class="completion-card glass-card">
            <div class="trophy-icon">🏆</div>
            <div class="completion-details">
              <span class="completion-label">{{ translations.overallSuccess[lang] }}</span>
              <span class="completion-value">
                {{ metrics.overallConversion.toFixed(2) }}%
              </span>
              <span class="completion-subtext">
                {{ formatNumber(metrics.totalProceeds) }} {{ translations.completedFlow[lang] }} {{ formatNumber(metrics.totalViews) }} {{ translations.startingUsers[lang] }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FunnelMetrics } from '../utils/funnelCalculator';

const props = defineProps<{
  metrics: FunnelMetrics;
  lang: 'hu' | 'en';
}>();

// Shared translations
const translations = {
  title: { hu: 'Tölcsér Folyamat', en: 'Funnel Pipeline' },
  subtitle: { hu: 'A látogatók útja a lépések között és a lemorzsolódási arányok.', en: 'The path of visitors through steps and corresponding drop-off rates.' },
  views: { hu: 'Megtekintés (Views)', en: 'Views' },
  proceeds: { hu: 'Továbbhaladt (Proceeds)', en: 'Proceeds' },
  finalProceeds: { hu: 'Befejezte (Success)', en: 'Completed' },
  converted: { hu: 'konvertált', en: 'converted' },
  ofInitial: { hu: 'a kezdőből', en: 'of initial' },
  bottleneckBadge: { hu: 'FŐ SZŰK KERESZTMETSZET', en: 'MAJOR BOTTLENECK' },
  dropoffTitle: { hu: 'Lemorzsolódás a következő lépés előtt', en: 'Drop-off before next step' },
  visitors: { hu: 'látogató', en: 'visitors' },
  relDropoff: { hu: 'Relatív lemorzsolódás', en: 'Relative Drop-off' },
  absImpact: { hu: 'Hatás a teljes forgalomra', en: 'Total Traffic Impact' },
  overallSuccess: { hu: 'Teljes kampány konverzió', en: 'Overall Campaign Conversion' },
  completedFlow: { hu: 'felhasználó ért célba a(z)', en: 'users completed from' },
  startingUsers: { hu: 'kiinduló látogatóból.', en: 'starting visitors.' }
};

function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Returns the percentage representation of a step's views relative to the first step.
 */
function getPercentageOfTotal(views: number): number {
  if (props.metrics.totalViews === 0) return 0;
  return (views / props.metrics.totalViews) * 100;
}
</script>

<style scoped src="./FunnelChart.css"></style>
