<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import Navigation from "../components/Navigation.svelte";

    export let params;
    let userProfile = {};
    let userFriends = [];

    onMount(async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        if (window.localStorage.getItem("token")) {
            console.log(token);

            const res = await fetch("http://127.0.0.1:8000/api/auth/", {
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
            } else {
                push("/login");
            }
        } else {
            push("/login");
        }

        const res = await fetch("http://127.0.0.1:8000/api/auth/userProfile", {
            method: "POST",
            body: JSON.stringify({
                user_id: params.user,
            }),
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
            userProfile = resultFinal.profile;
            console.log(userProfile);
        } else {
            console.log("user not found");
        }
    });
</script>

{#if $user}
    <Navigation />
    <main>
        <div class="header">
            <div
                style="background-image: url({$user.profile_picture});"
                class="image"
            />
            <div>
                <p>{$user.name}</p>
                <p>@{$user.username}</p>
            </div>
        </div>
        <div class="content">
            <div class="friends">
                {#each userProfile.profile.friends_of_this_user as friend}
                    <div>
                        <div class="friendImage">
                            {friend.profile_picture}
                        </div>
                        <p>
                            {friend.name}
                        </p>
                    </div>
                {/each}
                {#each userProfile.profile.this_user_friend_of as friend}
                    <div>
                        <div class="friendImage">
                            {friend.profile_picture}
                        </div>
                        <p>
                            {friend.name}
                        </p>
                    </div>
                {:else}
                    <p>User has no friends</p>
                {/each}
            </div>
            <div class="posts">
                <p>posts</p>
            </div>
        </div>
    </main>
{/if}

<style>
    main {
        width: 80%;
        margin: auto;
    }
    div.header {
        display: flex;
        /* justify-content: space-evenly;-*/
        align-items: center;
        background-color: var(--nav-bg-color);
        margin-top: 5rem;
        border-radius: 20px;
    }

    div.header div.image {
        width: 15rem;
        height: 15rem;
        background-position: center;
        background-size: cover;
        border-radius: 50%;
    }

    div.content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
        margin-top: 2rem;
    }

    div.content div.friends {
        background-color: var(--nav-bg-color);
        border-radius: 20px;
    }
</style>
