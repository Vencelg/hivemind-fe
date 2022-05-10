<script>
    import { onMount } from "svelte";
    import { user } from "../stores/store.js";

    onMount(async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        if (window.localStorage.getItem("token")) {
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

    const sendVerificationEmail = async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/verify/resend", {
            method: "POST",
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

        if (res.ok) {
            console.log(resultFinal);
        } else {
            console.log(resultFinal.message);
        }
    };
</script>

<main>
    <h1>Verify</h1>
    <button on:click={sendVerificationEmail}>Send Verification Email</button>
</main>

<style>
</style>
