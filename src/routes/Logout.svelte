<script>
    import { onMount } from "svelte";

    onMount(async (e) => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/auth/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication": token,
            },
            mode: "cors",
        });

        //push("/login");
    });
</script>

<main />

<style>
</style>
