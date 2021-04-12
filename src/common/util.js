import JSEncrypt from 'jsencrypt'
import rsa from 'node-rsa'
import { ref } from "vue"

export const minute = 60 * 1000;

// encrypt
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiSQsbadO2FKbyQf6L7UpJmL86
dtdBh+6oW+FEyUjwXStc/9Ij4DtWr6r9/ckGTKC3YxtUy01uwwrZkU8shi9wcbU1
NlkT/rMd9G0azQ7S8ftJLh9p+vvInDPOoAp+46j+5hNx2zcbPzeVSWQrwgw91dli
vCWqohy5pFqKNMC37wIDAQAB
-----END PUBLIC KEY-----
`;

// error or tip
export const err_server = "连接不到服务器, 请稍候重试";
export const err_login = "用户名或密码错误";
export const err_empty = "必填字段不能为空";
export const err_pwd_check = "密码不一致";
export const err_pwd_new_old_check = "新旧密码不能相同";
export const err_nickname_format = "昵称格式不正确: 只能包含数字, 字母且长度4-10";
export const err_password_format = "密码格式不正确: 不能含有空格, 制表符等空白字符且长度6-16";
export const tip_create = "创建成功";
export const tip_update = "更新成功";
export const confirm_loginout = "是否确认注销?";
export const confirm_update_admin = "是否确认更新管理员信息?";

// regexp
const reUserName = /[0-9a-zA-Z]{4,10}/;
const rePassword =  /\S{6,16}/;

// tool
function packZero(num) {
    return num < 10 ? '0' + num : num;
}

export function dateFormat(date) {
    let year = date.getFullYear();
    let month = packZero(date.getMonth() + 1);
    let day = packZero(date.getDate());
    let hour = packZero(date.getHours());
    let minute = packZero(date.getMinutes());
    let second = packZero(date.getSeconds());
    return year + '/' + month + '/' + day + ' ' +  getWeek() + ' ' + hour + ':' + minute + ':' + second;
}

function getWeek() {
    const d = new Date();
    const week = d.getDay()
    switch (week) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    }
}

export function setToken(token) {
    window.localStorage.setItem("token", token);
}

export function getToken() {
    return window.localStorage.getItem("token");
}

export function clearToken() {
    window.localStorage.setItem("token", "");
}

export function verifyToken() {
    const token = getToken();
    const arr = token.split(".");
    if (arr.length < 3) {
        return false;
    }
    const signData = arr[0] + '.' + arr[1];
    const data = arr[2];
    try{
        const key = rsa(publicKey);
        return key.verify(signData, data, 'utf8', 'base64');
    } catch (e) {
        return false;
    }
}

export function rsaEncrypt(password) {
    const encryptor = new JSEncrypt({
        default_key_size: 1024,
    });
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(password);
}

export function dateUpdatePerSecond() {
    let timer = ref(dateFormat(new Date()));
    function start() {
        setInterval(() => {
            timer.value = dateFormat(new Date());
        }, 1000);
    }

    return {timer, start};
}

export function strToInt(num) {
    let res = 0;
    try {
        res = parseInt(num);
    }catch (e) {
        console.error(e);
        return res;
    }

    return res;
}

export function checkNickName(name) {
    return reUserName.test(name);
}

export function checkPassword(password) {
    return rePassword.test(password);
}