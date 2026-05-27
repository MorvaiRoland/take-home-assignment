<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import campaignsData from './data/campaigns.json';
import { calculateFunnelMetrics, type Campaign } from './utils/funnelCalculator';
import CampaignList from './components/CampaignList.vue';
import FunnelChart from './components/FunnelChart.vue';
import InsightCard from './components/InsightCard.vue';
import AISimulator from './components/AISimulator.vue';

// Typed Campaign list from JSON
const campaigns = ref<Campaign[]>(campaignsData.campaigns as Campaign[]);

// Selection State: default to first campaign
const selectedCampaign = ref<Campaign>(campaigns.value[0]);

// App Language: 'hu' (Hungarian) or 'en' (English)
const lang = ref<'hu' | 'en'>('hu');

// UI Theme: 'dark' or 'light'
const theme = ref<'dark' | 'light'>('dark');

onMounted(() => {
  // Respect system preference or default to dark
  const savedTheme = localStorage.getItem('funnel-theme');
  if (savedTheme === 'light') {
    toggleTheme('light');
  } else {
    toggleTheme('dark');
  }
});

// Dynamic browser tab title watcher
watch([lang, selectedCampaign], () => {
  if (selectedCampaign.value) {
    document.title = lang.value === 'hu'
      ? `FunnelFlow AI – ${selectedCampaign.value.name}`
      : `FunnelFlow AI – ${selectedCampaign.value.name}`;
  } else {
    document.title = 'FunnelFlow AI';
  }
}, { immediate: true });

function toggleTheme(newTheme?: 'dark' | 'light') {
  if (newTheme) {
    theme.value = newTheme;
  } else {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('funnel-theme', theme.value);
}

function toggleLanguage() {
  lang.value = lang.value === 'hu' ? 'en' : 'hu';
}

function handleSelect(campaign: Campaign) {
  selectedCampaign.value = campaign;
}

// Compute active campaign metrics
const activeMetrics = computed(() => {
  if (!selectedCampaign.value) return null;
  return calculateFunnelMetrics(selectedCampaign.value);
});

// Translation terms for root UI
const translations = {
  subtitle: { hu: 'Popup kampányok tölcsér teljesítménye', en: 'Popup campaign conversion analytics' },
  overallConv: { hu: 'Konverzió', en: 'Conversion' },
  totalViews: { hu: 'Látogató', en: 'Total Views' },
  totalConverts: { hu: 'Célba ért', en: 'Conversions' },
  device: { hu: 'Eszköz', en: 'Device' },
  selectCampaignPrompt: { hu: 'Válassz ki egy kampányt a bal oldali listából.', en: 'Please select a campaign from the sidebar.' }
};

function formatNumber(num: number): string {
  return num.toLocaleString();
}
</script>

<template>
  <div class="app-container">
    
    <!-- Application Header -->
    <header class="app-header">
      <div class="header-title-container">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#ffffff" class="w-6 h-6" style="width:1.25rem; height:1.25rem;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <div>
          <span class="logo-text">FunnelFlow AI</span>
          <span class="header-subtext" style="display:block; font-size:0.675rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.02em;">
            {{ translations.subtitle[lang] }}
          </span>
        </div>
      </div>

      <!-- Controls: Theme and Language -->
      <div class="header-actions">
        <button class="btn-toggle" @click="toggleLanguage" aria-label="Toggle language">
          🌐 <strong>{{ lang.toUpperCase() }}</strong>
        </button>
        <button class="btn-toggle" @click="toggleTheme()" aria-label="Toggle theme">
          <span v-if="theme === 'dark'">☀️ Light</span>
          <span v-else>🌙 Dark</span>
        </button>
      </div>
    </header>

    <!-- Main Dashboard Layout -->
    <main class="main-layout">
      
      <!-- Left Panel: Campaign Selection Sidebar -->
      <aside class="sidebar-wrapper">
        <CampaignList 
          :campaigns="campaigns"
          :selectedId="selectedCampaign?.id"
          :lang="lang"
          @select="handleSelect"
        />
      </aside>

      <!-- Right Panel: Funnel Visualizer Dashboard -->
      <section class="dashboard-content">
        <div v-if="selectedCampaign && activeMetrics" class="dashboard-grid">
          
          <!-- Campaign Overview Hero Banner -->
          <div class="dashboard-hero glass-card">
            <div class="hero-main">
              <div>
                <h1 class="campaign-title">{{ selectedCampaign.name }}</h1>
                <p class="campaign-id">ID: <code>{{ selectedCampaign.id }}</code></p>
              </div>
              <span :class="['badge', `badge-${selectedCampaign.device}`]" style="font-size: 0.85rem; padding: 0.25rem 0.75rem;">
                {{ selectedCampaign.device.toUpperCase() }}
              </span>
            </div>

            <div class="hero-stats-row">
              <div class="hero-stat-card">
                <span class="hero-stat-label">{{ translations.totalViews[lang] }}</span>
                <span class="hero-stat-value">{{ formatNumber(activeMetrics.totalViews) }}</span>
              </div>
              <div class="hero-stat-card">
                <span class="hero-stat-label">{{ translations.totalConverts[lang] }}</span>
                <span class="hero-stat-value text-green">{{ formatNumber(activeMetrics.totalProceeds) }}</span>
              </div>
              <div class="hero-stat-card border-none">
                <span class="hero-stat-label">{{ translations.overallConv[lang] }}</span>
                <span class="hero-stat-value text-indigo">{{ activeMetrics.overallConversion.toFixed(2) }}%</span>
              </div>
            </div>
          </div>

          <!-- Bottom Grid: Left Pipeline vs Right Insights/AI -->
          <div class="dashboard-details-layout">
            <div class="pipeline-section glass-card">
              <FunnelChart 
                :metrics="activeMetrics"
                :lang="lang"
              />
            </div>

            <div class="sidebar-insights-section">
              <InsightCard 
                v-if="activeMetrics.bottleneckStep"
                :bottleneckStep="activeMetrics.bottleneckStep"
                :lang="lang"
              />
              <AISimulator 
                v-if="activeMetrics.bottleneckStep"
                :bottleneckStep="activeMetrics.bottleneckStep"
                :lang="lang"
              />
            </div>
          </div>

        </div>

        <!-- Empty Selection State -->
        <div v-else class="empty-dashboard">
          <p>{{ translations.selectCampaignPrompt[lang] }}</p>
        </div>
      </section>

    </main>
  </div>
</template>

<style src="./App.css"></style>
