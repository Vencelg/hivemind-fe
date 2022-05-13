<script>
	import Router from "svelte-spa-router";
	import { routes } from "./scripts/routes";
    import { user } from "./stores/store.js";
</script>

<Router {routes} />

<style>
</style>
