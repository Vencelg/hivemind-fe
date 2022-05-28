<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { posts } from "../stores/posts.js";
    import AddPostForm from "../components/AddPostForm.svelte";
    import Navigation from "../components/Navigation.svelte";
    import Fa from "svelte-fa";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";
    import { toast } from "@zerodevx/svelte-toast";
    import Post from "../components/Post.svelte";
    import api from "../scripts/api";

    let errors = null;
    let verified = false;
    $posts = null;
    let status;
    let formOpen = false;

    //Funkce onMount se spouští při spuštění této stránky
    onMount(async () => {
        if (window.localStorage.getItem("token")) {
            const token = "Bearer " + window.localStorage.getItem("token");
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

        getPosts();
    });

    //interakce s tlačítkem pro formu
    const ChangeFormState = () => {
        formOpen = !formOpen;
    };

    //Funkce na fetch postů
    const getPosts = async () => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "posts/", {
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

        if (res.ok) {
            $posts = resultFinal.posts;
        }
    };

    //TVORBA POSTU
    const handlePostSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "posts/", {
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

        console.log(resultFinal);

        if (res.ok) {
            $posts = [resultFinal.post, ...$posts];
        }
    };

    //UPDATE POSTU
    const handlePostUpdate = async (resultFinal, formData) => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(
            api + "/api/posts/" + resultFinal.post.id,
            {
                method: "POST",
                body: formData,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Accept: "application/json",
                    Authorization: token,
                },
                mode: "cors",
            }
        );

        const jsonUpdate = await resUpdate.json();
        const resultUpdate = JSON.stringify(jsonUpdate);
        let resultFinalUpdate = await JSON.parse(resultUpdate);

        console.log(resultFinalUpdate);

        if (resUpdate.ok) {
            $posts = [...$posts, resultFinalUpdate.post];
        }
    };

    //Mazání postu
    const handlePostDelete = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "posts/" + details, {
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
            posts.update((currentPosts) => {
                return currentPosts.filter((post) => post.id != details);
            });
        }
    };

    //Tvorba komentáře
    const handleCommentSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "comments/", {
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

    //Mazání komentáře
    const handleCommentDelete = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "comments/" + details.id, {
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

    //Tvorba odpovědi na komentář
    const handleResponseSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "responses/", {
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

    //Mazání odpovědi na komentář
    const handleResponseDelete = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "responses/" + details.id, {
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

    //Funkce na filtraci postů
    const decideFilter = () => {
        if (status == "1") {
            let result = [];
            let userFriends = [
                ...$user.friends_of_this_user,
                ...$user.this_user_friend_of,
            ];

            for (let i = 0; i < $posts.length; i++) {
                for (let j = 0; j < userFriends.length; j++) {
                    if ($posts[i].user.id == userFriends[j].id) {
                        result.push($posts[i]);
                    }
                }
            }

            $posts = result;
        } else {
            getPosts();
        }
    };
</script>

{#if $user && $posts}
    <Navigation />
    <main>
        <div class="container">
            <div class="postForm">
                <div class="flexBtns">
                    <select
                        name="filter"
                        id="filter"
                        bind:value={status}
                        on:change={decideFilter}
                    >
                        <option value="0">All posts</option>
                        <option value="1">Only friend posts</option>
                    </select>
                    <button on:click={ChangeFormState} class="openButton"
                        >Add Post</button
                    >
                </div>
                {#if formOpen}
                    <AddPostForm on:post-added={handlePostSubmit} />
                {/if}
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
    div.flexBtns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    div.postForm {
        margin-top: 5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    select {
        background-color: var(--white-color);
        color: #080710;
        padding: 8px 25px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        outline: none;
        border: none;
        align-self: flex-start;
    }

    option {
        border-radius: 5px;
    }

    div button.openButton {
        background-color: var(--white-color);
        color: #080710;
        padding: 8px 25px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        outline: none;
        border: none;
        align-self: flex-end;
    }

    div button.openButton:hover {
        background-color: var(--green-color);
        color: var(--white-color);
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

    div.container {
        width: 50%;
        padding-bottom: 2rem;
        margin: auto;
    }

    div.container div.posts {
        margin-top: 5rem;
    }

    @media only screen and (max-width: 1024px) {
        div.container {
            width: 80%;
        }
    }

    @media only screen and (max-width: 425px) {
        div.container {
            width: 90%;
        }
    }
</style>
