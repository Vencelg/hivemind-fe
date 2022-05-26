<script>
    export let userProfile;
</script>

<div class="box">
    <div class="flex">
        <div
            class="userImage"
            style="background-image: url({userProfile.profile_picture});"
        />
        <div class="userData">
            <p id="font" href="#/profile/{userProfile.id}">
                {userProfile.name}
            </p>
            <p href="#/profile/{userProfile.id}">@{userProfile.username}</p>
        </div>
    </div>
</div>

<style>
    p#font {
        font-family: AlteHaasBold;
    }

    div.box {
        background-color: var(--nav-bg-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin: auto;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 10px;
    }

    div.box:hover {
        background-color: var(--comment-color);
    }

    div.box div.flex {
        display: flex;
    }

    div.box div.flex div.userImage {
        background-color: var(--white-color);
        height: 3rem;
        width: 3rem;
        background-position: center;
        background-size: cover;
        border-radius: 50%;
    }

    div.box div.flex div.userData {
        padding-left: 1rem;
    }

    div.box div.flex div.userData p {
        display: block;
        text-decoration: none;
        color: var(--white-color);
        cursor: pointer;
        transition: 0.1s;
    }

    div.box div.flex div.userData p:hover {
        color: var(--green-color);
    }

    /* div.box div.buttons {
        display: flex;
    }

    div.box div.buttons button {
        background-color: #ffffff;
        color: #080710;
        padding: 5px 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
        border: none !important;
        outline: none !important;
    }

    div.box div.buttons button.accept {
        border-radius: 5px 0 0 5px;
    }

    div.box div.buttons button.cross {
        border-radius: 0 5px 5px 0;
    }

    div.box div.buttons button.accept:hover {
        background-color: var(--green-color);
        color: var(--white-color);
    }

    div.box div.buttons button.cross:hover {
        background-color: var(--comment-color);
        color: var(--white-color);
    } */
</style>
