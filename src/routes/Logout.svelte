<script>
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
<<<<<<< HEAD
    import api from "../scripts/api";

=======
    import { onMount } from "svelte";
>>>>>>> 5780fc20007b3dce8ae6cbc157d2d674a6965a87

    onMount(async () => {
        const token = "Bearer " + window.localStorage.getItem("token");
        console.log(token);

        const res = await fetch(api + "auth/logout", {
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
            window.localStorage.removeItem("token");
            $user = null;
            push("/login");
        }
    });
</script>

<style>
</style>
