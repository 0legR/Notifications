window.Vue = require('vue');
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        roles: [],
        user:null,
        counters: {
            notifications: 0
        },
        nav: {
            roles: [],
            items: []
        },
        isGlobalLoading: false,
    },
    getters: {
        roles: state => {
            return state.roles;
        },
    },
    mutations: {
        setCurrentUser(state,response){
            state.user = response;
        },
        setCounters(state, data) {
            state.counters[data.type] = data.value;
        },
    },
    actions: {
        getCurrentUser: function(context){
            const url = '/cab/currentUser';
            return new Promise((resolve, reject) => {
                axios.get(url)
                    .then(response => {
                        context.commit('setCurrentUser', response.data.user);
                        context.commit('setCounters', {
                            type: 'notifications',
                            value: response.data.notifications
                        });
                        resolve(response);
                    })
                    .catch(error => reject(error));
            });
        },
    }
});
