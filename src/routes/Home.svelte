<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { posts } from "../stores/posts.js";
    import AddPostForm from "../components/AddPostForm.svelte";
    import AllPosts from "../components/AllPosts.svelte"

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

        //console.log(resultFinal);

        if (res.ok) {
            $posts = resultFinal.posts;
            console.log($posts);
        }
    });

    const handlePostSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/posts/", {
            method: "POST",
            body: JSON.stringify(details),
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
            $posts = [...$posts, resultFinal.post];
        }
    };
</script>

{#if $user}
    <main>
        <h1>Home page</h1>
        <AddPostForm on:post-added={handlePostSubmit} />
        <AllPosts {$posts} />
    </main>
{/if}

<style>
</style>
