<script>
    import Router from "svelte-spa-router";
    import { routes } from "./scripts/routes";
    import { user } from "./stores/store.js";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import Modal from "svelte-simple-modal";
</script>

<Modal closeButton={false} styleWindow={{backgroundColor: "transparent", width: "70rem"}} >
    <Router {routes} />
    <SvelteToast />
</Modal>

<style>
    :global(.successBar) {
        --toastBackground: #13e235;
        --toastBarBackground: #178b2b;
    }

    :global(.successNoBar) {
        --toastBackground: #13e235;
        --toastBarBackground: #13e235;
    }

    :global(.dangerBar) {
        --toastBackground: #e21313;
        --toastBarBackground: #8b1717;
    }

    :global(.dangerNoBar) {
        --toastBackground: #e21313;
        --toastBarBackground: #e21313;
    }
</style>
