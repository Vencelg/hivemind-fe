<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";

    export let post;

    const dispatch = createEventDispatcher();
    let formOpen = false;
    let formDisplay = "none";
    let header = "";
    let body = "";
    let files = null;
    let upvotes = null;
    let imageInput = null;
    let headerErrors = [];
    let bodyErrors = [];
    let upvoteErrors = [];

    const ChangeFormState = () => {
        formOpen = !formOpen;

        if (formOpen) {
            formDisplay = "flex";
        } else {
            formDisplay = "none";
        }
    };

    const DeletePost = (postId) => {
        const id = postId;
        dispatch("post-deleted", id);
    };
    const UpdatePost = (postId) => {
        const id = postId;
        let errorsAdded = false;
        headerErrors = null;
        bodyErrors = null;
        const formData = new FormData();
        if (header != "") {
            formData.append("header", header);
        }
        if (body != "") {
            formData.append("body", body);
        }
        if (upvotes) {
            formData.append("upvotes", upvotes);
        }
        if (files) {
            formData.append("image", files[0]);
        }

        formData.append("id", id);
        dispatch("post-updated", formData);
    };

    const AddTestComment = (id) => {
        const formData = new FormData();

        formData.append("user_id", $user.id);
        formData.append("post_id", id);
        formData.append("comment_content", "Toto je testovací komentář");

        dispatch("comment-added", formData);
    };

    const UpdateComment = (id, commentId) => {
        const formData = new FormData();

        formData.append("comment_id", commentId);
        formData.append("post_id", id);
        formData.append("comment_content", "Toto je upravený komentář");
        formData.append("upvotes", Math.floor(Math.random() * 100));

        dispatch("comment-updated", formData);
    };

    const DeleteComment = (id, postId) => {
        dispatch("comment-deleted", { id, postId });
    };

    const AddTestResponse = (id, commentId) => {
        const formData = new FormData();

        formData.append("user_id", $user.id);
        formData.append("post_id", id);
        formData.append("comment_id", commentId);
        formData.append("response_content", "Toto je testovací odpověď");

        dispatch("response-added", formData);
    };

    const UpdateResponse = (id, commentId, postId) => {
        const formData = new FormData();

        formData.append("comment_id", commentId);
        formData.append("response_id", id);
        formData.append("post_id", postId);
        formData.append("response_content", "Toto je upravená odpověď");
        formData.append("upvotes", Math.floor(Math.random() * 100));

        dispatch("response-updated", formData);
    };

    const DeleteResponse = (id, postId, commentId) => {
        dispatch("response-deleted", { id, postId, commentId });
    };
</script>

<div>
    <h1>{post.header}</h1>
    <h1>{post.body}</h1>
    {#if post.image}
        <img src={post.image} alt="" srcset="" />
    {/if}
    <h1>{post.upvotes}</h1>
    <button on:click={AddTestComment(post.id)}>AddTestComment</button>

    {#each post.comments as comment}
        <div>
            <h3>{comment.id}</h3>
            <h3>{comment.upvotes}</h3>
            <h2>
                {comment.comment_content}<span
                    on:click={DeleteComment(comment.id, comment.post_id)}
                    ><Fa icon={faTrashCan} /></span
                >
            </h2>
            <h2>
                {comment.user.name}<span
                    on:click={UpdateComment(post.id, comment.id)}
                    ><Fa icon={faWrench} /></span
                >
            </h2>
            <button on:click={AddTestResponse(post.id, comment.id)}
                >AddTestResponse</button
            >
            <div style="border: 1px black solid;">
                {#each comment.responses as response}
                    <h3>{response.id}</h3>
                    <h3>{response.upvotes}</h3>
                    <h2>
                        {response.response_content}<span
                            on:click={DeleteResponse(
                                response.id,
                                post.id,
                                comment.id
                            )}><Fa icon={faTrashCan} /></span
                        >
                    </h2>
                    <h2>
                        {response.user.name}<span
                            on:click={UpdateResponse(
                                response.id,
                                comment.id,
                                post.id
                            )}><Fa icon={faWrench} /></span
                        >
                    </h2>
                {/each}
            </div>
        </div>
    {/each}
    <div />
</div>
