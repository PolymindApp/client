declare module 'v-hotkey' {
    import { DirectiveOptions, PluginFunction } from 'vue';

    type Plugin = {
        install: PluginFunction<{ [alias in string]?: number }>;
        directive: DirectiveOptions;
    };

    const plugin: Plugin;

    export default plugin;
}
