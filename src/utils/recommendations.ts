export interface Recommendation {
  titleEn: string;
  titleHu: string;
  descriptionEn: string;
  descriptionHu: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Generates marketing and product recommendations based on the bottleneck step.
 */
export function getRecommendations(stepType: string, dropoffRate: number): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // 1. Step type specific rules
  if (stepType === 'teaser') {
    recommendations.push({
      titleEn: 'Enhance Teaser Visibility & Message',
      titleHu: 'Fokozd a teaser láthatóságát és üzenetét',
      descriptionEn: `With a ${dropoffRate.toFixed(1)}% drop-off, visitors are ignoring the teaser. Try changing the headline to be more benefit-oriented (e.g., "Unlock 10% Off" instead of "Hi there!"), or use a small animation to draw the user's attention.`,
      descriptionHu: `A látogatók ${dropoffRate.toFixed(1)}%-a figyelmen kívül hagyja a teasert. Próbáld meg az előnyökre fókuszálva átfogalmazni a címsort (pl. „Szerezz 10% kedvezményt” a „Szia!” helyett), vagy használj finom animációt a figyelem felkeltésére.`,
      impact: 'high'
    });
    recommendations.push({
      titleEn: 'Fine-tune Trigger Timing',
      titleHu: 'Finomhangold az időzítést',
      descriptionEn: 'If the teaser appears too quickly (0-2 seconds), it can feel intrusive. Try introducing a delay (e.g., after 5 seconds or 20% scroll depth) to target more engaged visitors.',
      descriptionHu: 'Ha a teaser túl gyorsan jelenik meg (0-2 másodpercen belül), az tolakodónak tűnhet. Próbálj meg késleltetést beállítani (pl. 5 másodperc vagy 20% görgetési mélység után), hogy a már elkötelezettebb látogatókat célozd meg.',
      impact: 'medium'
    });
  } else if (stepType === 'email') {
    recommendations.push({
      titleEn: 'Reduce Form Fields & Friction',
      titleHu: 'Csökkentsd az űrlapmezőket és a súrlódást',
      descriptionEn: `Your email step has a high drop-off (${dropoffRate.toFixed(1)}%). If you ask for preferences or names, make them optional or split them into a multi-step experience. Asking ONLY for an email address increases conversions by up to 25%.`,
      descriptionHu: `Az email lépésnél magas a lemorzsolódás (${dropoffRate.toFixed(1)}%). Ha neveket vagy preferenciákat is bekérsz, tedd őket opcionálissá, vagy válaszd külön lépésekre. Ha KIZÁRÓLAG email címet kérsz be, az akár 25%-kal növelheti a konverziót.`,
      impact: 'high'
    });
    recommendations.push({
      titleEn: 'Strengthen the Incentive',
      titleHu: 'Erősítsd az ösztönzőt',
      descriptionEn: 'Make the reward for signing up clear and instant. State clearly that the coupon is delivered immediately on the next screen, and consider raising the value (e.g., from 10% to 15%).',
      descriptionHu: 'Tedd az előfizetési jutalmat egyértelművé és azonnalivá. Emeld ki, hogy a kuponkód azonnal megjelenik a következő képernyőn, és fontold meg az ajánlat növelését (pl. 10%-ról 15%-ra).',
      impact: 'high'
    });
  } else if (stepType === 'exit-intent') {
    recommendations.push({
      titleEn: 'Use a High-Urgency Offer',
      titleHu: 'Alkalmazz sürgősségi ajánlatot',
      descriptionEn: `An exit-intent popup has to stop a departing user. A ${dropoffRate.toFixed(1)}% drop-off indicates the current hook is too weak. Offer an exclusive deal (e.g., "Free Shipping for the next 15 minutes only") to create a fear of missing out (FOMO).`,
      descriptionHu: `Az exit-intent felugró ablaknak meg kell állítania a távozó látogatót. A ${dropoffRate.toFixed(1)}%-os lemorzsolódás azt mutatja, hogy a jelenlegi ajánlat gyenge. Kínálj exkluzív üzletet (pl. „Ingyenes szállítás csak a következő 15 percben”) a sürgősségérzet (FOMO) megteremtéséhez.`,
      impact: 'high'
    });
  } else if (stepType === 'coupon' || stepType === 'success') {
    recommendations.push({
      titleEn: 'Add One-Click Code Copy',
      titleHu: 'Adj hozzá egykattintásos másolást',
      descriptionEn: 'Make it super simple for users to copy their discount. Add a clear, highlighted "Copy to Clipboard" button next to the coupon code, and show a success confirmation message.',
      descriptionHu: 'Tedd szuper egyszerűvé a felhasználók számára a kuponkód másolását. Adj hozzá egy egyértelmű, kiemelt „Kupon kód másolása” gombot, és jeleníts meg sikeres visszajelzést.',
      impact: 'high'
    });
    recommendations.push({
      titleEn: 'Explain Auto-Apply Checkout',
      titleHu: 'Mutasd be az automatikus beillesztést',
      descriptionEn: 'If possible, automatically apply the coupon code to the user\'s active cart behind the scenes. Add a subtext saying "Discount auto-applied at checkout!" to reduce conversion friction.',
      descriptionHu: 'Ha lehetséges, automatikusan alkalmazd a kuponkódot a kosáron a háttérben. Írd ki a kupon alá, hogy „A kedvezményt automatikusan érvényesítjük a fizetésnél!”, így csökkentve a kosárelhagyást.',
      impact: 'medium'
    });
  }

  // 2. Generic recommendation fallback
  if (recommendations.length < 2) {
    recommendations.push({
      titleEn: 'Optimize Layout and Mobile Friendliness',
      titleHu: 'Optimalizáld a felépítést és a mobilbarát nézetet',
      descriptionEn: 'Ensure the popup displays correctly on all screen resolutions. Elements should be easy to tap, images should be compressed for fast load times, and text must remain legible without zooming.',
      descriptionHu: 'Győződj meg róla, hogy a felugró ablak minden kijelzőn helyesen jelenik meg. A gombok legyenek könnyen kattinthatóak, a képek optimalizáltak a gyors betöltéshez, a szövegek pedig zoomolás nélkül is olvashatóak.',
      impact: 'medium'
    });
    recommendations.push({
      titleEn: 'Run A/B Tests on Creative Assets',
      titleHu: 'Végezz A/B teszteket a kreatív elemeken',
      descriptionEn: 'Even minor details like background color, image choice, and font size can impact performance. Create two variants and split your traffic 50/50 to identify the optimal design.',
      descriptionHu: 'Még az apró részletek is, mint a háttérszín, a képválasztás vagy a betűméret, jelentősen befolyásolhatják a teljesítményt. Hozz létre két verziót és oszd meg a forgalmat 50/50 arányban a teszteléshez.',
      impact: 'medium'
    });
  }

  return recommendations;
}
