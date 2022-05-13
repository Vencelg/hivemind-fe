<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let name = "";
    let username = "";
    let email = "";
    let password = "";
    let password_confirmation = "";

    const handleRegister = () => {
        if (password == password_confirmation && password.trim().length >= 6) {
            const newUser = {
                name,
                username,
                email,
                password,
                password_confirmation,
            };

            dispatch("added-user", newUser);
        } else {
            console.log("pswd error");
        }
    };
</script>

<form on:submit|preventDefault={handleRegister}>
    <div class="input">
        <label for="email">Name</label>
        <input
            type="text"
            id="name"
            name="name"
            placeholder="name..."
            bind:value={name}
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
        />
    </div>

    <button type="submit">Register</button>
    <a href="#/login">Already Registered?</a>
</form>

<style>
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
