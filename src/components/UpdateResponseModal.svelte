<script>
    import { posts } from "../stores/posts.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { getContext } from "svelte";
import { faK } from "@fortawesome/free-solid-svg-icons";

    const { close } = getContext("simple-modal");
    export let response;
    export let postId;

    let responseErrors = false;
    let response_content = response.response_content;

    const handleResponseUpdate = async () => {
        responseErrors = false;
        let formData = new FormData();

        if (response_content != null && response_content != "") {
            formData.append("response_content", response_content);
        } else {
            toast.push("Response field is required", {
                classes: ["dangerNoBar"],
            });
            responseErrors = true;
        }

        if (responseErrors) {
            return;
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            "http://127.0.0.1:8000/api/responses/" + response.id,
            {
                method: "PUT",
                body: JSON.stringify({
                    response_content,
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
                if ($posts[i].id == postId) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if ($posts[i].comments[j].id == response.comment_id) {
                            for (
                                let k = 0;
                                k < $posts[i].comments[j].responses.length;
                                k++
                            ) {
                                if (
                                    $posts[i].comments[j].responses[k].id ==
                                    response.id
                                ) {
                                    $posts[i].comments[j].responses[k] =
                                        resultFinal.response;
                                }
                            }
                        }
                    }
                }
            }
            toast.push("Comment updated", {
                classes: ["successNoBar"],
            });
            close();
        }
    };
</script>

<form on:submit|preventDefault>
    <input
        class:outline={responseErrors == true}
        type="text"
        name="header"
        id="header"
        bind:value={response_content}
    />
    <button type="submit" on:click={handleResponseUpdate}>Update</button>
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
</style>
