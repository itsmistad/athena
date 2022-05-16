<script lang="ts">
    import type { PartialDeep } from 'type-fest';
    import { configure } from '../../store';
    import type { AthenaState } from '../../store';
    import { onMount } from 'svelte';
    import '@fontsource/lato';
    import '@fontsource/montserrat';

    export let initialState: PartialDeep<AthenaState> = undefined;

    onMount(() => {
        if (initialState && initialState.theme && initialState.styles) {
            configure({
                theme: initialState.theme,
                styles: initialState.styles,
            });
        }
    });
</script>

<slot />
