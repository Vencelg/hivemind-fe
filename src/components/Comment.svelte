<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faL, faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
    import { faHeart } from "@fortawesome/free-solid-svg-icons";
    import { faComment } from "@fortawesome/free-solid-svg-icons";

    export let comment;
    let isOwner = false;
</script>

<div class="comment">
    <div class="box">
        <div
            class="userImage"
            style={"background-image: url(" +
                comment.user.profile_picture +
                ");"}
        />
        <div class="text">
            <div class="content">
                <p class="name">{comment.user.name}</p>
                <p>{comment.comment_content}</p>
            </div>
        </div>
    </div>
    <div class="settings">
        <button>
            <span>
                {comment.upvotes} <Fa icon={faHeart} />
            </span>
        </button>
        <button>
            <span>
                <Fa icon={faComment} />
            </span>
        </button>

        {#if comment.user.id == $user.id}
            <button>
                <span>
                    <Fa icon={faEllipsisVertical} />
                </span>
            </button>
        {/if}
    </div>
    <div class="responses">
        {#each comment.responses as response}
             <p>lmao</p>
        {/each}
    </div>
    <!-- <h2>
        {comment.comment_content}<span
            on:click={DeleteComment(comment.id, comment.post_id)}
            ><Fa icon={faTrashCan} /></span
        >
    </h2>
    <h2>
        {comment.user.name}<span on:click={UpdateComment(post.id, comment.id)}
            ><Fa icon={faWrench} /></span
        >
    </h2> -->

    <!-- <div style="border: 1px black solid;">
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
    </div>-->

</div>

<style>

    div.comment {
        display: flex;
        flex-direction: column;
    }

    div.comment div.box{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.comment div.text {
        background-color: var(--comment-color);
        border-radius: 10px;
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.comment div.text div.content p {
        word-break: break-word;
    }

    div.comment div.text div.content p.name {
        font-family: AlteHaasBold;
    }

    div.comment div.settings {
        padding-left: 4rem;
    }

    div.comment div.settings button span {
        color: var(--white-color);
        cursor: pointer;
        transition: 0.1s;
    }

    div.comment div.settings button {
        background-color: transparent;
        border: none;
    }

    div.comment div.settings button:hover > span {
        color: var(--green-color);
    }

    div.userImage {
        background-position: center;
        background-size: cover;
        background-color: var(--white-color);
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
    }
</style>
