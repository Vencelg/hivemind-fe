<script>
    import { posts } from "../stores/posts.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { getContext } from "svelte";
    import api from "../scripts/api";

    const { close } = getContext("simple-modal");
    export let post;

    let headerErrors = false;
    let bodyErrors = false;
    let header = post.header;
    let body = post.body;
    let btn;

    //Kontrola formuláře na úpravu postu
    const handlePostUpdate = async () => {
        btn.disabled = true;

        headerErrors = false;
        bodyErrors = false;
        let formData = new FormData();

        if (header != null && header != "") {
            formData.append("header", header);
        } else {
            toast.push("Header field is required", {
                classes: ["dangerNoBar"],
            });
            headerErrors = true;
        }

        if (body != null && body != "") {
            formData.append("body", body);
        } else {
            toast.push("Body field is required", {
                classes: ["dangerNoBar"],
            });
            bodyErrors = true;
        }

        if (headerErrors || bodyErrors) {
            return;
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(api + "posts/" + post.id, {
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
            for (let i = 0; i < $posts.length; i++) {
                if ($posts[i].id == resultFinalUpdate.post.id) {
                    $posts[i] = resultFinalUpdate.post;
                    console.log($posts[i]);
                }
            }
            toast.push("Post updated", {
                classes: ["successNoBar"],
            });
            close();
        }
    };
</script>

<form on:submit|preventDefault>
    <input
        class:outline={headerErrors == true}
        type="text"
        name="header"
        id="header"
        bind:value={header}
    />
    <textarea
        class:outline={bodyErrors == true}
        name="body"
        id="body"
        bind:value={body}
    />
    <button type="submit" bind:this="{btn}" on:click={handlePostUpdate}>Update</button>
</form>

<style>
    .outline {
        border: 1px solid var(--red-color) !important;
    }

    form {
        background-color: var(--nav-bg-color);
        width: 70%;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 1rem;
        border-radius: 10px;
    }

    form input {
        display: block;
        height: 50px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 0 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
        border: none !important;
        outline: none !important;
        color: var(--white-color);
        font-size: 1.2rem;
    }

    form textarea {
        display: block;
        height: 25rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 0 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
        border: none !important;
        outline: none !important;
        color: var(--white-color);
        resize: none;
        font-size: 1.1rem;
    }

    form button {
        margin-top: 50px;
        width: 60%;
        background-color: #ffffff;
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        border: none !important;
        outline: none !important;
    }

    form button:hover {
        margin-top: 50px;
        background-color: var(--green-color);
        color: var(--white-color);
    }

    @media only screen and (max-width: 550px) {
        form {
            width: 100%;
        }
    }
</style>
