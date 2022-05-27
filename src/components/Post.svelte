<script>
    import { createEventDispatcher } from "svelte";
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { faWrench } from "@fortawesome/free-solid-svg-icons";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
    import { faHeart } from "@fortawesome/free-solid-svg-icons";
    import { faComment } from "@fortawesome/free-solid-svg-icons";
    import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
    import { getContext } from "svelte";
    import ImagePopup from "./ImagePopup.svelte";
    import UpdatePostModal from "./UpdatePostModal.svelte";
    import Time from "svelte-time";
    import { toast } from "@zerodevx/svelte-toast";
    import Comment from "./Comment.svelte";
    import api from "../scripts/api";

    const { open } = getContext("simple-modal");
    const showImage = (imageSrc) => open(ImagePopup, { imageSrc: imageSrc });
    const showUpdateForm = (post) => {
        dropdownOpen = false;
        open(UpdatePostModal, { post });
    };

    export let post;
    let isOwner = false;
    let likeBtn;

    const dispatch = createEventDispatcher();
    let formOpen = false;
    let dropdownOpen = false;
    let header = "";
    let body = "";
    let files = null;
    let upvotes = null;
    let comment_content = "";
    let headerErrors = [];
    let bodyErrors = [];
    let upvoteErrors = [];

    const ChangeFormState = () => {
        formOpen = !formOpen;
    };

    const ChangeDropdownState = () => {
        dropdownOpen = !dropdownOpen;
    };

    const DeletePost = (postId) => {
        dropdownOpen = false;
        const id = postId;
        dispatch("post-deleted", id);
    };

    const AddComment = (id) => {
        const formData = new FormData();

        formData.append("user_id", $user.id);
        formData.append("post_id", id);
        formData.append("comment_content", comment_content);

        if (comment_content == null || comment_content == "") {
            toast.push("Comment field is empty", {
                classes: ["dangerNoBar"],
            });
            return;
        }

        dispatch("comment-added", formData);

        comment_content = "";
    };

    const DeleteComment = (e) => {
        dispatch("comment-deleted", e.detail);
    };

    const AddResponse = (e) => {
        dispatch("response-added", e.detail);
    };

    const DeleteResponse = (e) => {
        dispatch("response-deleted", e.detail);
    };

    const decideLikedStatus = (post) => {
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].id == $user.id) {
                return true;
            }
        }
        return false;
    };

    const handlePostLike = async (postTemp) => {
        likeBtn.disabled = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "posts/like/" + postTemp.id, {
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
            post.likes_count += 1;
            post.likes = resultFinal.likes;
        }
        likeBtn.disabled = false;
    };

    const handlePostDislike = async (postTemp) => {
        likeBtn.disabled = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "posts/dislike/" + postTemp.id, {
            method: "DELETE",
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
            post.likes_count -= 1;
            for (let i = 0; i < post.likes.length; i++) {
                if (post.likes[i].id == $user.id) {
                    post.likes.splice(i, 1);
                }
            }
        }

        likeBtn.disabled = false;
    };
</script>

