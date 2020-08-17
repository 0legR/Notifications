<template>
    <div class="app">
        <div class="app-body">
            <Sidebar :navItems="nav" />
            <main class="main">
                <breadcrumb :list="list"/>
                <div class="container-fluid full-content">
                    <router-view></router-view>
                    <div v-if="isLoading" class="gag-container container col-sm-12 d-flex flex-md-row justify-content-center align-items-center p-0">
                        <i class="fa fa-gear fa-lg fa-spin" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
    import {Sidebar, Breadcrumb} from '../components/'
    import { mapState } from 'vuex';
    import {hasRole, userRole} from '../views/roles/rolesConstants';

    export default {
        name: 'full',
        components: {
            Sidebar,
            Breadcrumb
        },
        data() {
            return {
                generalRoutes: ['/dashboard', '/notification', '/general' ]
            }
        },
        computed: {
            name() { return this.$route.name },
            list() { return this.$route.matched },
            ...mapState({
                isLoading: function (state) { return state.isGlobalLoading },
                nav: function (state) { return state.nav }
            }),
        },
        methods: {
            checkRoute: function () {
                const urlRole = userRole(this);
                if (this.redirectToProfile(urlRole)) {
                    this.$router.beforeEach((to, from, next) => {
                        const roleStr = to.path.split("/")[1];
                        let role = '/' + roleStr;
                        if (this.redirectToDefault(roleStr)) {
                            if ($.inArray( role, this.generalRoutes ) <= -1 && !_.find(this.$store.getters.roles, ['url', role])) {
                                this.$router.push({ path: `/${role}` });
                            } else {
                                next();
                            }
                        }
                    });
                }
            },
            redirectToDefault: function (role) {
                if (hasRole(role, this) || (this.generalRoutes.find(route => route.indexOf(role) > -1))) {
                    return true;
                } else {
                    let myToast = this.$toasted.show('defaultText', {type: 'info'});
                    myToast.text(`користувач не має ролі ${role}`).goAway(5000);
                    this.$router.push({ name: 'defaultRoute' });
                    return false;
                }
            }
        }
    }
</script>

<style scoped>
    .full-content {
        padding: 0 20px;
    }
    .fa-spinner,
    .fa-refresh,
    .fa-gear,
    .fa-cog,
    .fa-circle-o-notch {
        font-size: 80px;
        color: #999;
        margin-left: 15%;
    }
    .gag-container {
        background-color: rgba(0,0,0,0.1);
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 20;
    }
    @media screen and (min-width: 1440px) {
        .full-content {
            padding: 0 60px;
        }
    }
</style>
