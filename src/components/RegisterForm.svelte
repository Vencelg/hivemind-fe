<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let name = "";
    let email = "";
    let password = "";
    let password_repeat = "";

    const handleRegister = () => {
        if (password == password_repeat && password.trim().length >= 5) {
            const newUser = {
                name,
                email,
                password,
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
        <label for="password_repeat">Password Confirm</label>
        <input
            type="password"
            id="password_repeat"
            name="password_repeat"
            placeholder="repeat password..."
            bind:value={password_repeat}
        />
    </div>

    <button type="submit">Register</button>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    div.box {
        display: flex;
        justify-content: space-between;
        width: 25rem;
    }

    div.box div.input {
        padding-bottom: 0.2rem;
        width: 12rem;
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
        border: #000 solid 1px;
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
        color: #000;
        transition: 0.2s;
    }

    form button:hover {
        border: #000 solid 1px;
        background-color: black;
        color: white;
        cursor: pointer;
    }
</style>
