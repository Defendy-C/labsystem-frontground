import {createRouter, createWebHistory} from "vue-router";
import adminLogin from "@/views/LoginAdmin"
import mainAdmin from "@/views/MainAdmin";
import {clearToken, verifyToken} from "@/common/util";
import adminList from "@/components/adminList";
import adminCreate from "@/components/adminCreate";

export const baseRouter = createRouter({
    history: createWebHistory(),
    routes: [
        {
          path: "/admin",
          component: adminLogin,
          name: "adminLogin",
          prop: route => ({query: route.query.verify}),
          meta: {
            auth: false,
          }
        },
        {
            path: "/admin/main",
            component: mainAdmin,
            name: "mainAdmin",
            redirect: "/admin/main/list",
            meta: {
                auth: true,
            },
            children: [
                {
                    path: "/admin/main/list",
                    name: "adminList",
                    component: adminList,
                    meta: {
                        auth: true,
                    },
                },
                {
                    path: "/admin/main/create",
                    name: "adminCreate",
                    component: adminCreate,
                    meta: {
                        auth: true,
                    },
                }
            ]
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/admin",
        },
    ],
});

baseRouter.beforeEach((to, from, next) => {
    // token 校验
    if (to.meta.auth) {
        if (!verifyToken()) {
            clearToken();
            next({name: "adminLogin"});
        }
    }
    next();
});