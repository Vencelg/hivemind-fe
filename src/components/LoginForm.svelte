<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let email = "";
    let password = "";

    const handleLogin = () => {
        const user = {
            email,
            password,
        };

        dispatch("logged-user", user);
    };
</script>

<form on:submit|preventDefault={handleLogin}>
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

    <button type="submit">Login</button>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    div.input {
        padding-bottom: 0.2rem;
        width: 25rem;
    }

    div.input label {
        padding-bottom: 0.3rem;
        font-size: 1.3rem;
    }

    div.input input {
        border-radius: 0.4rem;
        width: 100%;
        font-size: 1.1rem;
    }

    div.input input:focus {
        outline: none;
    }

    form button {
        padding: 1rem;
        font-size: 1.3rem;
        width: 12rem;
        border-radius: 0.4rem;
        border: #000 solid 1px;
        background-color: transparent;
        color: black;
        transition: 0.2s;
    }

    form button:hover {
        border: #000 solid 1px;
        background-color: black;
        color: white;
        cursor: pointer;
    }
</style>
