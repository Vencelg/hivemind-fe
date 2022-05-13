<script>
    import LoginForm from "../components/LoginForm.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import Logo from "../components/Logo.svelte";

    if ($user) {
        pop();
    }

    const handleLogin = async (e) => {
        const details = e.detail;

        const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
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
            window.localStorage.setItem("token", resultFinal.access_token);
            $user = resultFinal.user;
            push("/");
        }
    };
</script>

<div class="container">
    <Logo />
    <LoginForm on:logged-user={handleLogin} />
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
