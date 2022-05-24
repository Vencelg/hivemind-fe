<script>
    export let commentId = null;
    let response_content = "";
</script>

<form on:submit|preventDefault >
    <label for="response_content">Write your response:</label>
    <input type="text" name="response_content" id="response_content" bind:value="{response_content}">
</form>