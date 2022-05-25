<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
    import { faHeart } from "@fortawesome/free-solid-svg-icons";
    import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
    import { faComment } from "@fortawesome/free-solid-svg-icons";
    import Response from "./Response.svelte";
    import { toast } from "@zerodevx/svelte-toast";
    import UpdateCommentModal from "./UpdateCommentModal.svelte";
    import { getContext } from "svelte";

    export let comment;
    const dispatch = createEventDispatcher();
    let isOwner = false;
    let dropdownOpen = false;
    let formOpen = false;
    let response_content = "";

    const { open } = getContext("simple-modal");
    const showUpdateForm = (comment) => open(UpdateCommentModal, { comment });

    const ChangeFormState = () => {
        formOpen = !formOpen;
    };

    const ChangeDropdownState = () => {
        dropdownOpen = !dropdownOpen;
    };

    const DeleteComment = (id, postId) => {
        dispatch("comment-deleted", { id, postId });
    };

    const DeleteResponse = (e) => {
        dispatch("response-deleted", e.detail);
    };

    const AddResponse = (id, commentId) => {
        const formData = new FormData();
        console.log("coment");
        formData.append("user_id", $user.id);
        formData.append("post_id", id);
        formData.append("comment_id", commentId);
        formData.append("response_content", response_content);

        if (response_content == null || response_content == "") {
            toast.push("Response field is empty", {
                classes: ["dangerNoBar"],
            });
            return;
        }

        dispatch("response-added", formData);
        response_content = "";
    };
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
                {comment.likes_count}
                <Fa icon={faHeart} />
            </span>
        </button>
        <button on:click={ChangeFormState}>
            <span class:active={formOpen}>
                {comment.responses.length}
                <Fa icon={faComment} />
            </span>
        </button>

        {#if comment.user.id == $user.id}
            <button>
                <span
                    class:active={dropdownOpen}
                    on:click={ChangeDropdownState}
                >
                    <Fa icon={faEllipsisVertical} />
                </span>
            </button>

            {#if dropdownOpen}
                <span class="dropdown" on:click={showUpdateForm(comment)}
                    ><Fa icon={faWrench} /></span
                >
                <span
                    on:click={DeleteComment(comment.id, comment.post_id)}
                    class="dropdown"><Fa icon={faTrashCan} /></span
                >
            {/if}
        {/if}
    </div>
    {#if formOpen}
        <div class="responseForm">
            <form
                on:submit|preventDefault={AddResponse(
                    comment.post_id,
                    comment.id
                )}
            >
                <div
                    class="formUserImage"
                    style={"background-image: url(" +
                        $user.profile_picture +
                        ");"}
                />
                <input
                    type="text"
                    name="response_content"
                    id="response_content"
                    placeholder="Write your response..."
                    bind:value={response_content}
                />
                <button type="submit">
                    <Fa icon={faPaperPlane} />
                </button>
            </form>
        </div>

        <div class="responses">
            {#if comment.responses}
                {#each comment.responses as response}
                    <Response
                        {response}
                        postId={comment.post_id}
                        on:response-deleted={DeleteResponse}
                    />
                {/each}
            {/if}
        </div>
    {/if}
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
    span.dropdown {
        color: var(--white-color);
        padding-left: 10px;
        margin: 0;
        transition: 0.1s;
        cursor: pointer;
    }

    span.dropdown:hover {
        color: var(--green-color);
    }

    .active {
        color: var(--green-color) !important;
    }

    div.comment {
        display: flex;
        flex-direction: column;
    }

    div.comment div.box {
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
        position: relative;
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

    div.comment div.responseForm {
        margin: 1rem 0;
    }

    div.comment div.responseForm form {
        display: flex;
        align-items: center;
        width: 95%;
        float: right;
    }

    div.comment div.responseForm div.formUserImage {
        background-position: center;
        background-size: cover;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        background-color: var(--white-color);
        margin-right: 10px;
    }

    div.comment div.responseForm form input {
        display: block;
        border: none;
        outline: none;
        height: 40px;
        width: 90%;
        background-color: rgba(255, 255, 255, 0.07);
        padding: 0 10px;
        font-size: 14px;
        font-weight: 300;
        border-radius: 3px 0 0 3px;
        color: var(--white-color);
    }

    div.comment div.responseForm form button {
        border: none;
        color: var(--white-color);
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 0 3px 3px 0;
        height: 40px;
        padding-right: 10px;
        cursor: pointer;
        transition: 0.1s;
    }

    div.comment div.responseForm form button:hover {
        color: var(--green-color);
    }

    div.responses {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>
