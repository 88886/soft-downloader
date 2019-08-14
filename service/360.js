const cheerio = require('cheerio');
const request = require('superagent');
const urlencode = require('urlencode');

module.exports = {
    softSearch: async (keyword) => {
        const res = await request.get("http://baoku.360.cn/search/webSoftList/?kw=" +
            urlencode(keyword));
        let result = res.text;
        result = result.replace('getWebSoftListResult', '').substr(2);
        result = result.substr(0,result.length-1);
        let json = JSON.parse(result);
        let arr = json.data;
        let softName = '', softCate = '', updateTime = '', downloadLink = '', versionName, logo48, feature, fileSize, softDesc,
            pluginInfo, point, isFree, trial;
        let finalResult = [];
        for (let i = 0; i < arr.length; i++) {
            softName = arr[i].name;
            versionName = arr[i].edition_info.default_edition.version;
            updateTime = arr[i].edition_info.default_edition.pubtime;
            let d = new Date(updateTime * 1000);
            updateTime = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate());
            downloadLink = arr[i].edition_info.default_edition.down.default.durl.split('|||')[0];
            logo48 = arr[i].logo['48_trans'];
            feature = arr[i].brief;
            fileSize = arr[i].edition_info.default_edition.down.default.size;
            softDesc = arr[i].desc;
            pluginInfo = arr[i].edition_info.default_edition.plugin.intro;
            point = arr[i].qrank;
            isFree = (arr[i].edition_info.default_edition.free.flag === '2');
            trial = arr[i].edition_info.default_edition.free.intro;
            finalResult.push({
                softName: softName,
                versionName: versionName,
                updateTime: updateTime,
                downloadLink: downloadLink,
                logo: logo48,
                feature: feature,
                fileSize: change(fileSize),
                softDesc: softDesc,
                pluginInfo: pluginInfo,
                point: parseInt(point) / 20,
                isFree: isFree,
                trial: trial,
            });
        }
        return finalResult;
    },
};

const parseXML = (xml, node) => {
    if (xml.indexOf("<" + node + ">") !== -1)
        return xml.substring(xml.indexOf("<" + node + ">") + node.length + 2, xml.indexOf("</" + node + ">")).replace("<![CDATA[", "").replace("]]>", "").trim();
    else return null
};

const change = limit => {
    let size = "";
    if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
    } else if (limit < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {                                            //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }

    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1, 2);          //获取小数点后两位的值
    if (dou === "00") {                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
};
