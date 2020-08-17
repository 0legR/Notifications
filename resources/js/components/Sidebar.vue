<template>
    <div class="sidebar" id="sidebar">
        <nav class="sidebar-nav">
            <ul class="nav bg-cabinet-dark" v-if="navItems.roles.length">
                <li class="nav-item" v-for="(item, index) in navItems.roles">
                    <template v-if="item.title">
                        <SidebarNavTitle :name="item.name"/>
                    </template>
                    <template v-else-if="item.divider">
                        <li class="divider"></li>
                    </template>
                    <template v-else>
                        <template v-if="item.children">
                            <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon">
                                <template v-for="(child, index) in item.children">
                                    <template v-if="child.children">
                                        <SidebarNavDropdown :name="child.name" :url="child.url" :icon="child.icon">
                                            <li class="nav-item" v-for="(child, index) in item.children">
                                                <SidebarNavLink :name="child.name" :url="child.url" :icon="child.icon" :counters="barCounters" />
                                            </li>
                                        </SidebarNavDropdown>
                                    </template>
                                    <template v-else>
                                        <li class="nav-item">
                                            <SidebarNavLink :name="child.name" :url="child.url" :icon="child.icon" :counters="barCounters"/>
                                        </li>
                                    </template>
                                </template>
                            </SidebarNavDropdown>
                        </template>
                        <template v-else>
                            <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge" :title="item.name" class="active-item" :counters="barCounters"/>
                        </template>
                    </template>
                    <hr class="gray-line" />
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
    import SidebarNavDropdown from './SidebarNavDropdown'
    import SidebarNavLink from './SidebarNavLink'
    import SidebarNavTitle from './SidebarNavTitle'
    import { mapState } from 'vuex';

    export default {
        name: 'sidebar',
        props: {
            navItems: {
                type: Object,
                required: true,
                default: () => {}
            }
        },
        data: function () {
            return {
                barCounters: {notification: 0}
            }
        },
        components: {
            SidebarNavDropdown,
            SidebarNavLink,
            SidebarNavTitle
        },
        computed: { ...mapState(['counters']) },
        watch: {
            counters: {
                handler: function(val) {
                    if (val && +this.barCounters.notification !== +val.notifications) {
                        this.barCounters.notification = val.notifications;
                    }
                },
                deep: true
            }
        },
    }
</script>
