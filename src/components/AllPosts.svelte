<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    const dispatch = createEventDispatcher();
    const DeletePost = (postId) => {
        const id = postId;
        dispatch("post-deleted", id);
    };
</script>

<div>
    {#each $posts as post}
        <div>
            <hr />
            <div style="display: flex;">
                <button style="margin-right: 1rem;">Update</button>
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
