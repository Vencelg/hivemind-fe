import Home from '../routes/Home.svelte';
import NotFound from '../routes/NotFound.svelte';
import Login from '../routes/Login.svelte';
import Register from '../routes/Register.svelte';
import Profile from '../routes/Profile.svelte';
import Verify from '../routes/Verify.svelte';
import Logout from '../routes/Logout.svelte';
import SearchResult from '../routes/SearchResult.svelte';

export let routes = {
    "/": Home,
    "/login": Login,
    "/register": Register,
    "/profile/:user": Profile,
    "/verify": Verify,
    "/logout": Logout,
    "/search/:value": SearchResult,

    "*": NotFound,
}