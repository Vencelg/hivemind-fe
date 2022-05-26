<script>
    import { posts } from "../stores/posts.js";
    import { user } from "../stores/store.js";
    import { userProfile } from "../stores/userProfile.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { getContext } from "svelte";
    import Fa from "svelte-fa";
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import api from "../scripts/api";

    const { close } = getContext("simple-modal");

    let nameErrors = false;
    let usernameErrors = false;
    let imageChanged = false;
    let name = $user.name;
    let username = $user.username;
    let files;
    let imageInput;
    let pfpShow = $user.profile_picture;

    const onImageChange = () => {
        imageChanged = true;
        let temp = null;
        var reader = new FileReader();
        reader.onload = (e) => {
            temp = e.target.result;
            pfpShow = temp;
        };

        reader.readAsDataURL(files[0]);
    };

    const handleUserUpdate = async () => {
        nameErrors = false;
        usernameErrors = false;
        let formData = new FormData();

        if (name != null && name != "") {
            formData.append("name", name);
        } else {
            toast.push("Name field is required", {
                classes: ["dangerNoBar"],
            });
            nameErrors = true;
        }

        if (username != null && username != "") {
            formData.append("username", username);
        } else {
            toast.push("Username field is required", {
                classes: ["dangerNoBar"],
            });
            usernameErrors = true;
        }

        if (imageChanged) {
            formData.append("profile_picture", files[0]);
        }

        if (nameErrors || usernameErrors) {
            return;
        }

        const token = "Bearer " + window.localStorage.getItem("token");

        const resUpdate = await fetch(api + "auth/editUser", {
            method: "POST",
            body: formData,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                Authorization: token,
            },
            mode: "cors",
        });

        const jsonUpdate = await resUpdate.json();
        const resultUpdate = JSON.stringify(jsonUpdate);
        let resultFinalUpdate = await JSON.parse(resultUpdate);

        console.log(resultFinalUpdate);

        if (resUpdate.ok) {
            $user = resultFinalUpdate.user;
            $userProfile = resultFinalUpdate.user;

            for (let i = 0; i < $posts.length; i++) {
                $posts[i].user = $user;
            }

            toast.push("Profile updated", {
                classes: ["successNoBar"],
            });
            close();
        }
    };
</script>

<div class="container">
    <div class="avatar-upload">
        <div class="avatar-edit">
            <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                bind:files
                bind:this={imageInput}
                on:change={onImageChange}
            />
            <label for="imageUpload"><Fa icon={faPencil} /></label>
        </div>
        <div class="avatar-preview">
            <div
                id="imagePreview"
                style={"background-image: url(" + pfpShow + ");"}
            />
        </div>
    </div>
    <form on:submit|preventDefault>
        <input
            class:outline={nameErrors == true}
            type="text"
            name="name"
            id="name"
            bind:value={name}
        />

        <input
            class:outline={usernameErrors == true}
            type="text"
            name="username"
            id="username"
            bind:value={username}
        />

        <button type="submit" on:click={handleUserUpdate}>Save</button>
    </form>
</div>

<style>
    .outline {
        border: 1px solid var(--red-color) !important;
    }

    form {
        background-color: var(--nav-bg-color);
        width: 70%;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 1rem;
        border-radius: 10px;
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

    form button {
        margin-top: 50px;
        width: 60%;
        background-color: #ffffff;
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.2s;
        border: none !important;
        outline: none !important;
    }

    form button:hover {
        margin-top: 50px;
        background-color: var(--green-color);
        color: var(--white-color);
    }

    .avatar-upload {
        position: relative;
        max-width: 205px;
        margin: 50px auto;
    }
    .avatar-upload .avatar-edit {
        position: absolute;
        right: 12px;
        z-index: 1;
        top: 10px;
    }
    .avatar-upload .avatar-edit input {
        display: none;
    }
    .avatar-upload .avatar-edit input + label {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        height: 34px;
        margin-bottom: 0;
        border-radius: 100%;
        background: var(--nav-bg-color);
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all 0.2s ease-in-out;
        color: var(--white-color);
    }
    .avatar-upload .avatar-edit input + label:hover {
        color: var(--green-color);
    }
    .avatar-upload .avatar-edit input + label:after {
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        text-align: center;
        margin: auto;
    }
    .avatar-upload .avatar-preview {
        width: 192px;
        height: 192px;
        position: relative;
        border-radius: 100%;
        border: 6px solid var(--nav-bg-color);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    }
    .avatar-upload .avatar-preview > div {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-color: var(--white-color);
    }

    @media only screen and (max-width: 550px) {
        form {
            width: 100%;
        }
    }
</style>
