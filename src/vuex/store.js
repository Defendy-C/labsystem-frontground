import {createStore} from "vuex";
import { adminInfo } from "@/api/http";
import {err_server} from "@/common/util";

export default createStore({
    state() {
        return{
            adminName: "",
            adminPowers: [],
            ErrSensor: 0,
            errMsg: "",
        }
    },
    mutations: {
        setAdmin(state, {name, powers}) {
            state.adminName = name;
            state.adminPowers = powers;
        },
        Err(state, err) {
            state.ErrSensor = (state.ErrSensor + 1) % 2;
            state.errMsg = err;
        },
    },
    actions: {
        async getAdmin(context) {
            if (context.state.adminName !== "" && context.state.adminPowers.length > 0) {
                return {name: context.state.adminName, powers: context.state.adminPowers};
            }
            let resp = await adminInfo();
            let res = resp.HandleResp(() => {console.error(err_server)});
            if (res) {
                context.commit("setAdmin", {name: res.name, powers: res.powers});
            }

            return {name: context.state.adminName, powers: context.state.adminPowers};
        }
    }
});