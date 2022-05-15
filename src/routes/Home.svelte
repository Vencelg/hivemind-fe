<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { posts } from "../stores/posts.js";
    import AddPostForm from "../components/AddPostForm.svelte";
    import AllPosts from "../components/AllPosts.svelte";
    import Navigation from "../components/Navigation.svelte";

    let errors = null;
    let verified = false;
    //ON MOUNT
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
                $user = resultFinal.user;
            } else {
                push("/login");
            }
        } else {
            push("/login");
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/posts/", {
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
            console.log(resultFinal);
            verified = true;
        }
    });

    //TVORBA POSTU
    const handlePostSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/posts/", {
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
            $posts = [...$posts, resultFinal.post];
        }
    };

    //UPDATE POSTU
    const handlePostUpdate = async (resultFinal, formData) => {
        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(
            "http://127.0.0.1:8000/api/posts/" + resultFinal.post.id,
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

    const handlePostDelete = async (e) => {
        const details = e.detail;
        console.log(details);
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
            posts.update((currentPosts) => {
                return currentPosts.filter((post) => post.id != details);
            });
        }
    };

    const postUpdateHelper = async (e) => {
        let details = e.detail;

        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(
            "http://127.0.0.1:8000/api/posts/" + details.get("id"),
            {
                method: "POST",
                body: details,
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
            for (let i = 0; i < $posts.length; i++) {
                if ($posts[i].id == resultFinalUpdate.post.id) {
                    console.log($posts[i]);
                    $posts[i] = resultFinalUpdate.post;
                }
            }
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
    const handleCommentUpdate = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/comments/" + details.get("comment_id"),
            {
                method: "PUT",
                body: JSON.stringify({
                    comment_content: details.get("comment_content"),
                    upvotes: details.get("upvotes"),
                }),
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
                if ($posts[i].id == details.get("post_id")) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if (
                            $posts[i].comments[j].id ==
                            details.get("comment_id")
                        ) {
                            $posts[i].comments[j] = resultFinal.comment;
                        }
                    }
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
    const handleResponseUpdate = async (e) => {
        const details = e.detail;
        console.log(details);
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/responses/" + details.get("response_id"),
            {
                method: "PUT",
                body: JSON.stringify({
                    response_content: details.get("response_content"),
                    upvotes: details.get("upvotes"),
                }),
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
                if ($posts[i].id == details.get("post_id")) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if (
                            $posts[i].comments[j].id ==
                            details.get("comment_id")
                        ) {
                            for (
                                let k = 0;
                                k < $posts[i].comments[j].responses.length;
                                k++
                            ) {
                                if (
                                    $posts[i].comments[j].responses[k].id ==
                                    details.get("response_id")
                                ) {
                                    $posts[i].comments[j].responses[k] =
                                        resultFinal.response;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
</script>

{#if $user && verified}
    <Navigation />
<!--     <main>
        <h1>Home page</h1>
        <AddPostForm on:post-added={handlePostSubmit} />
        <AllPosts
            on:post-deleted={handlePostDelete}
            on:post-updated={postUpdateHelper}
            on:comment-added={handleCommentSubmit}
            on:comment-deleted={handleCommentDelete}
            on:comment-updated={handleCommentUpdate}
            on:response-added={handleResponseSubmit}
            on:response-deleted={handleResponseDelete}
            on:response-updated={handleResponseUpdate}
        />
    </main>
{:else if $user && !verified}
    <main>
        <h1>You need to verify first</h1>
    </main> -->
{/if}

<style>
</style>
