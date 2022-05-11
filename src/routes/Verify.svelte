<script>
    import { onMount } from "svelte";
    import { user } from "../stores/store.js";

    let emailSent = false;
    let buttonStatus = "";

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
            emailSent = true;
        } else {
            console.log(resultFinal.message);
        }
    };
</script>

{#if $user}
    {#if $user.email_verified_at}
        <h1>Successfully verified</h1>
    {:else}
        <main>
            <h1>Verify</h1>
            {#if emailSent}
                <button on:click={sendVerificationEmail} disabled
                    >Send Verification Email</button
                >
                <h2>Email sent!</h2>
            {:else}
                <button on:click={sendVerificationEmail}
                    >Send Verification Email</button
                >
            {/if}
        </main>
    {/if}
{/if}

<style>
</style>
