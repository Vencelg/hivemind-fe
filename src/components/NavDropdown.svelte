<script>
    import { user } from "../stores/store.js";
    import Fa from "svelte-fa";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { faUser } from "@fortawesome/free-solid-svg-icons";
    import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

    $: isOpen = false;
</script>

<div class="relative">
    <div
        class="dropdownBox"
        on:click={() => {
            isOpen = !isOpen;
        }}
    >
        <img
            src={$user.profile_picture}
            width="45px"
            height="45px"
            alt="Users profile"
        />
        <span id="mobileSpan"><Fa icon={faCaretDown} /></span>
        <p>{$user.name}<span><Fa icon={faCaretDown} /></span></p>
    </div>
    {#if isOpen}
        <div class="dropdown">
            <p>Profile<span><Fa icon={faUser} /></span></p>
            <p>Logout<span><Fa icon={faRightFromBracket} /></span></p>
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
        bottom: -100px;
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
        justify-content: space-between;
        align-items: center;
        width: 32%;
        height: 100%;
        margin: auto;
        transition: 0.1s;
    }

    .dropdownBox:hover {
        cursor: pointer;
    }

    .dropdownBox img {
        border-radius: 2rem;
    }

    .dropdownBox p {
        color: var(--white-color);
    }

    .dropdownBox p span {
        padding-left: 10px;
    }

    .dropdownBox:hover > #mobileSpan {
        color: var(--green-color);
    }

    .dropdownBox:hover > p > span {
        color: var(--green-color);
    }

    @media only screen and (max-width: 1690px) {
        .dropdownBox {
            width: 45%;
        }
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

        .dropdownBox {
            width: 45%;
        }
    }
</style>
