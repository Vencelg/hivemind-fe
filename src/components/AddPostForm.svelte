<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { empty } from "svelte/internal";
    import { user } from "../stores/store.js";

    const dispatch = createEventDispatcher();
    let formOpen = false;
    let formDisplay = "none";
    let header = "";
    let body = "";
    let files = null;
    let imageInput = null;
    let user_id = $user.id;
    let headerErrors = [];
    let bodyErrors = [];
    let imageErrors = [];

    const ChangeFormState = () => {
        formOpen = !formOpen;

        if (formOpen) {
            formDisplay = "flex";
        } else {
            formDisplay = "none";
        }
    };

    const AddPost = () => {
        let errorsAdded = false;
        headerErrors = null;
        bodyErrors = null;

        if (!header) {
            headerErrors = ["Header field is required"]
            errorsAdded = true;
        }

        if (!body) {
            bodyErrors = ["Body field is required"];
            errorsAdded = true;
        }

        if (errorsAdded) {
            return;
        }

        if (files) {
            const formData = new FormData();
            formData.append("header", header);
            formData.append("body", body);
            formData.append("image", files[0]);
            formData.append("user_id", user_id);

            dispatch("post-added", formData);
        }

        header = "";
        body = "";
        files = null;
        imageInput.value = null;
    };
</script>

<div>
    <button on:click={ChangeFormState}>Add Post</button>
    <form
        on:submit|preventDefault={AddPost}
        style="display: {formDisplay};"
        enctype="multipart/form-data"
    >
        <input type="text" name="header" id="header" bind:value={header} />
        {#if headerErrors}
            {#each headerErrors as error}
                <h3>{error}</h3>
            {/each}
        {/if}
        <input type="text" name="body" id="body" bind:value={body} />
        {#if bodyErrors}
            {#each bodyErrors as error}
                <h3>{error}</h3>
            {/each}
        {/if}
        <input type="file" name="image" id="image" bind:files bind:this="{imageInput}"/>
        <button type="submit">Post</button>
    </form>
</div>
