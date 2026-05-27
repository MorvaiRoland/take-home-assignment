<template>
  <div class="ai-simulator glass-card">
    <div class="ai-header">
      <div class="ai-spark-icon">✨</div>
      <div class="ai-meta">
        <h2 class="ai-title">{{ translations.title[lang] }}</h2>
        <span class="ai-badge">GPT-4o / Gemini 1.5</span>
      </div>
    </div>

    <!-- Active State: Done / Loaded -->
    <div v-if="state === 'idle'" class="ai-action-area">
      <p class="ai-prompt-preview">
        <code>GET /api/v1/ai-recommendations?step_type={{ bottleneckStep.type }}&dropoff={{ bottleneckStep.dropoffRate.toFixed(1) }}</code>
      </p>
      
      <button class="btn-generate" @click="generateAIReport">
        <span>✨ {{ translations.generateBtn[lang] }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="state === 'loading'" class="ai-loading-area">
      <div class="ai-spinner"></div>
      <div class="loading-status-ticker">
        <div class="ticker-text">{{ currentStatusText }}</div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Results State -->
    <div v-else-if="state === 'result'" class="ai-result-area">
      <div class="ai-result-header">
        <span class="ai-result-tag">💡 AI Deep-Dive Report</span>
        <button class="btn-reset" @click="reset">
          🔄 {{ translations.reRun[lang] }}
        </button>
      </div>

      <div class="ai-markdown-output">
        <p class="summary-paragraph">
          <strong>{{ translations.analysisSummaryTitle[lang] }}:</strong>
          {{ lang === 'hu' ? currentReport.summaryHu : currentReport.summaryEn }}
        </p>

        <div class="ai-rec-block">
          <h4 class="ai-block-heading">🧪 A/B Test Variant Proposal</h4>
          <div class="variant-grid">
            <div class="variant-col">
              <span class="var-badge original">Control (Current)</span>
              <p class="var-text"><em>{{ bottleneckStep.name }}</em> - Standard popup layout.</p>
            </div>
            <div class="variant-col">
              <span class="var-badge optimized">Variant B (Optimized)</span>
              <p class="var-text"><strong>{{ lang === 'hu' ? currentReport.variantHu : currentReport.variantEn }}</strong></p>
            </div>
          </div>
        </div>

        <div class="ai-rec-block">
          <h4 class="ai-block-heading">🧠 Psychological Trigger Applied</h4>
          <div class="trigger-card">
            <strong>{{ lang === 'hu' ? currentReport.triggerTitleHu : currentReport.triggerTitleEn }}</strong>
            <p>{{ lang === 'hu' ? currentReport.triggerDescHu : currentReport.triggerDescEn }}</p>
          </div>
        </div>

        <div class="ai-rec-block">
          <h4 class="ai-block-heading">💻 Copywriting Recommendation</h4>
          <blockquote class="copy-quote">
            <span class="quote-mark">“</span>
            <p class="quote-text">{{ lang === 'hu' ? currentReport.copyHu : currentReport.copyEn }}</p>
            <span class="quote-mark text-right">”</span>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { CalculatedStep } from '../utils/funnelCalculator';

interface AIReport {
  summaryEn: string;
  summaryHu: string;
  variantEn: string;
  variantHu: string;
  triggerTitleEn: string;
  triggerTitleHu: string;
  triggerDescEn: string;
  triggerDescHu: string;
  copyEn: string;
  copyHu: string;
}

const props = defineProps<{
  bottleneckStep: CalculatedStep;
  lang: 'hu' | 'en';
}>();

const state = ref<'idle' | 'loading' | 'result'>('idle');
const loadingProgress = ref(0);
const currentStatusText = ref('');
const statusIndex = ref(0);

// Reset view if the campaign/bottleneck step changes
watch(() => props.bottleneckStep.id, () => {
  reset();
});

const translations = {
  title: { hu: 'AI Asszisztens (Szimulált)', en: 'AI Co-Pilot (Simulated)' },
  generateBtn: { hu: 'Mélyreható AI elemzés generálása', en: 'Generate AI Deep-Dive' },
  reRun: { hu: 'Újrafuttatás', en: 'Re-run analysis' },
  analysisSummaryTitle: { hu: 'AI Diagnózis', en: 'AI Diagnosis' }
};

const loadingStatuses = {
  hu: [
    'Tölcsér adatok beolvasása...',
    'Eszközspecifikus viselkedés vizsgálata...',
    'Lemezsolódási arányok összehasonlítása iparági benchmarkokkal...',
    'Optimalizációs javaslatok generálása...',
    'Véglegesítés...'
  ],
  en: [
    'Parsing funnel event logs...',
    'Analyzing device-specific interaction patterns...',
    'Benchmarking drop-off metrics against e-commerce standards...',
    'Synthesizing UX and copywriting recommendations...',
    'Finalizing report...'
  ]
};

// Mock data generator for AI reports based on step types
const reports: Record<string, AIReport> = {
  teaser: {
    summaryEn: 'The teaser stage fails to secure micro-commitments. In e-commerce, teasers should convert views to clicks at > 45%. The high drop-off indicates low visibility or lack of clear value. Users feel immediate resistance to popups. A subtle, non-intrusive floating bar with a progress indicator works best.',
    summaryHu: 'A teaser lépés nem éri el a mikro-elköteleződést. E-kereskedelemben a teaser átkattintásnak > 45%-nak kellene lennie. A magas lemorzsolódás alacsony láthatóságot vagy értékajánlat hiányát mutatja. A látogatók azonnali ellenállást éreznek. Egy diszkrét, lebegő sáv vagy haladási csík (progress bar) működne a legjobban.',
    variantEn: 'Implement a slide-in bottom card with a micro-interaction shaking effect after 4 seconds of idle time, rather than a centered popup overlay.',
    variantHu: 'Használj alulról beúszó kis kártyát, ami 4 másodperc inaktivitás után finoman megmozdul (shake), ahelyett, hogy azonnal középre helyezett felugró ablakot mutatnál.',
    triggerTitleEn: 'Curiosity Gap & Micro-commitment',
    triggerTitleHu: 'Kíváncsisági rés & Mikro-elköteleződés',
    triggerDescEn: 'Instead of revealing the reward upfront in the teaser, hint at a mystery gift or exclusive access, encouraging the initial click before asking for information.',
    triggerDescHu: 'Ahelyett, hogy a teaserben egyből elárulnád a jutalmat, utalj egy meglepetés ajándékra vagy exkluzív hozzáférésre. Ezzel eléred az első kattintást, mielőtt adatot kérnél be.',
    copyEn: '“Claim your mystery discount code (takes 2 seconds)...”',
    copyHu: '„Szerezd meg a titkos kedvezménykódodat (2 másodperc az egész)...”'
  },
  email: {
    summaryEn: 'This email capture step is the primary conversion killer. E-commerce email steps see a typical 65-70% drop-off; your data exceeds this. The friction is too high. This is usually caused by too many required input fields or weak perceived value. A single-input form is critical here.',
    summaryHu: 'Ez az email feliratkozási lépés a fő konverziós szűk keresztmetszet. E-kereskedelemben az email mezőnél 65-70%-os lemorzsolódás a megszokott; a te adatod ezt meghaladja. Túl nagy az ellenállás, amit a túl sok beviteli mező vagy a gyenge ösztönzés okoz. Egyetlen beviteli mező használata kritikus itt.',
    variantEn: 'Utilize single-field email submission with inline validation and Google One-Tap/social sign-in integration to bypass keyboard entry entirely.',
    variantHu: 'Használj egyetlen email-beviteli mezőt azonnali (inline) hibaellenőrzéssel, vagy adj hozzá Google One-Tap / közösségi bejelentkezést a gépelés elkerülésére.',
    triggerTitleEn: 'Reciprocity (Kölcsönösség)',
    triggerTitleHu: 'Reciprocity (Kölcsönösség elve)',
    triggerDescEn: 'Offer value first. State clearly what they receive immediately (e.g., "We will display your 15% code on the next screen instantly, no spam guarantee").',
    triggerDescHu: 'Adj értéket először. Fogalmazd meg pontosan, mit kapnak azonnal (pl. „A 15%-os kuponodat azonnal kiírjuk a következő oldalon, spam-garanciával”).',
    copyEn: '“Enter your email to unlock your 15% coupon instantly on the next page.”',
    copyHu: '„Add meg az emailedet, és a következő oldalon azonnal megmutatjuk a 15%-os kuponodat.”'
  },
  'exit-intent': {
    summaryEn: 'Exit-intent triggers have high bounce rates because the user is already mentally checked out. The campaign is failing to catch their attention. To disrupt the exit pattern, you need a high-impact, visual, and highly personal message.',
    summaryHu: 'A kilépési szándék (exit-intent) popupoknál gyakori a magas lemorzsolódás, mert a felhasználó fejben már távozott. A kampány nem tudja megragadni a figyelmét. A kilépési minta megtöréséhez nagy hatású, vizuális és személyes üzenetre van szükség.',
    variantEn: 'Dynamic Cart-Saver: Detect items in the cart and show the exact products they are leaving behind with a countdown timer to save the session.',
    variantHu: 'Dinamikus Kosármentő: Érzékeld a kosárban lévő tételeket, és mutasd meg a pontos termékeket, amiket a látogató itt hagyna, egy visszaszámláló kíséretében.',
    triggerTitleEn: 'Loss Aversion (Veszteségkerülés)',
    triggerTitleHu: 'Veszteségkerülés (Loss Aversion)',
    triggerDescEn: 'Highlight what the customer is about to lose rather than what they will gain. Point out that their selected items will lose their reserved discount if they leave.',
    triggerDescHu: 'Inkább azt emeld ki, amit a vásárló elveszíthet, mintsem amit nyerhet. Mutasd meg, hogy az általa kiválasztott termékek kedvezménye elvész, ha elhagyja az oldalt.',
    copyEn: '“Wait! Your cart is reserved for only 05:00 minutes. Don’t lose your 15% discount on these items.”',
    copyHu: '„Várj! A kosaradat csak 05:00 percig tudjuk fenntartani. Ne veszítsd el a 15%-os kedvezményedet ezekre a termékekre.”'
  },
  coupon: {
    summaryEn: 'Drop-off at the success/coupon stage is a leakage point. At this step, the user is already motivated, so the drop-off is likely due to technical friction (e.g., struggling to copy the code, navigating away to find where to paste it). A copy clipboard action is highly effective here.',
    summaryHu: 'A kupon/sikeres feliratkozás lépésnél történő lemorzsolódás komoly szivárgás. Ebben a fázisban a felhasználó már motivált, így a lemorzsolódás valószínűleg technikai akadályoknak tudható be (pl. nehezen másolható a kód, vagy elfelejti, hova kell beilleszteni). A vágólap-kezelés itt rendkívül fontos.',
    variantEn: 'Auto-apply discount code directly to the checkout checkout session via API redirect, and render a persistent sticky top bar with the discount code so they don\'t forget it.',
    variantHu: 'Alkalmazd automatikusan a kuponkódot a fizetési folyamatban API átirányítással, és jeleníts meg egy lebegő felső sávot a kuponkóddal, hogy ne felejtsék el.',
    triggerTitleEn: 'Cognitive Ease (Kognitív könnyedség)',
    triggerTitleHu: 'Kognitív könnyedség (Cognitive Ease)',
    triggerDescEn: 'Reduce the steps needed to apply the discount. The less thinking and clicking the user does, the higher the checkout completion rate.',
    triggerDescHu: 'Csökkentsd a kedvezmény érvényesítéséhez szükséges lépéseket. Minél kevesebb gondolkodást és kattintást igényel a folyamat, annál magasabb lesz a vásárlások száma.',
    copyEn: '“Your 15% discount has been applied! We copied code WELCOME15 to your clipboard too, just in case.”',
    copyHu: '„A 15%-os kedvezményedet érvényesítettük! Biztonság kedvéért a WELCOME15 kódot a vágólapodra is másoltuk.”'
  }
};

// Fallback for success/other steps
const defaultReport: AIReport = {
  summaryEn: 'General optimization analysis. The current step has an elevated drop-off rate compared to ideal funnel progression. We recommend running a multi-variant visual design test to identify color contrast or button text friction.',
  summaryHu: 'Általános optimalizációs elemzés. A jelenlegi lépésnél a lemorzsolódási arány magasabb az ideálisnál. Javasoljuk egy többváltozós vizuális dizájn teszt futtatását, hogy kiszűrjük a gombok és színek közötti kontraszthibákat.',
  variantEn: 'Design layout overhaul with prominent white-space, simplified call-to-actions, and clear subheadings.',
  variantHu: 'A felület szerkezetének újratervezése: szellősebb terekkel, egyszerűbb CTA-kkal és jól olvasható alcímekkel.',
  triggerTitleEn: 'Visual Hierarchy (Vizuális hierarchia)',
  triggerTitleHu: 'Vizuális hierarchia (Visual Hierarchy)',
  triggerDescEn: 'Guide the user\'s eye directly to the most critical element (the primary action button) using size, weight, and contrasting color.',
  triggerDescHu: 'Irányítsd a felhasználó tekintetét közvetlenül a legfontosabb elemre (az elsődleges cselekvési gombra) méretezés, vastagság és kontrasztos színek segítségével.',
  copyEn: '“Proceed to checkout now and save 10% on your order.”',
  copyHu: '„Lépj a fizetéshez most és spórolj 10%-ot a rendelésedből.”'
};

const currentReport = computed(() => {
  return reports[props.bottleneckStep.type] || defaultReport;
});

function reset() {
  state.value = 'idle';
  loadingProgress.value = 0;
  currentStatusText.value = '';
  statusIndex.value = 0;
}

function generateAIReport() {
  state.value = 'loading';
  loadingProgress.value = 0;
  statusIndex.value = 0;
  
  const statusTexts = loadingStatuses[props.lang];
  currentStatusText.value = statusTexts[0];

  const timer = setInterval(() => {
    loadingProgress.value += 10;
    
    // Periodically update status text
    const idx = Math.min(
      Math.floor((loadingProgress.value / 100) * statusTexts.length),
      statusTexts.length - 1
    );
    if (idx !== statusIndex.value) {
      statusIndex.value = idx;
      currentStatusText.value = statusTexts[idx];
    }

    if (loadingProgress.value >= 100) {
      clearInterval(timer);
      state.value = 'result';
    }
  }, 200);
}
</script>

<style scoped src="./AISimulator.css"></style>
