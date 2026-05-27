<template>
  <div class="insight-card glass-card">
    <div class="insight-header">
      <div class="alert-icon">💡</div>
      <div>
        <h2 class="insight-title">{{ translations.title[lang] }}</h2>
        <p class="insight-subtitle">{{ translations.subtitle[lang] }}</p>
      </div>
    </div>

    <!-- Bottleneck Details Panel -->
    <div class="bottleneck-detail-panel">
      <div class="bottleneck-pill">
        <span class="pulse-indicator"></span>
        <span class="pill-lbl">{{ translations.bottleneckLabel[lang] }}</span>
      </div>

      <h3 class="bottleneck-step-name">
        {{ bottleneckStep.name }} <span class="step-type">({{ bottleneckStep.type }})</span>
      </h3>

      <p class="bottleneck-summary-text">
        {{ translations.summaryStart[lang] }} 
        <strong>{{ bottleneckStep.dropoffRate.toFixed(1) }}%</strong> 
        {{ translations.summaryMiddle[lang] }} 
        <strong>{{ formatNumber(bottleneckStep.peopleLost) }}</strong> 
        {{ translations.summaryEnd[lang] }}
      </p>

      <div class="impact-indicator">
        <div class="impact-bar-track">
          <div class="impact-bar-fill" :style="{ width: bottleneckStep.dropoffRate + '%' }"></div>
        </div>
        <div class="impact-text-row">
          <span>{{ translations.relLoss[lang] }}: {{ bottleneckStep.dropoffRate.toFixed(1) }}%</span>
          <span>{{ translations.totalLossImpact[lang] }}: {{ bottleneckStep.absoluteImpact.toFixed(1) }}%</span>
        </div>
      </div>
    </div>

    <!-- Rule-Based Optimization Recommendations -->
    <div class="recommendations-section">
      <h4 class="recommendations-heading">🛠️ {{ translations.actionsTitle[lang] }}</h4>
      <div class="recommendations-list">
        <div 
          v-for="(rec, index) in recList" 
          :key="index"
          class="rec-item"
        >
          <div class="rec-item-header">
            <span :class="['impact-badge', `impact-${rec.impact}`]">
              {{ translations.impactLabel[lang] }}: {{ translations[rec.impact][lang] }}
            </span>
            <h5 class="rec-item-title">{{ lang === 'hu' ? rec.titleHu : rec.titleEn }}</h5>
          </div>
          <p class="rec-item-desc">{{ lang === 'hu' ? rec.descriptionHu : rec.descriptionEn }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CalculatedStep } from '../utils/funnelCalculator';
import { getRecommendations } from '../utils/recommendations';

const props = defineProps<{
  bottleneckStep: CalculatedStep;
  lang: 'hu' | 'en';
}>();

// Shared translations
const translations = {
  title: { hu: 'Elemzés & Megállapítások', en: 'Analysis & Insights' },
  subtitle: { hu: 'A tölcsér adatain alapuló automatikus termékjavaslatok.', en: 'Automated conversion suggestions based on funnel bottlenecks.' },
  bottleneckLabel: { hu: 'FŐ SZŰK KERESZTMETSZET', en: 'CRITICAL BOTTLENECK' },
  summaryStart: { hu: 'A felhasználók', en: 'A total of' },
  summaryMiddle: { hu: '-a lemorzsolódik ennél a lépésnél, ami', en: 'dropped off at this step, meaning you lost' },
  summaryEnd: { hu: 'elveszített látogatót jelent.', en: 'visitors here.' },
  relLoss: { hu: 'Lemorzsolódási arány', en: 'Step Loss' },
  totalLossImpact: { hu: 'Hatás a teljes tölcsérre', en: 'Total Funnel Impact' },
  actionsTitle: { hu: 'Javasolt optimalizációs lépések', en: 'Recommended Actions' },
  impactLabel: { hu: 'Hatás', en: 'Impact' },
  high: { hu: 'Magas', en: 'High' },
  medium: { hu: 'Közepes', en: 'Medium' },
  low: { hu: 'Alacsony', en: 'Low' }
};

const recList = computed(() => {
  return getRecommendations(props.bottleneckStep.type, props.bottleneckStep.dropoffRate);
});

function formatNumber(num: number): string {
  return num.toLocaleString();
}
</script>

<style scoped src="./InsightCard.css"></style>
