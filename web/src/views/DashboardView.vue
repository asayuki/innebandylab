<script setup lang="ts">
import { ref } from 'vue';
import Toggle from '@/components/Toggle.vue';
import PriceCard from '@/components/PriceCard.vue';

const tiers = [
  {
    name: 'Gratis',
    monthly: 0, yearly: 0,
    description: 'För nyfikna och de som vill testa',
    features: [
      [true,  'Tillgång till hela övningsbiblioteket'],
      [true,  'Animerade övningar'],
      [true,  'Upp till 3 sparade sessioner'],
      [true,  'Dela sessioner via länk'],
      [false, 'Privata övningar'],
      [false, 'Obegränsade sessioner'],
      [false, 'Bygg egna animationer'],
      [false, 'PDF-export'],
      [false, 'Säsongsplaneraren'],
    ],
    cta: 'Kom igång gratis',
  },
  {
    name: 'Pro',
    highlight: true,
    description: 'För tränare som vill ta det till nästa nivå',
    monthly: 9.99, yearly: 6.49,
    features: [
      [true,  'Allt i Gratis, plus:'],
      [true,  'Obegränsade sessioner'],
      [true,  'Privata övningar'],
      [true,  'Bygg egna animerade övningar'],
      [true,  'PDF-export av sessionsplan'],
      [true,  'Säsongsplaneraren'],
      [true,  'Spelarhantering & närvaro'],
      [false, 'Klubbgemensam övningsbank'],
      [false, 'Klubböversikt'],
    ],
    cta: 'För seriösa tränare',
  },
  {
    name: 'Club',
    monthly: 29.99, yearly: 19.99,
    description: 'För klubbar och organisationer som vill jobba enhetligt -- från junior till senior',
    features: [
      [true, 'Allt i Pro, plus:'],
      [true, 'Upp till 10 tränare'],
      [true, 'Klubbgemensam övningsbank'],
      [true, 'Klubböversikt för sportchef'],
      [true, 'Närvaro för alla lag'],
      [true, 'Prioriterad support'],
    ],
    cta: 'För klubbar och organisationer',
  },
]

const selectedOption = ref('yearly');

</script>

<template>
  <section class="pricing">
      <Toggle
    v-model="selectedOption"
    :choices="[
      { name: 'Månadsvis', id: 'monthly' },
      { name: 'Årsvis', id: 'yearly', pill: 'Spara 35%' },
    ]"
  />
    <div class="cards">
      <PriceCard
        v-for="(tier, index) in tiers"
        :key="index"
        :title="tier.name"
        :description="tier.description"
        :highlight="tier.highlight"
        :monthly="tier.monthly"
        :yearly="tier.yearly"
        :billingCycle="selectedOption"
        :features="tier.features"
        :cta="tier.cta"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.pricing {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;

  // Toggle should not be full width, but centered
  .toggle {
    align-self: center;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 0 auto;

    & > * {
      max-width: 30vw;
  }

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
      & > * {
        max-width: 100%;
      }
    }
  }
}
</style>