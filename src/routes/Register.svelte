<script>
    import RegisterForm from "../components/RegisterForm.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";

    if ($user) {
        pop();
    }

    const handleRegister = async (e) => {
        const details = e.detail;

        const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
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
        }
    };
</script>

<h1>Registration</h1>
<RegisterForm on:added-user={handleRegister} />
