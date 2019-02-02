const propSelectList = {
    '0': '唯一属性',
    '1': '单选属性',
    '2': '复选属性',
};

const orderStatus = {
    '0': '已关闭',
    '1': '待付款',
    '2': '待发货',
    '3': '待收货',
    '4': '待评价',
    '5': '已完成',
};

function getPropSelect(param) {
    return propSelectList[param]
}

function getOrderStatus(param) {
    return orderStatus[param]
}

export default {
    getPropSelect: getPropSelect,
    getOrderStatus: getOrderStatus,
}