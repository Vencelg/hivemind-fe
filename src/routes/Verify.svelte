<script>
    import { onMount } from "svelte";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";
    import { push } from "svelte-spa-router";
    import api from "../scripts/api";

    let emailSent = false;
    let emailAlreadySent = false;
    let loading = false;
    let buttonStatus = "";

    //Funkce onMount, která se spouští při spuštění stránky
    onMount(async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        if (window.localStorage.getItem("token")) {
            console.log(token);

            const res = await fetch(api + "auth/", {
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

                if ($user.email_verified_at) {
                    push("/");
                }
            } else {
                push("/login");
            }
        } else {
            push("/login");
        }
    });

    //Funkce na odeslání verifikačního emailu
    const sendVerificationEmail = async () => {
        loading = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "verify/resend", {
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
            emailSent = true;
            loading = false;
        } else {
            emailAlreadySent = true;
            loading = false;
        }
    };
</script>

{#if $user}
    <main>
        <div class="container">
            <div class="box">
                <div class="heading">
                    <h1>One more step<span class="dots">...</span></h1>
                </div>
                <div class="content">
                    <p>
                        Before you are able to use our website, you will need to
                        verify your email. By clicking the button below an email
                        will be sent to you. After opening it, click on the
                        button in the email. After verifying you will be able to
                        use the website.
                    </p>
                </div>
                {#if emailSent}
                    <p class="sent">Email sent</p>
                {:else if emailAlreadySent}
                    <p class="alreadySent">
                        Email already sent, wait before sending a new one
                    </p>
                {:else if !emailSent && loading}
                    <span class="loading">
                        <Fa icon={faSpinner} spin />
                    </span>
                {:else}
                    <button on:click={sendVerificationEmail}
                        >Send Verification Email</button
                    >
                {/if}
            </div>
        </div>
    </main>
{:else}
    <div class="loading">
        <span>
            <Fa icon={faSpinner} spin />
        </span>
    </div>
{/if}

<style>
    p.sent {
        padding: 1rem;
        font-size: 2rem;
        color: var(--green-color);
    }

    p.alreadySent {
        padding: 1rem;
        font-size: 1.2rem;
        color: var(--green-color);
    }

    span.dots {
        color: var(--green-color);
    }

    div.loading {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.loading span {
        font-size: 3rem;
        color: var(--green-color);
    }

    span.loading {
        font-size: 3rem;
        color: var(--green-color);
    }

    div.container {
        width: 80%;
        margin: auto;
    }

    div.container div.box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        width: 100%;
    }

    div.container div.box div.heading {
        border-bottom: 2px solid var(--green-color);
        margin-bottom: 2rem;
    }

    div.container div.box div.heading h1 {
        font-size: 5rem;
        color: var(--white-color);
        padding-bottom: 1rem;
    }

    div.container div.box div.content {
        width: 40%;
    }

    div.container div.box div.content p {
        font-size: 1.3rem;
        text-align: justify;
    }

    div.container div.box button {
        margin-top: 50px;
        width: 40%;
        background-color: #ffffff;
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        border: none;
        outline: none;
    }

    div.container div.box button:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

    @media only screen and (max-width: 1024px) {
        div.container div.box div.content {
            width: 60%;
        }
    }

    @media only screen and (max-width: 768px) {
        div.container div.box div.content {
            width: 80%;
        }

        div.container div.box div.heading h1 {
            font-size: 3rem;
            color: var(--white-color);
            padding-bottom: 1rem;
        }
    }

    @media only screen and (max-width: 425px) {
        div.container div.box div.content {
            width: 92%;
        }

        div.container div.box div.content p {
            font-size: 1rem;
            text-align: justify;
        }

        div.container div.box div.heading h1 {
            font-size: 2rem;
            color: var(--white-color);
            padding-bottom: 1rem;
        }

        div.container div.box button {
            margin-top: 50px;
            width: 70%;
            background-color: #ffffff;
            color: #080710;
            padding: 15px 0;
            font-size: 18px;
            font-weight: 600;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.2s;
            border: none;
            outline: none;
        }
    }
</style>
