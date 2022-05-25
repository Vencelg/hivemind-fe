<script>
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import {
        faCaretDown,
        faPersonCirclePlus,
    } from "@fortawesome/free-solid-svg-icons";
    import { faUser } from "@fortawesome/free-solid-svg-icons";
    import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
    import { push, pop, replace } from "svelte-spa-router";
    import ShowFriendRequestsModal from "./ShowFriendRequestsModal.svelte";
    import { getContext } from "svelte";

    $: isOpen = false;

    const { open } = getContext("simple-modal");
    const showFriendRequests = () => {
        isOpen = !isOpen;
        open(ShowFriendRequestsModal);
    };
</script>

<div class="relative">
    <div class="dropdownBox">
        <div
            on:click={() => {
                isOpen = !isOpen;
            }}
        >
            <div
                class="profileImage"
                style={"background-image: url(" + $user.profile_picture + ");"}
            />
            <span id="mobileSpan"><Fa icon={faCaretDown} /></span>
            <p>{$user.name}<span><Fa icon={faCaretDown} /></span></p>
        </div>
    </div>
    {#if isOpen}
        <div class="dropdown">
            <p
                on:click={() => {
                    push("/profile/" + $user.id);
                }}
            >
                Profile<span><Fa icon={faUser} /></span>
            </p>
            <p on:click={showFriendRequests}>
                Freind Requests<span><Fa icon={faPersonCirclePlus} /></span>
            </p>
            <p
                on:click={() => {
                    push("/logout");
                }}
            >
                Logout<span><Fa icon={faRightFromBracket} /></span>
            </p>
        </div>
    {/if}
</div>

<style>
    .relative {
        position: relative;
    }
    #mobileSpan {
        display: none;
        padding-left: 20px;
        color: var(--white-color);
    }

    .dropdown {
        position: absolute;
        background-color: var(--nav-bg-color);
        bottom: -158px;
        right: 9.5vw;
        min-width: 170px;
        margin: auto;
    }

    .dropdown p {
        color: var(--white-color);
        cursor: pointer;
        transition: 0.1s;
        padding: 1rem 0 1rem 1rem;
    }

    .dropdown p span {
        color: var(--white-color);
        transition: 0.1s;
        float: right;
        padding-right: 1rem;
    }

    .dropdown p:hover {
        color: #ffffff;
    }

    .dropdown p:hover > span {
        color: var(--green-color);
    }

    .dropdownBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        transition: 0.1s;
    }

    .dropdownBox div {
        width: max-content;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .dropdownBox div.profileImage {
        border-radius: 2rem;
        width: 3rem;
        height: 3rem;
        background-position: center;
        background-size: cover;
        background-color: var(--white-color);
    }

    .dropdownBox div p {
        color: var(--white-color);
        padding-left: 10px;
    }

    .dropdownBox p span {
        padding-left: 10px;
    }

    .dropdownBox div:hover > #mobileSpan {
        color: var(--green-color);
    }

    .dropdownBox div:hover > p > span {
        color: var(--green-color);
    }

    @media only screen and (max-width: 1690px) {
        /*  .dropdownBox {
            width: 45%;
        } */
    }

    @media only screen and (max-width: 1300px) {
        .dropdown {
            right: 7.5vw;
        }
    }

    @media only screen and (max-width: 768px) {
        .dropdownBox {
            width: 100%;
        }

        .dropdown {
            right: 0;
            bottom: -106px;
        }
    }

    @media only screen and (max-width: 425px) {
        .dropdownBox p {
            display: none;
        }

        .dropdownBox #mobileSpan {
            display: contents;
        }

        /* .dropdownBox {
            width: 45%;
        } */
    }
</style>
