<script>
    import RegisterForm from "../components/RegisterForm.svelte";
    import Logo from "../components/Logo.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import api from "../scripts/api";

    if ($user) {
        pop();
    }

    const handleRegister = async (e) => {
        const details = e.detail;

        const res = await fetch(api + "auth/register", {
            method: "POST",
            body: JSON.stringify(details),
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                "Content-type": "application/json",
            },
            mode: "cors",
        });

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        console.log(resultFinal);

        if (res.ok) {
            toast.push("Successfully registered", {
                classes: ["successNoBar"],
            });
            push("/login");
        } else {
            toast.push("Something went wrong", {
                classes: ["dangerNoBar"],
            });
        }
    };
</script>

<div class="container">
    <Logo />
    <RegisterForm on:added-user={handleRegister} />
</div>

<style>
    div.container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>
