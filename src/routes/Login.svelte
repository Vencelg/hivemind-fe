<script>
    import LoginForm from "../components/LoginForm.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";

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

<h1>Login</h1>
<LoginForm on:logged-user={handleLogin} />
