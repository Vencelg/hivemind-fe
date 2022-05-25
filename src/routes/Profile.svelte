<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { userProfile } from "../stores/userProfile.js";
    import { posts } from "../stores/posts.js";
    import Navigation from "../components/Navigation.svelte";
    import Post from "../components/Post.svelte";
    import Fa from "svelte-fa";
    import { faCog } from "@fortawesome/free-solid-svg-icons";
    import { getContext } from "svelte";
    import UpdateUserModal from "../components/UpdateUserModal.svelte";
    import { toast } from "@zerodevx/svelte-toast";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";

    export let params;
    let paramsOld = params;
    let isOwner = false;
    let isRequested = false;
    let isFriend = false;
    let isFriendRequested = false;
    let userFriends = [];
    let loading = true;

    const { open } = getContext("simple-modal");
    const showUpdateForm = () => open(UpdateUserModal);

    $posts = null;
    onMount(async () => {

        getAuth();
        getUser();
    });

    const getAuth = async () => {
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
    };

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
            $userProfile = resultFinal.profile;
            $posts = resultFinal.profile.posts;
            decideFriendStatus();
        } else {
            toast.push("User doesn't exist", {
                classes: ["dangerNoBar"],
            });
            push("/");
        }

        paramsOld = params;
    };

    const decideFriendStatus = () => {
        isOwner = false;
        isRequested = false;
        isFriend = false;
        isFriendRequested = false;

        if ($userProfile.id == $user.id) {
            isOwner = true;
        }

        if ($userProfile.friend_requests) {
            for (let i = 0; i < $user.friend_requests.length; i++) {
                if ($user.friend_requests[i].user_id == $userProfile.id) {
                    isFriendRequested = true;
                }
            }
        }

        if ($userProfile.friend_requests) {
            for (let i = 0; i < $userProfile.friend_requests.length; i++) {
                if ($userProfile.friend_requests[i].user_id == $user.id) {
                    isRequested = true;
                }
            }
        }
        if ($userProfile.friends_of_this_user.length > 0) {
            for (let i = 0; i < $userProfile.friends_of_this_user.length; i++) {
                if ($userProfile.friends_of_this_user[i].id == $user.id) {
                    isFriend = true;
                }
            }
        }

        if ($userProfile.this_user_friend_of.length > 0) {
            for (let i = 0; i < $userProfile.this_user_friend_of.length; i++) {
                if ($userProfile.this_user_friend_of[i].id == $user.id) {
                    isFriend = true;
                }
            }
        }

        console.log(isOwner);
        console.log(isFriendRequested);
        console.log(isRequested);
        console.log(isFriend);
    };

    const handlePostDelete = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/posts/" + details, {
            method: "DELETE",
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
            $posts = $posts.filter((post) => post.id != details);
        }
    };

    const handleCommentSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/comments/", {
            method: "POST",
            body: details,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                Authorization: token,
            },
            mode: "cors",
        });

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        if (res.ok) {
            for (let i = 0; i < $posts.length; i++) {
                console.log($posts[i]);
                if ($posts[i].id == resultFinal.comment.post_id) {
                    console.log($posts[i]);
                    $posts[i].comments = [
                        ...$posts[i].comments,
                        resultFinal.comment,
                    ];
                }
            }
        }
    };

    const handleResponseSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/responses/", {
            method: "POST",
            body: details,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                Authorization: token,
            },
            mode: "cors",
        });

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        if (res.ok) {
            for (let i = 0; i < $posts.length; i++) {
                if ($posts[i].id == details.get("post_id")) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if (
                            $posts[i].comments[j].id ==
                            details.get("comment_id")
                        ) {
                            $posts[i].comments[j].responses = [
                                ...$posts[i].comments[j].responses,
                                resultFinal.response,
                            ];
                        }
                    }
                }
            }
        }
    };

    const handleCommentDelete = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/comments/" + details.id,
            {
                method: "DELETE",
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

        console.log(resultFinal);

        if (res.ok) {
            for (let i = 0; i < $posts.length; i++) {
                for (let j = 0; j < $posts[i].comments.length; j++) {
                    if ($posts[i].comments[j].id == details.id) {
                        console.log($posts[i].comments);
                        let temp = $posts;
                        temp[i].comments.splice(j, 1);
                        $posts = temp;
                    }
                }
            }
        }
    };

    const handleResponseDelete = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/responses/" + details.id,
            {
                method: "DELETE",
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

        console.log(resultFinal);

        if (res.ok) {
            for (let i = 0; i < $posts.length; i++) {
                if ($posts[i].id == details.postId) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if ($posts[i].comments[j].id == details.commentId) {
                            for (
                                let k = 0;
                                k < $posts[i].comments[j].responses.length;
                                k++
                            ) {
                                if (
                                    $posts[i].comments[j].responses[k].id ==
                                    details.id
                                ) {
                                    let temp = $posts;
                                    temp[i].comments[j].responses.splice(k, 1);
                                    $posts = temp;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const handleFriendshipDelete = async (user_id) => {
        let id = null;

        for (let i = 0; i < $userProfile.friends_of_this_user.length; i++) {
            if ($userProfile.friends_of_this_user[i].id == user_id) {
                id = $userProfile.friends_of_this_user[i].pivot.id;
            }
        }

        for (let i = 0; i < $userProfile.this_user_friend_of.length; i++) {
            if ($userProfile.this_user_friend_of[i].id == user_id) {
                id = $userProfile.this_user_friend_of[i].pivot.id;
            }
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/friends/" + id, {
            method: "DELETE",
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
            toast.push("User unfriended", {
                classes: ["successNoBar"],
            });
            getUser();
        }
    };

    const handleFriendshipRequestDelete = async (user_id, friend_id) => {
        let id = null;

        for (let i = 0; i < $user.friend_requests.length; i++) {
            if (
                $user.friend_requests[i].friend_id == user_id &&
                $user.friend_requests[i].user_id == friend_id
            ) {
                id = $user.friend_requests[i].id;
            }
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/friends/" + id, {
            method: "DELETE",
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
            toast.push("Friend request declined", {
                classes: ["successNoBar"],
            });
            getAuth();
            getUser();
        }
    };

    const handleFriendshipCreate = async (user_id, friend_id) => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/friends", {
            method: "POST",
            body: JSON.stringify({
                user_id,
                friend_id,
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
            toast.push("Friend request sent", {
                classes: ["successNoBar"],
            });
            getUser();
        }
    };

    const handleFriendshipUpdate = async (user_id, friend_id) => {
        let id = null;

        for (let i = 0; i < $user.friend_requests.length; i++) {
            if (
                $user.friend_requests[i].friend_id == user_id &&
                $user.friend_requests[i].user_id == friend_id
            ) {
                id = $user.friend_requests[i].id;
            }
        }

        console.log(id);

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/friends/" + id, {
            method: "PUT",
            body: JSON.stringify({
                accepted: 1,
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
            toast.push("Friend accepted", {
                classes: ["successNoBar"],
            });
            getAuth();
            getUser();
        }
    };

    $: if (params.user != paramsOld.user) {
        getUser();
    }
</script>

{#if $user && $userProfile && $posts}
    <Navigation />
    <main>
        <div class="header">
            <div class="box">
                <div
                    style="background-image: url({$userProfile.profile_picture});"
                    class="image"
                />
                <div class="userData">
                    <p class="bigP">
                        {$userProfile.name}
                        {#if $user.id == $userProfile.id}
                            <span class="cog" on:click={showUpdateForm}>
                                <Fa class="cog" icon={faCog} />
                            </span>
                        {/if}
                    </p>
                    <p class="smallP">@{$userProfile.username}</p>
                    {#if isRequested}
                        <p>Friend request sent</p>
                    {/if}
                    {#if isFriendRequested}
                        <button
                            on:click={handleFriendshipUpdate(
                                $user.id,
                                $userProfile.id
                            )}
                            class="unfriend">Accept</button
                        >
                        <button
                            class="unfriend"
                            on:click={handleFriendshipRequestDelete(
                                $user.id,
                                $userProfile.id
                            )}>Decline</button
                        >
                    {/if}
                    {#if isFriend}
                        <button
                            class="unfriend"
                            on:click={handleFriendshipDelete($user.id)}
                            >Unfriend</button
                        >
                    {:else if !isFriend && !isFriendRequested && !isRequested && !isOwner}
                        <button
                            class="addFriend"
                            on:click={handleFriendshipCreate(
                                $user.id,
                                $userProfile.id
                            )}>Send friend request</button
                        >
                    {/if}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="friends">
                {#each $userProfile.friends_of_this_user as friend}
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
                {#each $userProfile.this_user_friend_of as friend}
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
                {#each $posts as post}
                    <Post
                        {post}
                        on:comment-added={handleCommentSubmit}
                        on:response-added={handleResponseSubmit}
                        on:post-deleted={handlePostDelete}
                        on:comment-deleted={handleCommentDelete}
                        on:response-deleted={handleResponseDelete}
                    />
                {:else}
                    <p>User has no posts</p>
                {/each}
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

    button.addFriend {
        margin-top: 20px;
        width: 100%;
        background-color: #ffffff;
        color: #080710;
        padding: 5px 10px;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        border: none;
        align-self: center;
        outline: none;
    }

    button.addFriend:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

    button.unfriend {
        margin-top: 20px;
        width: 8rem;
        background-color: #ffffff;
        color: #080710;
        padding: 5px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        border: none;
        outline: none;
        margin-left: 1rem;
    }

    button.unfriend:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

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
        min-width: 12rem;
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
