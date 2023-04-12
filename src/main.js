import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/**全局使用Elemen-ui**/
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

/**使用图片懒加载**/
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
	loading: require("assets/imgs//loadImg.gif"),
	error: require("assets/imgs/error.png"),
	attempt: 6,
	observer: true,
});

/**
 * 自定义全局过滤器
 */
//  格式化大于10000的数字
import formatNum from "./common/formatNum";
Vue.use(formatNum);
// 格式化时长
import formatDuration from "./common/formatDuration";
Vue.use(formatDuration);
/**
 * 全局组件挂载
 */
// 分页组件
import Pagination from "components/common/Pagination";
Vue.component("Pagination", Pagination);
/**
 * 全局读取loacaStorage
 */
import { setItem, getItem, removeItem } from "common/utils.js";
Vue.prototype.setItem = setItem;
Vue.prototype.getItem = getItem;
Vue.prototype.removeItem = removeItem;

Vue.config.productionTip = false;
new Vue({
	router,
	store,
	render: function (h) {
		return h(App);
	},
}).$mount("#app");
