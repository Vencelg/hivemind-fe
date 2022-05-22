<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import Navigation from "../components/Navigation.svelte";
    import Post from "../components/Post.svelte";
    import Fa from "svelte-fa";
    import { faCog } from "@fortawesome/free-solid-svg-icons";
    import { toast } from "@zerodevx/svelte-toast";

    export let params;
    let paramsOld = params;
    let userProfile = null;
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

        getUser();
    });

    const getUser = async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

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
            toast.push("User doesn't exist", {
                classes: ["dangerNoBar"],
            });
            push("/");
        }

        paramsOld = params;
    };

    $: if (params.user != paramsOld.user) {
        getUser();
    }
</script>

{#if userProfile}
    <Navigation />
    <main>
        <div class="header">
            <div class="box">
                <div
                    style="background-image: url({userProfile.profile_picture});"
                    class="image"
                />
                <div class="userData">
                    <p class="bigP">
                        {userProfile.name}
                        {#if $user.id == userProfile.id}
                            <span class="cog">
                                <Fa class="cog" icon={faCog} />
                            </span>
                        {/if}
                    </p>
                    <p class="smallP">@{userProfile.username}</p>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="friends">
                {#each userProfile.friends_of_this_user as friend}
                    <div>
                        <a href={"#/profile/" + friend.id}>
                            <div
                                class="friendImage"
                                style="background-image: url({friend.profile_picture});"
                            />
                            <p>
                                {friend.name}
                            </p>
                        </a>
                    </div>
                {/each}
                {#each userProfile.this_user_friend_of as friend}
                    <div>
                        <a href={"#/profile/" + friend.id}>
                            <div
                                class="friendImage"
                                style="background-image: url({friend.profile_picture});"
                            />
                            <p>
                                {friend.name}
                            </p>
                        </a>
                    </div>
                {/each}
            </div>
            <div class="posts">
                {#each userProfile.posts as post}
                    <Post {post} />
                {:else}
                    <p>User has no posts</p>
                {/each}
            </div>
        </div>
    </main>
{/if}

<style>
    .cog {
        display: contents;
        transition: 0.2s;
        font-size: 1rem;
    }

    .cog:hover {
        color: var(--green-color);
        cursor: pointer;
    }
    .box {
        display: flex;
    }

    main {
        width: 80%;
        margin: auto;
        padding-bottom: 1rem;
    }
    div.header {
        display: flex;
        justify-content: space-between;
        background-color: var(--nav-bg-color);
        margin-top: 5rem;
        border-radius: 20px;
        padding: 1rem 8%;
        color: var(--white-color);
    }

    div.header div.box div.image {
        width: 15rem;
        height: 15rem;
        background-position: center;
        background-size: cover;
        border-radius: 50%;
        background-color: var(--white-color);
    }

    div.header div.box div.userData {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    div.header div.box div.userData p {
        padding: 1rem 1rem 0 1rem;
        font-family: AlteHaasRegular;
    }

    div.header div.box div.userData p.bigP {
        font-size: 2rem;
        font-family: AlteHaasBold;
    }

    div.header div.box div.userData p.smallP {
        font-size: 1.2rem;
        color: var(--green-color);
    }
    div.content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
        margin-top: 2rem;
    }

    div.content div.friends {
        padding: 10px;
        padding-bottom: 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 10px;
        height: calc(100vw / 3);
        /* min-width: 30rem; */
        background-color: var(--nav-bg-color);
        border-radius: 20px;
    }

    div.content div.friends div {
        height: calc(100vw / 12);
    }

    div.content div.friends a div.friendImage {
        background-size: cover;
        background-position: center;
        width: calc(100vw / 12);
        height: 100%;
        background-color: var(--white-color);
        border-radius: 10px;
    }

    div.content div.friends a p {
        color: var(--white-color);
        text-decoration: none;
        font-size: calc(100vw / 120);
    }
</style>
