<script>
    import { createEventDispatcher } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    const dispatch = createEventDispatcher();
    let email = null;
    let password = null;
    let emailErrors = null;
    let passwordErrors = null;
    let btn;

    const loginUser = () => {
        btn.disabled = true;

        let errorsSet = false;
        if (!email) {
            emailErrors = "Email required";
            errorsSet = true;
            toast.push(emailErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (!password) {
            passwordErrors = "Password required";
            errorsSet = true;
            toast.push(passwordErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (errorsSet) {
            return;
        }

        const user = {
            email,
            password,
        };

        dispatch("logged-user", user);

    };
</script>

<form on:submit|preventDefault={loginUser}>
    <div class="input">
        <label for="email">Email</label>
        <input
            type="text"
            id="email"
            name="email"
            placeholder="email..."
            bind:value={email}
            class:outline={emailErrors != null}
        />
    </div>

    <div class="input">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            placeholder="password..."
            bind:value={password}
            class:outline={passwordErrors != null}
        />
    </div>

    <button type="submit" bind:this="{btn}">Login</button>
    <a href="#/register">Need to register?</a>
</form>

<style>
    .outline {
        border: 1px solid var(--red-color);
    }
    form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 30rem;
    }

    form * {
        font-family: "Poppins", sans-serif;
        color: #ffffff;
        letter-spacing: 0.5px;
        outline: none;
        border: none;
    }

    form a {
        text-decoration: none;
        margin-top: 1rem;
    }

    form a:hover {
        text-decoration: none;
        margin-top: 1rem;
        color: var(--green-color);
    }

    form div.input {
        display: flex;
        flex-flow: nowrap column;
        width: 100%;
    }

    form div.input label {
        display: block;
        margin-top: 15px;
        font-size: 16px;
        font-weight: 500;
    }
    form div.input input {
        display: block;
        height: 50px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 0 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
    }

    form button {
        margin-top: 50px;
        width: 100%;
        background-color: #ffffff;
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
    }

    form button:hover {
        margin-top: 50px;
        width: 100%;
        background-color: var(--green-color);
        color: var(--white-color);
    }

    /*responsivita*/
    @media only screen and (max-width: 540px) {
        form {
            width: 20rem;
        }
    }
    @media only screen and (max-width: 375px) {
        form {
            width: 15rem;
        }

        form div.input input {
            height: 40px;
        }

        form div.input label {
            margin-top: 8px;
        }
    }
</style>
