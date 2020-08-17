<template>
	<div class="animated fadeIn">
        <ul class="nav flex-column flex-sm-row nav-tabs">
            <li class="nav-item" v-for="(item, key) in tabList">
                <router-link
                    :to="item.url"
                    v-html="item.label"
                    class="nav-link simple"
                    exact-active-class="active"
                />
            </li>
        </ul>
	    <router-view />
	</div>
</template>
<script>
	
	export default {
        name: 'notification',
        data: function () {
            return {
                tabList: [
                    {
                        label: this.$t('messages.532'),
                        url: {path: 'inbox'}
                    },
                    {
                        label: 'Надіслані',
                        url: {path: 'sent'}
                    },
                    {
                        label: 'Системні',
                        url: {path: 'system'}
                    },
                    {
                        label: 'Видалені',
                        url: {path: 'trash'}
                    }
                ]
            }
        }
    }
</script>
