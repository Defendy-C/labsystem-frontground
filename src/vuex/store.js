import {createStore} from "vuex";

export default createStore({
    state() {
        return{
            adminName: "",
            ErrSensor: 0,
            errMsg: "",
        }
    },
    mutations: {
        getAdminName(state) {
            return state.adminName;
        },
        setAdminName(state, name) {
            state.adminName = name;
        },
        Err(state, err) {
            state.ErrSensor = (state.ErrSensor + 1) % 2;
            state.errMsg = err;
        },
    },
});