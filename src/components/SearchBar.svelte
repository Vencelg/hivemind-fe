<script>
    import { push, pop, replace } from "svelte-spa-router";
    let value;

    const searchValue = () =>{
        push("/search/" + value);
    }
</script>

<div>
    <h2>Search Bar</h2>
    <input type="text" name="search" id="search" bind:value />
    <button on:click="{searchValue}">Search</button>
</div>
