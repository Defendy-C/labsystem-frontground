import { createApp } from 'vue'
import App from './App'
import './base/base.css'
import 'font-awesome/css/font-awesome.min.css'
import { baseRouter } from './router';
import store from "./vuex/store"

createApp(App).use(baseRouter).use(store).mount('#app');