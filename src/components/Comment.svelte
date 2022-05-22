<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faL, faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

    export let comment;
    let isOwner = false;

    
</script>

<div>
    <div class="userImage">obrazek</div>
    <div class="text">
        <p>Jmeno</p>
        <p>Obsah</p>
    </div>

    {#if true}
        <span class="settings">
            <Fa icon={faEllipsisVertical} />
        </span>
    {/if}
    <h2>
        {comment.comment_content}<span
            on:click={DeleteComment(comment.id, comment.post_id)}
            ><Fa icon={faTrashCan} /></span
        >
    </h2>
    <h2>
        {comment.user.name}<span on:click={UpdateComment(post.id, comment.id)}
            ><Fa icon={faWrench} /></span
        >
    </h2>

    <div style="border: 1px black solid;">
        {#each comment.responses as response}
            <h3>{response.id}</h3>
            <h3>{response.upvotes}</h3>
            <h2>
                {response.response_content}<span
                    on:click={DeleteResponse(response.id, post.id, comment.id)}
                    ><Fa icon={faTrashCan} /></span
                >
            </h2>
            <h2>
                {response.user.name}<span
                    on:click={UpdateResponse(response.id, comment.id, post.id)}
                    ><Fa icon={faWrench} /></span
                >
            </h2>
        {/each}
    </div>
</div>
