// resp
export class resp {
    constructor(success, data) {
        this.success = success;
        this.data = data;
    }
    HandleResp(error) {
        if (this.success) {
            if (this.data === null) {
                return true;
            }
            return this.data;
        }
        if (this.data.err !== "") {
            error(this.data.err);
            return
        }
        error("系统繁忙, 请稍后重试");
    }
}
// common
export let CommonApiMap = new Map();
CommonApiMap.set("key", "/api/common/vcode/key");
CommonApiMap.set("img", "/api/common/vcode/resource");
CommonApiMap.set("verify", "/api/common/vcode/verify");

// admin
export let AdminApiMap = new Map();
AdminApiMap.set("login", "/api/admin/login");
AdminApiMap.set("info", "/api/admin/info");
AdminApiMap.set("list", "/api/admin/list")
