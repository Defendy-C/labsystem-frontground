import axios from "axios";
import "../common/util";
import {getToken, minute} from "@/common/util";
import {
    resp,
    CommonApiMap,
    AdminApiMap
} from "@/api/api";

axios.defaults.timeout = minute
axios.defaults.headers.post["content-type"] = "application/json"
// 请求头加上token
axios.interceptors.request.use(
    config => {
        let t = getToken();
        config.headers.common['token'] = t ? t : "";
        return config;
    }
)

function post(api, params) {
    return axios.post(api, params).then(res => {
        return new resp(true, res.data.data);
    }).catch(res => {
        return new resp(false, res.response.data);
    });
}

async function postPNG(api, params) {
    return axios.post(api, params, {
        responseType: "arraybuffer",
    }).then(res => {
        let bytesArray = new Uint8Array(res.data);
        let bstr = bytesArray.reduce((data, byte) => data + String.fromCharCode(byte), "");
        bstr = "data:image/png;base64," + btoa(bstr);

        return bstr;
    }).catch(() => {
        return ;
    })
}

// common
export async function getVCodeKey() {
    return  await post(CommonApiMap.get("key"));
}

export async function getPuzzle(key, typ) {
   return await postPNG(CommonApiMap.get("img"), {
        key,
        typ,
   });
}

export async function verifyCode(key, code) {
    return await post(CommonApiMap.get("verify"), {
        key,
        code,
    });
}

// admin
export async function adminLogin(uname, password, key, code) {
    return await post(AdminApiMap.get("login"), {
        user_name: uname,
        password,
        key,
        v_code: code,
    });
}

export async function adminInfo() {
    return await post(AdminApiMap.get("info"));
}

export async function adminList(createdBy, page, pageSize) {
    return await post(AdminApiMap.get("list"), {
        created_by: createdBy,
        page: page,
        page_size: pageSize,
    })
}