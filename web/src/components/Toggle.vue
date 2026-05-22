<script setup lang="ts">
const props =defineProps<{
    modelValue: string;
    disabled?: boolean;
    choices: {
        name: string;
        id: string;
        pill: string;
    }[];
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const makeChoice = (id: string) => {
    if (props.disabled) return;
    emit('update:modelValue', id);
};

</script>

<template>
    <div class="toggle">
        <div
            v-for="(choice, index) in choices"
            :key="index"
            class="toggle-option"
            :class="{ 'toggle-option__active': modelValue === choice.id, 'toggle-option--disabled': disabled }"
            @click="makeChoice(choice.id)"
        >
            {{ choice.name }}
            <label v-if="choice.pill" class="pill">{{ choice.pill }}</label>
        </div>
        <div class="toggle-indicator"></div>
    </div>
</template>

<style lang="scss" scoped>
.toggle {
    background-color: var(--background-secondary);
    border: 1px solid var(--border-primary);
    // height: 2.5rem;
    padding: 0.25rem;
    border-radius: 9999px;
    font-size: var(--text-small);
    position: relative;

    display: inline-flex;
    justify-content: space-evenly;
    align-items: center;

    .toggle-option {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
        cursor: pointer;
        //transition: color 0.28s ease;
        z-index: 2;
        padding: 0.5rem 0.85rem;
        font-weight: 500;

        &__active {
            anchor-name: --active-toggle;
            color: var(--text-white);
        }

        .pill {
            background-color: var(--accent-primary);
            color: var(--text-primary);
            margin-left: var(--space-mini);
            padding: calc(var(--space-mini) / 2) var(--space-mini);
            font-family: var(--font-mono);
            font-size: 0.6rem;
            border-radius: 5px;
            line-height: 1.25;
            white-space: nowrap;
            pointer-events: none;
        }
    }

    .toggle-indicator {
        position-anchor: --active-toggle;
        position: absolute;
        top: 0.225rem;
        height: calc(100% - 0.5rem);
        background-color: var(--text-primary);
        border-radius: 9999px;
        left: anchor(left);
        width: anchor-size(width);
        // transition: left 0.15s ease, width 0.15s ease;
    }
}
</style>