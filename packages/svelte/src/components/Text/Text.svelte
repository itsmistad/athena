<script lang="ts">
    import { AthenaComponents } from '@athena-ui/base';
    import { convertStyleToString } from '../../util';
    import { getStyles, subscribe } from '../../store';
    import type { ComponentStyles } from '../types';
    import { onDestroy } from 'svelte';

    export let style: ComponentStyles = {};
    export let innerProps: svelteHTML.HTMLProps<HTMLParagraphElement> = {};

    const { color, fontSize, fontFamily } = getStyles(AthenaComponents.Text);
    const unsubscribe = subscribe(AthenaComponents.Text);
    let _style: string;

    onDestroy(unsubscribe);

    $: {
        _style = `
            color: ${color};
            font-size: ${fontSize}px;
            font-family: ${fontFamily};
            ${convertStyleToString(style)}
        `;
    }
</script>

<p style={_style} {...innerProps}>
    <slot />
</p>
