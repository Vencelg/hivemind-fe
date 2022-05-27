<script>
    import UserSearchResult from "./UserSearchResult.svelte";
    import { getContext } from "svelte";

    const { close } = getContext("simple-modal");
    export let friends;
</script>

<div class="box">
    {#each friends as friend}
        <a href="#/profile/{friend.id}" on:click={close}>
            <UserSearchResult userProfile={friend} />
        </a>
    {/each}
</div>

<style>
    a {
        width: 90%;
    }

    div.box {
        background-color: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 20px;
        padding: 2rem 0;
        width: 100%;
        padding: 20px;
        margin: auto;
    }
</style>
