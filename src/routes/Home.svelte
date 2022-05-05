<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { posts } from "../stores/posts.js";
    import AddPostForm from "../components/AddPostForm.svelte";
    import AllPosts from "../components/AllPosts.svelte";

    let errors = null;
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
            console.log($posts);
        }
    });

    //TVORBA POSTU
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

    //TVORBA POSTU S OBRÁZKEM
    const handlePostImageSubmit = async (e) => {
        const details = e.detail;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/posts/", {
            method: "POST",
            body: JSON.stringify({
                header: details.header,
                body: details.body,
                user_id: details.user_id,
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

        let formData = details.formData;

        if (formData) {
            handlePostUpdate(resultFinal, formData);
        } else {
            if (res.ok) {
                $posts = [...$posts, resultFinal.post];
            }
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
            for (let i = 0; i < $posts.length; i++) {
                if (($posts[i].id = details)) {
                    $posts.splice(i, 1);
                }
            }
        }
    };
</script>

{#if $user}
    <main>
        <h1>Home page</h1>
        <AddPostForm
            on:post-added={handlePostSubmit}
            on:post-added-image={handlePostImageSubmit}
        />
        <AllPosts {$posts} on:post-deleted={handlePostDelete} />
    </main>
{/if}

<style>
</style>
