<script>
    import LoginForm from "../components/LoginForm.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { authenticated } from "../stores/store.js";

    let userAuth = false;
    authenticated.subscribe((authenticated) => {
        userAuth = authenticated;
    });

    if (userAuth) {
        pop();
    }

    const handleLogin = async (e) => {
        const details = e.detail;

        const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
        });

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        console.log(resultFinal);

        if (res.ok) {
            window.localStorage.setItem("token", resultFinal.access_token);
        }
    };
</script>

<h1>Login</h1>
<LoginForm on:logged-user={handleLogin} />
