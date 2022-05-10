<script>
	import Router from "svelte-spa-router";
	import { routes } from "./scripts/routes";
    import { user } from "./stores/store.js";
</script>

<nav>
	<a href="#/">Home</a>
	<a href="#/login">Login</a>
	<a href="#/register">Register</a>
	<a href="#/profile">Profile</a>
	<a href="#/verify">Verify</a>
	<a href="#/logout">Logout</a>
</nav>

<Router {routes} />

<style>
</style>
