import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '../components/Home.vue'
import PlotlyPopup from '../components/PlotlyPopup.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/plot',
            name: 'Plot',
            component: PlotlyPopup
        },
        {
            path: '/v/:id',
            name: 'View',
            component: Home
        }
    ]
})
