<script>
    import { posts } from "../stores/posts.js";

    
</script>

<div>
    {#each $posts as post}
        <h1>{post.header}</h1>
        <h1>{post.body}</h1>
        <h1>{post.user_id}</h1>
    {/each}
</div>