<div class="post">
    <div class="postTop">
        <div class="userData">
            <div
                class="userImage"
                style={"background-image: url(" +
                    post.user.profile_picture +
                    ");"}
            />
            <div class="userInfo">
                <a href={"#/profile/" + post.user.id}>{post.user.name}</a>
                <p>
                    <Time
                        timestamp={post.created_at}
                        format="ddd, DD MMM YYYY HH:mm"
                    />
                </p>
            </div>
        </div>
        {#if $user.id == post.user_id}
            <div style="position: relative;">
                <span
                    class:active={dropdownOpen}
                    on:click={ChangeDropdownState}
                    class="settings"
                >
                    <Fa icon={faEllipsisVertical} />
                </span>
                {#if dropdownOpen}
                    <div class="dropdown">
                        <span on:click={showUpdateForm(post)}
                            ><Fa icon={faWrench} /></span
                        >
                        <span on:click={DeletePost(post.id)}
                            ><Fa icon={faTrashCan} /></span
                        >
                    </div>
                {/if}
            </div>
        {/if}
    </div>
    <div class="postContent">
        <h1>{post.header}</h1>
        <p>{post.body}</p>
        {#if post.image}
            <div
                class="postImage"
                style={"background-image: url(" + post.image + ");"}
                on:click={showImage(post.image)}
            />
        {/if}
    </div>
    <div class="buttons">
        <button>
            <span
                bind:this="{likeBtn}"
                class:liked={decideLikedStatus(post)}
                on:click={() => {
                    if (decideLikedStatus(post)) {
                        handlePostDislike(post);
                    } else {
                        handlePostLike(post);
                    }
                }}
            >
                {post.likes_count}
                <Fa icon={faHeart} />
            </span>
        </button>
        <button>
            <span class:active={formOpen} on:click={ChangeFormState}>
                {post.comments.length}
                <Fa icon={faComment} />
            </span>
        </button>
    </div>
    {#if formOpen}
        <div class="commentForm">
            <form on:submit|preventDefault={AddComment(post.id)}>
                <div
                    class="formUserImage"
                    style={"background-image: url(" +
                        $user.profile_picture +
                        ");"}
                />
                <input
                    type="text"
                    name="comment_content"
                    id="comment_content"
                    placeholder="Write your comment..."
                    bind:value={comment_content}
                />
                <button type="submit">
                    <Fa icon={faPaperPlane} />
                </button>
            </form>
        </div>
        {#if post.comments}
            <div class="comments">
                {#each post.comments as comment}
                    <Comment
                        {comment}
                        on:response-added={AddResponse}
                        on:comment-deleted={DeleteComment}
                        on:response-deleted={DeleteResponse}
                    />
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    span.liked {
        color: var(--green-color) !important;
    }

    div.dropdown {
        background-color: var(--comment-color);
        position: absolute;
        right: 0;
        width: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
    }

    .active {
        color: var(--green-color) !important;
    }

    div.post {
        background-color: var(--nav-bg-color);
        margin-bottom: 1rem;
        padding: 20px;
        border-radius: 20px;
    }

    div.post div.postTop {
        display: flex;
        justify-content: space-between;
    }

    div.post div.postTop span {
        color: var(--white-color);
        transition: 0.1s;
        cursor: pointer;
    }

    div.post div.postTop span:hover {
        color: var(--green-color);
    }

    div.post div.postTop div.userData {
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    div.post div.postTop div.userData div.userImage {
        background-position: center;
        background-size: cover;
        height: 3rem;
        width: 3rem;
        background-color: var(--white-color);
        border-radius: 50%;
    }

    div.post div.postTop div.userData div.userInfo {
        padding-left: 1rem;
    }

    div.post div.postTop div.userData div.userInfo a {
        color: var(--white-color);
        transition: 0.2s;
        text-decoration: none;
    }

    div.post div.postTop div.userData div.userInfo a:hover {
        color: var(--green-color);
    }

    div.post div.postContent {
        padding-bottom: 1rem;
    }

    div.post div.buttons button {
        background-color: transparent;
        border: none;
        transition: 0.1s;
        cursor: pointer;
    }

    div.post div.buttons button span {
        color: var(--white-color);
        font-size: 1.2rem;
        padding: 0 1rem;
    }

    div.post div.buttons button:hover > span {
        color: var(--green-color);
    }

    div.post div.postContent h1 {
        font-family: AlteHaasBold;
        color: var(--white-color);
        padding: 1rem 0;
        word-break: break-word;
    }

    div.post div.postContent p {
        word-break: break-word;
    }

    div.post div.postContent div.postImage {
        width: 100%;
        height: 40rem;
        background-position: center;
        background-size: cover;
        margin: 1rem 0;
    }

    div.post div.commentForm {
        margin: 1rem 0;
    }

    div.post div.commentForm form {
        display: flex;
        align-items: center;
    }

    div.post div.commentForm div.formUserImage {
        background-position: center;
        background-size: cover;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        background-color: var(--white-color);
        margin-right: 10px;
    }

    div.post div.commentForm form input {
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

    div.post div.commentForm form button {
        border: none;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 0 3px 3px 0;
        height: 40px;
        padding-right: 10px;
        cursor: pointer;
        transition: 0.1s;
        color: var(--white-color);
    }

    div.post div.commentForm form button:hover {
        color: var(--green-color);
    }

    @media only screen and (max-width: 425px) {
        div.post div.postContent div.postImage {
            height: 25rem;
        }
    }
</style>
