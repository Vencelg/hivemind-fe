<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";

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
        if(upvotes) {
            formData.append("upvotes", upvotes);
        }
        if(files) {
            formData.append("image", files[0]);
        }

        formData.append("id", id);
        dispatch("post-updated", formData);
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
        </div>
    {/each}
</div>
