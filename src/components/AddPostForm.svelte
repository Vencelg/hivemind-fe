<script>
    import { createEventDispatcher } from "svelte";
    import { user } from "../stores/store.js";

    const dispatch = createEventDispatcher();
    let formOpen = false;
    let formDisplay = "none";
    let header = "";
    let body = "";
    let image = null;
    let user_id = $user.id;

    const ChangeFormState = () => {
        formOpen = !formOpen;

        if (formOpen) {
            formDisplay = "flex";
        } else {
            formDisplay = "none";
        }
    };

    const AddPost = () => {
        if (image) {
            const post = {
                header,
                body,
                image,
                user_id,
            };

            dispatch("post-added", post);
        }else {
            const post = {
                header,
                body,
                user_id,
            };

            dispatch("post-added", post);
        }
    };
</script>

<div>
    <button on:click={ChangeFormState}>Add Post</button>
    <form on:submit|preventDefault={AddPost} style="display: {formDisplay};">
        <input type="text" name="header" id="header" bind:value={header} />
        <input type="text" name="body" id="body" bind:value={body} />

        <button type="submit">Post</button>
    </form>
</div>
