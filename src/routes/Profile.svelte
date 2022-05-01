<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";

    console.log($user);
</script>

<main>
    <h1>Profile</h1>
</main>

<style>
</style>
