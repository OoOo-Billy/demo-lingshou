export default {
    api: process.env.NODE_ENV === 'production' ?
        'https://ls.diandianyuyue.com' :
        '/api/',
    reg: {
        phone: /^1[345789]\d{9}$/,
    }
}