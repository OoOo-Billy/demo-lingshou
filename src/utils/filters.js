const propSelectList = {
    '0': '唯一属性',
    '1': '单选属性',
    '2': '复选属性',
};

function getPropSelect(param) {
    return propSelectList[param]
}

export default {
    getPropSelect: getPropSelect,
}