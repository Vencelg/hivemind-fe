<script>
    import { posts } from "../stores/posts.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { getContext } from "svelte";

    const { close } = getContext("simple-modal");
    export let comment;

    let commentErrors = false;
    let comment_content = comment.comment_content;

    const handleCommentUpdate = async () => {
        commentErrors = false;
        let formData = new FormData();

        if (comment_content != null && comment_content != "") {
            formData.append("comment_content", comment_content);
        } else {
            toast.push("Comment field is required", {
                classes: ["dangerNoBar"],
            });
            commentErrors = true;
        }

        if (commentErrors) {
            return;
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(
            "http://127.0.0.1:8000/api/comments/" + comment.id,
            {
                method: "PUT",
                body: JSON.stringify({
                    comment_content,
                    upvotes: comment.upvotes,
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

        const jsonUpdate = await resUpdate.json();
        const resultUpdate = JSON.stringify(jsonUpdate);
        let resultFinalUpdate = await JSON.parse(resultUpdate);

        console.log(resultFinalUpdate);

        if (resUpdate.ok) {
            for (let i = 0; i < $posts.length; i++) {
                if ($posts[i].id == comment.post_id) {
                    for (let j = 0; j < $posts[i].comments.length; j++) {
                        if ($posts[i].comments[j].id == comment.id) {
                            $posts[i].comments[j] = resultFinalUpdate.comment;
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
        class:outline={commentErrors == true}
        type="text"
        name="header"
        id="header"
        bind:value={comment_content}
    />
    <button type="submit" on:click={handleCommentUpdate}>Update</button>
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
