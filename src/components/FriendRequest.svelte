<script>
    import { getContext } from "svelte";
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import { toast } from "@zerodevx/svelte-toast";
    import api from "../scripts/api";

    const { close } = getContext("simple-modal");

    export let request;
    let xbutton;
    let ybutton;

    //Odmítnutí žádosti o přátelství
    const handleFriendshipRequestDelete = async () => {
        ybutton.disabled = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "friends/" + request.id, {
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
            toast.push("Friend request declined", {
                classes: ["successNoBar"],
            });

            $user.friend_requests = $user.friend_requests.filter(
                (friendRequest) => friendRequest.id != request.id
            );
        }
        ybutton.disabled = false;
    };

    //Přijmutí žádosti o přátelství
    const handleFriendshipRequestUpdate = async () => {
        xbutton.disabled = true;
        const token = "Bearer " + window.localStorage.getItem("token");

        const res = await fetch(api + "friends/" + request.id, {
            method: "PUT",
            body: JSON.stringify({
                accepted: 1,
            }),
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
            toast.push("Friend request accepted", {
                classes: ["successNoBar"],
            });

            $user.friend_requests = $user.friend_requests.filter(
                (friendRequest) => friendRequest.id != request.id
            );
        }

        xbutton.disabled = false;
    };
</script>

<div class="box">
    <div class="flex">
        <div
            class="userImage"
            style="background-image: url({request.user.profile_picture});"
        />
        <div class="userData">
            <a
                id="font"
                href="#/profile/{request.user.id}"
                on:click={() => close()}>{request.user.name}</a
            >
            <a href="#/profile/{request.user.id}" on:click={() => close()}
                >@{request.user.username}</a
            >
        </div>
    </div>

    <div class="buttons">
        <button
            class="accept"
            bind:this={xbutton}
            on:click={handleFriendshipRequestUpdate}>Accept</button
        >
        <button
            bind:this={ybutton}
            class="cross"
            on:click={handleFriendshipRequestDelete}
            ><Fa icon={faXmark} /></button
        >
    </div>
</div>

<style>
    a#font {
        font-family: AlteHaasBold;
    }

    div.box {
        background-color: var(--nav-bg-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 25rem;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 10px;
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

    div.box div.flex div.userData a {
        display: block;
        text-decoration: none;
        color: var(--white-color);
        cursor: pointer;
        transition: 0.1s;
    }

    div.box div.flex div.userData a:hover {
        color: var(--green-color);
    }

    div.box div.buttons {
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
    }

    @media only screen and (max-width: 700px) {
        div.box {
            width: 95%;
        }
    }

    @media only screen and (max-width: 425px) {
        div.box div.flex div.userData {
            padding-left: 0.1rem;
        }
    }
</style>
