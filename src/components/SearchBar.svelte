<script>
    import { push, pop, replace } from "svelte-spa-router";
    import Fa from "svelte-fa";
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    let value;

    const searchValue = () => {
        push("/search/" + value);
    };
</script>

<div>
    <input type="text" name="search" id="search" bind:value />
    <button on:click={searchValue}><Fa icon={faMagnifyingGlass} /></button>
</div>

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div input {
        display: block;
        border: none;
        outline: none;
        height: 40px;
        width: 80%;
        background-color: rgba(255, 255, 255, 0.07);
        padding: 0 10px;
        font-size: 14px;
        font-weight: 300;
        border-radius: 3px 0 0 3px;
        color: var(--white-color);
    }

    
    div button {
        border: none;
        color: var(--white-color);
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 0 3px 3px 0;
        height: 40px;
        padding-right: 10px;
        cursor: pointer;
        transition: 0.1s;

    }

    div button:hover {
        color: var(--green-color);
    }

    
</style>
