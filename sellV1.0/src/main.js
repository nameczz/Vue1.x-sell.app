import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

let app = Vue.extend(App);

let router = new VueRouter({
	linkActiveClass: 'active'
});

router.map({
	'/goods': {
		component: goods
	},
	'/seller': {
		component: seller
	},
	'/ratings': {
		component: ratings
	}
});

router.start(app, '#app');
 // router.go('/goods');   评论或者商家若使用了$nextTick和betterscroll，在刚打开页面时会调用DOM，但是router.go('/goods')会把评论商家DOM删除，导致报错
