<script>
    import RegisterForm from "../components/RegisterForm.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { authenticated } from "../stores/store.js";

    let userAuth = false;
    authenticated.subscribe((authenticated) => {
        userAuth = authenticated;
    });

    if (userAuth) {
        pop();
    }

    const handleRegister = async (e) => {
        const details = e.detail;
        console.log(details);

        const res = await fetch(
            "url",
            {
                method: "POST",
                body: JSON.stringify(details),
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
            }
        );

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        console.log(resultFinal);
        window.localStorage.setItem("token", resultFinal.token);
        push("/");
    };
</script>

<h1>Registration</h1>
<RegisterForm on:added-user={handleRegister} />
