const cheerio = require('cheerio');
const request = require('superagent');
const urlencode = require('urlencode');

const tencentLogo48Url = 'http://pc3.gtimg.com/softmgr/logo/48/';

module.exports = {
    softSearch: async (keyword, num, page) => {
        console.log(keyword,num,page);
        const res = await request.get("https://s.pcmgr.qq.com/tapi/web/searchcgi.php" +
            "?type=search&callback=searchCallback&keyword="+ urlencode(keyword) +
            "&page=" + page + "&pernum="+ num +"&more=0");
        let result = res.text;
        result = result.replace('searchCallback','').substr(1)
            .replace(/\);/,'');
        let json = JSON.parse(result);
        let arr = json.list;
        let softName = '',updateTime='',downloadLink='',versionName,logo48,feature,fileSize,whatsNew,pluginInfo,point,isFree,trial;
        let finalResult = [];
        for(let i = 0;i<arr.length;i++){
            let obj =  arr[i].xmlInfo;
            softName = arr[i].SoftName;
            versionName = obj.substring(obj.indexOf("<versionname>")+13,obj.indexOf("</versionname>"));
            updateTime = obj.substring(obj.indexOf("<publishdate>")+13,obj.indexOf("</publishdate>"));
            downloadLink = obj.substring(obj.indexOf("<url>")+5,obj.indexOf("</url>")).
                replace("<![CDATA[",'').replace("]]>",'').trim();
            logo48 = tencentLogo48Url + obj.substring(obj.indexOf("<logo48>")+8,obj.indexOf("</logo48>"));
            feature = obj.substring(obj.indexOf("<feature>")+9,obj.indexOf("</feature>")).
                replace("<![CDATA[",'').replace("]]>",'').trim();
            fileSize = obj.substring(obj.indexOf("<filesize>")+10,obj.indexOf("</filesize>"));
            whatsNew = parseXML(obj,"whatsnew");
            pluginInfo = parseXML(obj,"plugininfo");
            point = parseXML(obj,"point");
            isFree = (parseInt(parseXML(obj,"free")) === 0);
            trial = parseXML(obj,"trial");
            finalResult.push({
                softName:softName,
                versionName:versionName,
                updateTime:updateTime,
                downloadLink:downloadLink,
                logo:logo48,
                feature:feature,
                fileSize:change(fileSize),
                whatsNew:whatsNew,
                pluginInfo:pluginInfo,
                point: parseInt(point) / 20,
                isFree:isFree,
                trial:trial,
            });
        }
        return finalResult;
    },
};

const parseXML = (xml, node) => {
    if (xml.indexOf("<"+node+">") !== -1)
    return xml.substring(xml.indexOf("<"+ node +">")+node.length+2 ,xml.indexOf("</"+ node +">")).
        replace("<![CDATA[","").replace("]]>","").trim();
    else return null
};

const change = limit => {
    let size = "";
    if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
    }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
        size = (limit/1024).toFixed(2) + "KB"
    }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
        size = (limit/(1024 * 1024)).toFixed(2) + "MB"
    }else{                                            //其他转化成GB
        size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
    }

    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1 ,2);          //获取小数点后两位的值
    if(dou === "00"){                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
};
