import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [{
    path: '/',
    redirect: '/bpmn-plus'
},
{
    path: '/bpmn-plus',
    component: () =>
        import('./../components/bpmn-plus')
}]

export default new Router({
    mode: 'history',
    routes
})