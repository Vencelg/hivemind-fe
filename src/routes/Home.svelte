<script>
    import { push, pop, replace } from "svelte-spa-router";
    import { authenticated } from "../stores/store.js";

    let userAuth = false;
    authenticated.subscribe((authenticated) => {
        userAuth = authenticated;
    });

    if (!userAuth) {
        pop();
    }
</script>

<main>
    <h1>HOME PAGE</h1>
</main>

<style>
</style>
