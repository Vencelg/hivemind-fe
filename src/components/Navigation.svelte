<script>
    import SearchBar from "./SearchBar.svelte";
    import NavDropdown from "./NavDropdown.svelte";
    import Logo from "./Logo.svelte";

    let size = 3;

    if (screen.width <= 600) {
        size = 2;
    }
</script>

<nav>
    <div class="logo">
        <Logo {size} />
    </div>
    <SearchBar />
    <NavDropdown />
</nav>

<style>
    nav {
        display: grid;
        grid-template-columns: 1fr 1.5fr 1fr;
        background-color: var(--nav-bg-color);
    }

    @media only screen and (max-width: 425px) {
        .logo {
            display: none;
        }
        nav {
            grid-template-columns: 2fr 1fr;
            padding: 10px 0;
        }
    }
</style>
