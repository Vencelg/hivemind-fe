<script>
    import UserSearchResult from "../components/UserSearchResult.svelte";
    import { onMount } from "svelte";
    import Navigation from "../components/Navigation.svelte";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";

    export let params;
    let paramsOld = params;
    let usersSearchResult = [];
    let searchFinished = false;
    onMount(async () => {
        if (window.localStorage.getItem("token")) {
            const token = "Bearer " + window.localStorage.getItem("token");
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
                console.log("zde;");
                $user = resultFinal.user;
                if (!$user.email_verified_at) {
                    push("#/verify");
                }
                if ($user.friend_requests.length > 0) {
                    toast.push(
                        "You have <span class='friendRequestToast'>" +
                            $user.friend_requests.length +
                            "</span> new friend requests",
                        {
                            classes: ["friendRequests"],
                        }
                    );
                }
            } else {
                push("/login");
            }
        } else {
            push("/login");
        }
        
        getUsers();
    });

    const getUsers = async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/users/" + params.value,
            {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Accept: "application/json",
                    "Content-type": "application/json",
                    Authorization: token,
                },
                mode: "cors",
            }
        );
        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        if (res.ok) {
            usersSearchResult = resultFinal.searchResult;
            paramsOld = params;
        }
        searchFinished = true;
    };

    $: if (params.value != paramsOld.value) {
        getUsers();
    }
</script>

{#if $user && searchFinished}
    <Navigation />
    <main>
        <div class="container">
            {#each usersSearchResult as user}
                <a href={"#/profile/" + user.id}>
                    <UserSearchResult userProfile={user} />
                </a>
            {:else}
                <h1>No users found</h1>
            {/each}
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
    
    div.container {
        width: 50%;
        margin: auto;
    }
</style>
