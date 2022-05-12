<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";

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
        formData.append("upvotes", Math.floor(Math.random()*100));

        dispatch("comment-updated", formData);
    };

    const DeleteComment = (id, postId) => {
        dispatch("comment-deleted", { id, postId });
    };
</script>

<div>
    {#each $posts as post}
        <div>
            <hr />
            <div style="display: flex;">
                <div>
                    <button
                        style="margin-right: 1rem;"
                        on:click={ChangeFormState}>Update</button
                    >
                    <form
                        on:submit|preventDefault={UpdatePost(post.id)}
                        style="display: {formDisplay};"
                        enctype="multipart/form-data"
                    >
                        <input
                            type="text"
                            name="header"
                            id="header"
                            bind:value={header}
                        />
                        {#if headerErrors}
                            {#each headerErrors as error}
                                <h3>{error}</h3>
                            {/each}
                        {/if}
                        <input
                            type="text"
                            name="body"
                            id="body"
                            bind:value={body}
                        />
                        {#if bodyErrors}
                            {#each bodyErrors as error}
                                <h3>{error}</h3>
                            {/each}
                        {/if}
                        <input
                            type="number"
                            name="upvotes"
                            id="upvotes"
                            bind:value={upvotes}
                        />
                        {#if upvoteErrors}
                            {#each upvoteErrors as error}
                                <h3>{error}</h3>
                            {/each}
                        {/if}
                        <input
                            type="file"
                            name="image"
                            id="image"
                            bind:files
                            bind:this={imageInput}
                        />
                        <button type="submit">Update Post</button>
                    </form>
                </div>
                <button on:click={DeletePost(post.id)}>Delete</button>
            </div>
            <h1>{post.header}</h1>
            <h1>{post.body}</h1>
            {#if post.image}
                <img src={post.image} alt="" srcset="" />
            {/if}
            <h1>{post.user_id}</h1>
            <button on:click={AddTestComment(post.id)}>AddTestComment</button>

            {#each post.comments as comment}
                <div>
                    <h3>{comment.id}</h3>
                    <h3>{comment.upvotes}</h3>
                    <h2>
                        {comment.comment_content}<span
                            on:click={DeleteComment(
                                comment.id,
                                comment.post_id
                            )}><Fa icon={faTrashCan} /></span
                        >
                    </h2>
                    <h2>
                        {comment.user.name}<span
                            on:click={UpdateComment(post.id, comment.id)}
                            ><Fa icon={faWrench} /></span
                        >
                    </h2>
                    {#if comment.responses.length != 0}
                        <div style="border: 1px black solid;">
                            {#each comment.responses as response}
                                <h3>{response.id}</h3>
                                <h2>
                                    {response.response_content}<span
                                        on:click={DeleteComment(response.id)}
                                        ><Fa icon={faTrashCan} /></span
                                    >
                                </h2>
                                <h2>
                                    {response.user.name}<span
                                        ><Fa icon={faWrench} /></span
                                    >
                                </h2>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
            <div />
        </div>
    {/each}
</div>
