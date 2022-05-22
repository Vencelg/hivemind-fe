<script>
    export let imageSrc = "";
</script>

<div class="image">
    <img src="{imageSrc}" alt="">
</div>

<style>
    div.image {
        width: 100%;
    }

    div.image img {
        height: calc(100vw/3);
        width: 100%;
    }
</style>