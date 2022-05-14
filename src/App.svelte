<script>
	import Router from "svelte-spa-router";
	import { routes } from "./scripts/routes";
	import { user } from "./stores/store.js";
	import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<Router {routes} />
<SvelteToast />

<style>
	:global(.successBar) {
        --toastBackground: #13e235;
        --toastBarBackground: #178b2b;
    }

	:global(.successNoBar) {
        --toastBackground: #13e235;
        --toastBarBackground: #13e235;
    }

	:global(.dangerBar) {
        --toastBackground: #e21313;
        --toastBarBackground: #8b1717;
    }

	:global(.dangerNoBar) {
        --toastBackground: #e21313;
        --toastBarBackground: #e21313;
    }
</style>
