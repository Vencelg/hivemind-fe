<script>
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
    import { faHeart } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { user } from "../stores/store.js";
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";
    import UpdateResponseModal from "./UpdateResponseModal.svelte";
    import { getContext } from "svelte";

    const { open } = getContext("simple-modal");
    const showUpdateForm = (response, postId) => open(UpdateResponseModal, { response, postId });

    export let response;
    export let postId;
    let dropdownOpen = false;
    const dispatch = createEventDispatcher();

    const ChangeDropdownState = () => {
        dropdownOpen = !dropdownOpen;
    };

    const DeleteResponse = (id, postId, commentId) => {
        dispatch("response-deleted", { id, postId, commentId });
    };
</script>

<div class="response">
    <div class="box">
        <div
            class="userImage"
            style={"background-image: url(" +
                response.user.profile_picture +
                ");"}
        />
        <div class="text">
            <div class="content">
                <p class="name">{response.user.name}</p>
                <p>{response.response_content}</p>
            </div>
        </div>
    </div>
    <div class="settings">
        <button>
            <span>
                {response.upvotes}
                <Fa icon={faHeart} />
            </span>
        </button>

        {#if response.user.id == $user.id}
            <button>
                <span
                    class:active={dropdownOpen}
                    on:click={ChangeDropdownState}
                >
                    <Fa icon={faEllipsisVertical} />
                </span>
            </button>

            {#if dropdownOpen}
                <span class="dropdown" on:click={showUpdateForm(response, postId)} ><Fa icon={faWrench} /></span>
                <span
                    on:click={DeleteResponse(
                        response.id,
                        postId,
                        response.comment_id
                    )}
                    class="dropdown"><Fa icon={faTrashCan} /></span
                >
            {/if}
        {/if}
    </div>
    <!-- <h2>
        {response.response_content}<span
            on:click={Deleteresponse(response.id, response.post_id)}
            ><Fa icon={faTrashCan} /></span
        >
    </h2>
    <h2>
        {response.user.name}<span on:click={Updateresponse(post.id, response.id)}
            ><Fa icon={faWrench} /></span
        >
    </h2> -->

    <!-- <div style="border: 1px black solid;">
        {#each response.responses as response}
            <h3>{response.id}</h3>
            <h3>{response.upvotes}</h3>
            <h2>
                {response.response_content}<span
                    on:click={DeleteResponse(response.id, post.id, response.id)}
                    ><Fa icon={faTrashCan} /></span
                >
            </h2>
            <h2>
                {response.user.name}<span
                    on:click={UpdateResponse(response.id, response.id, post.id)}
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

    div.response {
        display: flex;
        width: 94%;
        flex-direction: column;
    }

    div.response div.box {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.response div.text {
        background-color: var(--response-color);
        border-radius: 10px;
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.response div.text div.content p {
        word-break: break-word;
    }

    div.response div.text div.content p.name {
        font-family: AlteHaasBold;
    }

    div.response div.settings {
        padding-left: 4rem;
    }

    div.response div.settings button span {
        color: var(--white-color);
        cursor: pointer;
        transition: 0.1s;
    }

    div.response div.settings button {
        background-color: transparent;
        border: none;
    }

    div.response div.settings button:hover > span {
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

    div.response div.responseForm form button {
        border: none;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 0 3px 3px 0;
        height: 40px;
        padding-right: 10px;
        cursor: pointer;
        transition: 0.1s;
    }

    div.response div.responseForm form button:hover {
        color: var(--green-color);
    }
</style>
