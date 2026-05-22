<script setup lang="ts">
import Logo from '@/components/Logo.vue';
</script>

<template>
    <header>
        <Logo size="--t-h4" :beta="true" />

        <nav>
            <a href="#functions">Funktioner</a>
            <a href="#prices">Priser</a>
            <a href="#">Logga in</a>
            <button class="b b-primary b-lg">Skapa konto -></button>
        </nav>
    </header>

    <section id="hero" class="section section--bordered">
        <div class="container">
            <h1 class="display">Träna bättre.<br />Coaca <em>smartare</em></h1>
            <p>En helt vanlig text</p>
        </div>
    </section>

    <section id="functions">
        <h2>Allt en tränare<br />behöver. Inget mer.</h2>
    </section>

    <section id="prices" class="section bg-paper-2">
        <div class="container">
            <h2>Enkelt. Rimligt. Svenskt.</h2>
            <p>Ingen bindningstid. Avsluta när som helst.</p>
        </div>
    </section>

    <footer>

    </footer>
</template>

<style scoped lang="scss">
header {
    align-items: center;
    background: color-mix(in srgb, var(--paper) 60%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--rule);
    display: flex;
    flex-direction: row;
    padding: var(--space-md) var(--space-md);
    justify-content: space-between;
    position: sticky;
}

nav {
    align-items: center;
    display: flex;
    gap: var(--space-lg);

    a:not(.b) {
        color: var(--ink-2);
        font-size: var(--t-body-l);
        font-weight: var(--fw-medium);
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            color: var(--ink);
        }
    }
}

/*section {
    border-bottom: 1px solid var(--rule);
    padding: var(--space-2xl) var(--space-md);
}

section#prices {
    background-color: var(--paper-2);
}*/
</style>