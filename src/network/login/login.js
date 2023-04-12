import {request} from "../request";
// 手机号登录
export function login(phone,password){
    return request({
        url:'/login/cellphone',
        params:{
            phone,
            password
        }
    })
}

// 二维码登录
// 获取二维码key
export function getQrKey(){
    return request({
        url:'/login/qr/key',
        params:{
            timestamp:Date.parse(new Date())
        }
    })
}
// 生成二维码
export function getLoginQr(key){
    return request({
        url:'/login/qr/create',
        params:{
            key,
            timestamp:Date.parse(new Date()),
            qrimg:true
        }
    })
}
// 检查二维码状态
export function checkLoginQr(key){
    return request({
        url:'/login/qr/check',
        params:{
            key,
            timestamp:Date.parse(new Date())
        }
    })
}

// 获取用户账号信息
export function getUserAccount(){
    return request({
        url:'/user/account',
        params:{
            timestamp:Date.parse(new Date())
        }
    })
}
// 签到
export function dailySignin(){
    return request({
        url:'/daily_signin',
        params:{
            type:1
        }
    })
}

// 退出登录
export function logout(){
    return request({
        url:'/logout'
    })
}


//注册账号
//获取验证码
export function getAuthcode(phone){
    return request({
        url:'/captcha/sent',
        params:{
            phone,
        }
    })
}
//检查验证码
export function checkAuthcode(phone,captcha){
    return request({
        url:'/captcha/verify',
        params:{
            phone,
            captcha
        }
    })
}
//注册(修改密码)
export function register(phone,captcha,password,nickname){
    return request({
        url:'/register/cellphone',
        params:{
            phone,
            captcha,
            password,
            nickname
        }
    })
}
// 检测手机号码是否已注册
export function checkPhoneNum(phone){
    return request({
        url:'/cellphone/existence/check',
        params:{
            phone,
        }
    })
}
// 初始化昵称
export function initNickName(nickname){
    return request({
        url:'/activate/init/profile',
        params:{
            nickname,
        }
    })
}