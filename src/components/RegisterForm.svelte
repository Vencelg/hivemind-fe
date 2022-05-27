<script>
    import { createEventDispatcher } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";

    const dispatch = createEventDispatcher();

    let name = null;
    let username = null;
    let email = null;
    let password = null;
    let password_confirmation = null;
    let emailErrors = null;
    let usernameErrors = null;
    let nameErrors = null;
    let passwordErrors = null;
    let passwordConfirmationErrors = null;
    const _REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let btn;

    const registerUser = () => {
        btn.disabled = true;

        let errorsSet = false;
        if (!name) {
            nameErrors = "Name required";
            errorsSet = true;
            toast.push(nameErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (!username) {
            usernameErrors = "Username required";
            errorsSet = true;
            toast.push(usernameErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (!email) {
            emailErrors = "Email required";
            errorsSet = true;
            toast.push(emailErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (!_REGEX.test(email)) {
            emailErrors = "Invalid email adress";
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
        if (password.trim().length < 6) {
            passwordErrors = "Passwords needs to be atleast 6 characters";
            errorsSet = true;
            toast.push(passwordErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (password != password_confirmation) {
            passwordErrors = "Passwords do not match";
            passwordConfirmationErrors = "Passwords do not match";
            errorsSet = true;
            toast.push(passwordConfirmationErrors, {
                classes: ["dangerNoBar"],
            });
        }
        if (errorsSet) {
            return;
        }

        const newUser = {
            name,
            username,
            email,
            password,
            password_confirmation,
        };

        dispatch("added-user", newUser);

    };
</script>

<form on:submit|preventDefault={registerUser}>
    <div class="input">
        <label for="email">Name</label>
        <input
            type="text"
            id="name"
            name="name"
            placeholder="name..."
            bind:value={name}
            class:outline={nameErrors != null}
        />
    </div>

    <div class="input">
        <label for="email">Username</label>
        <input
            type="text"
            id="username"
            name="username"
            placeholder="username..."
            bind:value={username}
            class:outline={usernameErrors != null}
        />
    </div>

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

    <div class="input">
        <label for="password_confirmation">Password Confirm</label>
        <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            placeholder="repeat password..."
            bind:value={password_confirmation}
            class:outline={passwordConfirmationErrors != null}
        />
    </div>

    <button type="submit" bind:this="{btn}">Register</button>
    <a href="#/login">Already Registered?</a>
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
