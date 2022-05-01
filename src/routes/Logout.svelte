<script>
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";


    const logout = async () => {
        const token = "Bearer " + window.localStorage.getItem("token");
        console.log(token);

        const res = await fetch("http://127.0.0.1:8000/api/auth/logout", {
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
    };
</script>

<main>
    <button on:click={logout}>logout</button>
</main>

<style>
</style>
