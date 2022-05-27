<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { empty } from "svelte/internal";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import { toast } from "@zerodevx/svelte-toast";

    const dispatch = createEventDispatcher();
    let formOpen = false;
    let formDisplay = "none";
    let header = "";
    let body = "";
    let files = null;
    let imageInput = null;
    let user_id = $user.id;
    let headerErrors = false;
    let bodyErrors = false;
    let imageSet = false;
    let imageErrors = false;
    let pfpShow = null;

    const ChangeFormState = () => {
        formOpen = !formOpen;
    };

    const ChangeImageState = () => {
        imageSet = true;
        let temp = null;
        var reader = new FileReader();
        reader.onload = (e) => {
            temp = e.target.result;
            pfpShow = temp;
        };

        reader.readAsDataURL(files[0]);
    };

    const AddPost = () => {
        let formData = new FormData();
        let errorsAdded = false;
        headerErrors = null;
        bodyErrors = null;
        imageErrors = null;

        if (header != null && header != "") {
            formData.append("header", header);
        } else {
            toast.push("Header field is required", {
                classes: ["dangerNoBar"],
            });
            headerErrors = true;
        }

        if (body != null && body != "") {
            formData.append("body", body);
        } else {
            toast.push("Body field is required", {
                classes: ["dangerNoBar"],
            });
            bodyErrors = true;
        }

        if (files != null) {
            if (
                files[0].type == "image/jpeg" ||
                files[0].type == "image/png" ||
                files[0].type == "image/gif"
            ) {
                formData.append("image", files[0]);
            } else {
                toast.push("Only image types allowed are: jpeg/jpg, png, gif", {
                    classes: ["dangerNoBar"],
                });
                imageErrors = true;
            }
        }

        if (headerErrors || bodyErrors || imageErrors) {
            return;
        }

        formData.append("user_id", $user.id);

        header = "";
        body = "";
        files = null;
        imageInput.value = null;
        formOpen = false;
        pfpShow = null;
        imageSet = false;
        console.log("debug");
        dispatch("post-added", formData);
    };
</script>

<div>
    <button on:click={ChangeFormState} class="openButton">Add Post</button>

    {#if formOpen}
        <form on:submit|preventDefault={AddPost} enctype="multipart/form-data">
            <label for="header">Post header</label>
            <input
                class:outline={headerErrors == true}
                type="text"
                name="header"
                id="header"
                bind:value={header}
            />
            <label for="body">Post body</label>
            <textarea
                class:outline={bodyErrors == true}
                name="body"
                id="body"
                bind:value={body}
            />

            {#if imageSet}
                <div
                    class="postImage"
                    style="background-image: url({pfpShow});"
                >
                    <span
                        class="cross"
                        on:click={() => {
                            pfpShow, (imageSet = null);
                        }}><Fa icon={faXmark} /></span
                    >
                </div>
            {/if}

            <label for="file-upload" class="custom-file-upload">
                Upload image
            </label>
            <input
                id="file-upload"
                type="file"
                bind:files
                bind:this={imageInput}
                on:change={ChangeImageState}
            />
            <button type="submit">Upload</button>
        </form>
    {/if}
</div>

<style>
    .outline {
        border: 1px solid var(--red-color) !important;
    }

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    div button.openButton {
        background-color: var(--white-color);
        color: #080710;
        padding: 8px 25px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        outline: none;
        border: none;
        align-self: flex-end;
    }

    div button.openButton:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

    form {
        background-color: var(--nav-bg-color);
        width: 100%;
        margin: auto;
        display: flex;
        /* justify-content: center;
        align-items: center; */
        flex-direction: column;
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
    }

    form label {
        display: block;
        margin-top: 15px;
        font-size: 16px;
        font-weight: 500;
        color: var(--white-color);
    }

    form input {
        display: block;
        height: 50px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 0 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
        border: none !important;
        outline: none !important;
        color: var(--white-color);
        font-size: 1.2rem;
    }

    form textarea {
        display: block;
        height: 15rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 10px 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
        border: none !important;
        outline: none !important;
        color: var(--white-color);
        resize: none;
        font-size: 1.1rem;
    }

    form div.postImage {
        display: block;
        height: 40rem;
        width: 100%;
        background-position: center;
        background-size: cover;
    }

    form div.postImage span {
        color: var(--bg-color);
        cursor: pointer;
        transition: 0.2s;
        font-size: 2rem;
        padding-left: 1rem;
    }

    form div.postImage span:hover {
        color: var(--green-color);
    }

    form button {
        margin-top: 20px;
        width: 100%;
        background-color: var(--white-color);
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        outline: none;
        border: none;
    }

    form button:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

    input[type="file"] {
        display: none;
    }

    .custom-file-upload {
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        max-width: fit-content;
        background-color: var(--white-color);
        color: #080710;
        font-size: 15px;
        font-weight: 600;
        border-radius: 5px;
        transition: 0.2s;
    }

    .custom-file-upload:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }
</style>
