<script>
    import { user } from "../stores/store.js";
    import FriendRequest from "./FriendRequest.svelte";
</script>

<div class="box">
    {#each $user.friend_requests as request}
        <FriendRequest {request} />
    {:else}
        <p>User has no requests...</p>
    {/each}
</div>

<style>
    p {
        text-align: center;
    }
    div.box {
        background-color: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 20px;
        padding: 2rem 0;
        width: 60%;
        margin: auto;
    }
</style>
