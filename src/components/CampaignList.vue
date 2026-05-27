<template>
  <div class="campaign-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">{{ translations.campaigns[lang] }}</h2>
      <div class="campaign-count">{{ filteredCampaigns.length }} {{ translations.items[lang] }}</div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-box">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="search-icon">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="translations.searchPlaceholder[lang]"
          class="search-input"
        />
      </div>

      <div class="device-filter-row">
        <span class="filter-label">{{ translations.device[lang] }}:</span>
        <div class="btn-group">
          <button 
            type="button" 
            class="btn-group-item" 
            :class="{ active: deviceFilter === 'all' }"
            @click="deviceFilter = 'all'"
          >
            {{ translations.all[lang] }}
          </button>
          <button 
            type="button" 
            class="btn-group-item" 
            :class="{ active: deviceFilter === 'desktop' }"
            @click="deviceFilter = 'desktop'"
          >
            Desktop
          </button>
          <button 
            type="button" 
            class="btn-group-item" 
            :class="{ active: deviceFilter === 'mobile' }"
            @click="deviceFilter = 'mobile'"
          >
            Mobile
          </button>
        </div>
      </div>
    </div>

    <!-- Campaign List Scroll Area -->
    <div class="campaign-list">
      <div 
        v-for="camp in filteredCampaigns" 
        :key="camp.id"
        class="campaign-item glass-card"
        :class="{ active: selectedId === camp.id }"
        @click="selectCampaign(camp)"
      >
        <div class="campaign-item-header">
          <h3 class="campaign-name">{{ camp.name }}</h3>
          <span :class="['badge', `badge-${camp.device}`]">
            {{ camp.device }}
          </span>
        </div>

        <div class="campaign-item-metrics">
          <div class="metric-block">
            <span class="metric-label">{{ translations.views[lang] }}</span>
            <span class="metric-value">{{ formatNumber(camp.firstStepViews) }}</span>
          </div>
          <div class="metric-block align-right">
            <span class="metric-label">{{ translations.conversion[lang] }}</span>
            <span class="metric-value conversion-highlight" :style="{ color: getConversionColor(camp.overallConversion) }">
              {{ camp.overallConversion.toFixed(1) }}%
            </span>
          </div>
        </div>

        <div v-if="camp.bottleneck" class="campaign-item-bottleneck">
          <span class="bottleneck-icon">⚠️</span>
          <span class="bottleneck-text">
            <strong>{{ translations.bottleneck[lang] }}:</strong> 
            {{ camp.bottleneck.name }} ({{ camp.bottleneck.dropoffRate.toFixed(0) }}% {{ translations.dropoff[lang] }})
          </span>
        </div>
      </div>

      <div v-if="filteredCampaigns.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
        </svg>
        <p>{{ translations.noCampaigns[lang] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateFunnelMetrics, type Campaign } from '../utils/funnelCalculator';

const props = defineProps<{
  campaigns: Campaign[];
  selectedId: string;
  lang: 'hu' | 'en';
}>();

const emit = defineEmits<{
  (e: 'select', campaign: Campaign): void;
}>();

const searchQuery = ref('');
const deviceFilter = ref<'all' | 'desktop' | 'mobile'>('all');

// Shared translations
const translations = {
  campaigns: { hu: 'Kampányok', en: 'Campaigns' },
  items: { hu: 'db', en: 'items' },
  searchPlaceholder: { hu: 'Keresés név alapján...', en: 'Search campaigns...' },
  device: { hu: 'Eszköz', en: 'Device' },
  all: { hu: 'Mind', en: 'All' },
  views: { hu: 'Látogatók', en: 'Initial Views' },
  conversion: { hu: 'Konverzió', en: 'Overall Conv.' },
  bottleneck: { hu: 'Fő probléma', en: 'Bottleneck' },
  dropoff: { hu: 'lemorzsolódás', en: 'drop-off' },
  noCampaigns: { hu: 'Nincs találat a szűrésnek megfelelően.', en: 'No campaigns match your filters.' }
};

// Compute summary data for display in list items
const campaignsWithMetrics = computed(() => {
  return props.campaigns.map(camp => {
    const metrics = calculateFunnelMetrics(camp);
    return {
      ...camp,
      overallConversion: metrics.overallConversion,
      firstStepViews: metrics.totalViews,
      bottleneck: metrics.bottleneckStep
    };
  });
});

// Filtering
const filteredCampaigns = computed(() => {
  return campaignsWithMetrics.value.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDevice = deviceFilter.value === 'all' || camp.device === deviceFilter.value;
    return matchesSearch && matchesDevice;
  });
});

function selectCampaign(camp: Campaign) {
  emit('select', camp);
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function getConversionColor(rate: number): string {
  if (rate >= 12) return 'var(--accent-success)';
  if (rate >= 5) return 'var(--accent-warning)';
  return 'var(--accent-danger)';
}
</script>

<style scoped src="./CampaignList.css"></style>
