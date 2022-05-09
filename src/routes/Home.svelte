<script>
    import { onMount } from "svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import { user } from "../stores/store.js";
    import { posts } from "../stores/posts.js";
    import AddPostForm from "../components/AddPostForm.svelte";
    import AllPosts from "../components/AllPosts.svelte";
    import SearchBar from "../components/SearchBar.svelte";

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

        let formData = details.formData;

        if (formData) {
            console.log(resultFinal);
            handlePostUpdate(resultFinal, formData);
        } else {
            if (res.ok) {
                $posts = [...$posts, resultFinal.post];
            }
        }
    };

    //UPDATE POSTU
    const handlePostUpdate = async (resultFinal, formData) => {
        const token = "Bearer " + window.localStorage.getItem("token");
       
        const resUpdate = await fetch("http://127.0.0.1:8000/api/posts/" + resultFinal.post.id, {
            method: "POST",
            body: formData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                Authorization: token,
            },
            mode: "cors",
        });

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
</script>

{#if $user}
    <main>
        <SearchBar />
        <h1>Home page</h1>
        <AddPostForm on:post-added={handlePostSubmit} />
        <AllPosts
            {$posts}
            on:post-deleted={handlePostDelete}
            on:post-updated={handlePostUpdate}
        />
    </main>
{/if}

<style>
</style>
