export const useAvatar = (props) => {
    const initials = computed(() => {
        if (props.initials) {
            return props.initials;
        }

        return props.name?.split(' ').map((p) => p[0]).join('').toUpperCase().slize(0,2) ?? '?';
    });

    const color = computed(() => {
        if (props.color) {
            return props.color;
        }

        const palette = ['#4A90E2','#7B68EE','#50C878','#FF6B6B','#FFD93D'];
        const index = (props.name ?? '').charCodeAt(0) % palette.length;
        return palette[index];
    });

    const radius = computed(() => props.radius ?? 40);
    const fontSize = computed(() => radius.value * 0.75);

    return {
        initials,
        color,
        radius,
        fontSize,
    };
};