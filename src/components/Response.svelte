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
    import api from "../scripts/api";

    const { open } = getContext("simple-modal");
    const showUpdateForm = (response, postId) =>
        open(UpdateResponseModal, { response, postId });

    export let response;
    export let postId;
    let dropdownOpen = false;
    const dispatch = createEventDispatcher();
    let likeBtn;

    const ChangeDropdownState = () => {
        dropdownOpen = !dropdownOpen;
    };

    const DeleteResponse = (id, postId, commentId) => {
        dispatch("response-deleted", { id, postId, commentId });
    };

    const decideLikedStatus = (response) => {
        for (let i = 0; i < response.likes.length; i++) {
            if (response.likes[i].id == $user.id) {
                return true;
            }
        }
        return false;
    };

    const handleResponseLike = async (responseTemp) => {
        likeBtn.disabled = true;

        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "responses/like/" + responseTemp.id, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: token,
            },
            mode: "cors",
        });

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        console.log(resultFinal);

        if (res.ok) {
            response.likes_count += 1;
            response.likes = resultFinal.likes;
        }

        likeBtn.disabled = false;
    };

    const handleResponseDislike = async (responseTemp) => {
        likeBtn.disabled = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(
            api + "responses/dislike/" + responseTemp.id,
            {
                method: "DELETE",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Accept: "application/json",
                    "Content-type": "application/json",
                    Authorization: token,
                },
                mode: "cors",
            }
        );

        const json = await res.json();
        const result = JSON.stringify(json);
        let resultFinal = await JSON.parse(result);

        console.log(resultFinal);

        if (res.ok) {
            response.likes_count -= 1;
            for (let i = 0; i < response.likes.length; i++) {
                if (response.likes[i].id == $user.id) {
                    response.likes.splice(i, 1);
                }
            }
        }
        likeBtn.disabled = false;
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
            <span
            bind:this="{likeBtn}"
                class:liked={decideLikedStatus(response)}
                on:click={() => {
                    if (decideLikedStatus(response)) {
                        handleResponseDislike(response);
                    } else {
                        handleResponseLike(response);
                    }
                }}
            >
                {response.likes_count}
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
                <span
                    class="dropdown"
                    on:click={showUpdateForm(response, postId)}
                    ><Fa icon={faWrench} /></span
                >
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
</div>

<style>
    span.liked {
        color: var(--green-color) !important;
    }

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
