import Vue from 'vue'

// routers
import Router from 'vue-router'
import generalRoutes from './general';

Vue.use(Router)

function defaultRoute() {
    const element = document.getElementById('app');
    return element.dataset.role || 'systemProfile';
}

export default new Router({
    mode: 'hash', // Demo is living in GitHub.io, so required!
    linkActiveClass: 'open active',
    scrollBehavior: () => ({y: 0}),
    routes: [
                generalRoutes,
                {
                    path: '/',
                    redirect: { name: defaultRoute() },
                },
    ]
})
