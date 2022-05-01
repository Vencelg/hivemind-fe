<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";

    onMount(async () => {
        if (window.localStorage.getItem("token")) {
            const token = "Bearer " + window.localStorage.getItem("token");
            console.log(token);

            const res = await fetch("http://127.0.0.1:8000/api/auth/", {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Accept: "application/json",
                    "Content-type": "application/json",
                    Authorization: token,
                },
                mode: "cors",
            });
            const json = await res.json();
            const result = JSON.stringify(json);
            let resultFinal = await JSON.parse(result);

            console.log(resultFinal);

            if (res.ok) {
                $user = resultFinal.user;
            } else {
                push("/login");
            }
        } else {
            push("/login");
        }
    });
</script>

<main>
    {#if $user}
        <h1>HOME PAGE</h1>
    {:else}
        <h1>loading...</h1>
    {/if}
</main>

<style>
</style>
