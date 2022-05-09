<script>
    import { onMount } from "svelte";

    export let params;
    let usersSearchResult = [];
    onMount(async () => {
        const token = "Bearer " + window.localStorage.getItem("token");
        console.log(token);

        const res = await fetch("http://127.0.0.1:8000/api/users/" + params.value, {
            method: "GET",
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

        if (res.ok) {
            usersSearchResult = resultFinal.searchResult;
        } else {
            console.log(resultFinal);
        }
    });
</script>

<main>
    {#each usersSearchResult as user}
         <h2>{user.name}</h2>
    {:else}
         <h1>No users found</h1>
    {/each}
</main>
