var lun = new Lunar(); //月历全局对象
var msc = new sun_moon(); //日月计算全局对象
var curJD; //现在日期
var curTZ; //当前时区


function getAllYearList(){
    var yearList = new Array();
    yearList['key'] = '0';
    yearList['value'] = '年';
    array = [];
    array.push(yearList);
    for(var i=1900;i<=2100;i++){
        yearList['key'] = i;
        yearList['value'] = i;
        array.push(yearList);
    }

    return array;
}

//判断浏览器类型
function checkPlatform(){
    var ltype;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc) ){
        ltype = 'ios';
    }
    if(bIsAndroid || bIsCE || bIsWM){
        ltype = 'android';
    } else {
        ltype = 'ios';
    }

    return ltype;
}

//通过用户选择的八字信息,找到确定的时间
//yearGan:年干,yearZhi:年支
//monthGan:月干,monthZhi:月支
//dayGan:日干,dayZhi:日支
//timeGan:时干,timeZhi:时支
function getMyTimeByBaZi(yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, timeGan, timeZhi) {
    var ganList = initTianGan();
    var zhiList = initDiZhi();

    //提取天干地支
    var yGan = ganList[yearGan];
    var yZhi = zhiList[yearZhi];
    var mGan = ganList[monthGan];
    var mZhi = zhiList[monthZhi];
    var dGan = ganList[dayGan];
    var dZhi = zhiList[dayZhi];
    var tGan = ganList[timeGan];
    var tZhi = zhiList[timeZhi];

    var cYearGanZhi = yGan + yZhi;
    var cMonthGanZhi = mGan + mZhi;
    var cDayGanZhi = dGan + dZhi;
    var cShiGanZhi = tGan + tZhi;

    //alert(cYearGanZhi+"-"+cMonthGanZhi+"-"+cDayGanZhi+"-"+cShiGanZhi);


    //找到年份
    var cYear = getYearByBaZi(cYearGanZhi);
    //alert('cYear=='+cYear);
    //找月份
    //var cMonth = getMonthByYear(cYear, cMonthGanZhi) - 1;
    var cMonth = getMonthByYear(cYear, cMonthGanZhi);
    //alert('cMonth11=='+cMonth);
    var num = getDayNumsByYearMonth(cYear, cMonth);
    //alert('num111=='+num);
    //找天
    var cDay = getDayByYearMonth(cYear, cMonth, cDayGanZhi);
    //alert('cDay111=='+cDay);
    /*
    if (cDay > num) {
        cDay = cDay - num;
        cMonth = cMonth + 1;
    }
    if (cMonth > 12) {
        cMonth = cMonth - 12;
        cYear = cYear + 1;
    }
    */

    //找时辰
    var cTime = getTimeByYearMonthDay(cYear, cMonth, cDay, cShiGanZhi);
    //alert('cTime111=='+cTime);
    var metime = cYear + "-" + getzf(cMonth) + "-" + getzf(cDay) + " " + getzf(cTime) + ":" + getzf(30) + ":00";

    return metime;


}


//根据用户选择的信息,返回起局上部各时间信息
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
function getTitleTimeList(mytime, dateType, pptype) {

    //处理传入的时间为阳历 or 阴历
    var metime;
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    //起局title部份时间信息
    var timeListArr = new Array(4);

    if (pptype == 'shijianpan') {
        //取得格式化后的阳历时间
        var yangLiTime = getYangLiTimeByMyTime(mytime);

        //取得格式化后的阴历时间
        var yinLiTime = getYinLiTimeByMyTime(mytime);

        //取得本阳历时间内的本月节气
        var currentJieQi = getCurrentJieQiByMyTime(mytime);

        //取得本阳历时间内的下一个月的节气
        var nextJieQi = getNextJieQiByMyTime(mytime);


        timeListArr['TimeOne'] = '时空:' + yinLiTime;
        timeListArr['TimeTwo'] = '阳历:' + yangLiTime;
        timeListArr['TimeThree'] = currentJieQi + ';' + nextJieQi;
        timeListArr['TimeFour'] = '';

        return timeListArr;
    }
    if (pptype == 'minglipan') {
        //取得格式化后的阳历时间(选择的时间)
        var bornYangLiTime = getYangLiTimeByMyTime(mytime);
        //取得格式化后的阴历时间(选择的时间)
        var bornYinLiTime = getYinLiTimeByMyTime(mytime);

        //取得本阳历时间内的本月节气(选择的时间)
        var bornCurrentJieQi = getCurrentJieQiByMyTime(mytime);

        //取得本阳历时间内的下一个月的节气(选择的时间)
        var bornNextJieQi = getNextJieQiByMyTime(mytime);

        //当前时间
        var metime = getMyTimeCurrentTime();
        //取得格式化后的阳历时间(当前时间)
        var yangLiTime = getYangLiTimeByMyTime(mytime);

        //取得格式化后的阴历时间(当前时间)
        var yinLiTime = getYinLiTimeByMyTime(mytime);

        //取得本阳历时间内的本月节气(当前时间)
        var currentJieQi = getCurrentJieQiByMyTime(mytime);

        //取得本阳历时间内的下一个月的节气(当前时间)
        var nextJieQi = getNextJieQiByMyTime(mytime);

        timeListArr['TimeOne'] = "出生:" + bornYinLiTime + ";" + bornYangLiTime;
        timeListArr['TimeTwo'] = bornCurrentJieQi + ";" + bornNextJieQi;
        timeListArr['TimeThree'] = "时空:" + yinLiTime + ";" + yangLiTime;
        timeListArr['TimeFour'] = currentJieQi + ";" + nextJieQi;

        return timeListArr;

    }

}

//根据用户选择的信息,返回起局地支十二宫信息
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
//state 用户是否显示时空盘的五柱(只有命理排盘才有效)
//无论是时空盘还是命理盘,都是以选定的时间排十二宫
function getDiZhiGongList(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    if (pptype == 'shijianpan') {
        //2:设置八字,与本时间内的年,月,日,时,刻干支
        var selectTimeBaZi = getTimesGanZhiByTime(mytime);

        //3:根据八字找到命运宫
        //<1>先找到命宫,设置命宫字体颜色
        var shisergongList = getShiErGongBySelectTime(mytime, selectTimeBaZi);
    }

    if (pptype == 'minglipan') {
        //2:设置八字,与本时间内的年,月,日,时干支
        //var selectTimeBaZi = getTimesGanZhiByMingLiTime(mytime);
        var selectTimeBaZi = getTimesBaZiGanZhiByTime(mytime);
        //3:根据八字找到命运宫
        //<1>先找到命宫,设置命宫字体颜色
        //setMingGongMinLiPanStyle(selectTimeBaZi);
        //var shisergongList = getShiErGongBySelectMingLiTime(mytime, selectTimeBaZi);
        var shisergongList = getShiErGongBySelectMingLiTimeTwo(mytime, selectTimeBaZi);
    }

    /*
     for(var key in shisergongList){
     console.log(  key+"==="+shisergongList[key]  );
     }
     */

    return shisergongList;
}

//根据用户选择的信息,返回地十二宫的字体颜色
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
//state 用户是否显示时空盘的五柱(只有命理排盘才有效)
//时空盘显示五柱,命理盘根据选项设置来显示与不显示时空的五柱
function getMingGongMinLiPanStyle(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    //2:设置八字,与本时间内的年,月,日,时,刻干支
    var selectTimeBaZi = getTimesGanZhiByTime(mytime);

    var styleList;
    //时间盘只有五柱信息
    if (pptype == 'shijianpan') {
        styleList = getShiErGongByTimeByTip(mytime, selectTimeBaZi);
    }

    if (pptype == 'minglipan') {
        var selectTimeBaZi = getTimesGanZhiByMingLiTime(mytime);
        styleList = getMingGongMinLiPanFontStyle(mytime, selectTimeBaZi);
    }

    return styleList;
}

//根据用户选择的信息,返回后天9星所有宫位
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
//state 用户是否显示时空盘的五柱(只有命理排盘才有效)
//时空盘显示五柱,命理盘根据选项设置来显示与不显示时空的五柱
function getHtNineStart(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    //2:设置八字,与本时间内的年,月,日,时,刻干支
    var selectTimeBaZi = getTimesGanZhiByTime(mytime);
    var nineStartList;

    if (pptype == 'shijianpan') {
        //1:获取九星开始位置
        var myArray = selectTimeBaZi.split(",");
        var gan;
        var kgan = myArray[4].substr(myArray[4], 1);
        var posStart = getNineStartByGan(kgan);
        //2:按顺序飞九星
        var nineStartList = getRedNineStartInfo(posStart);
    } else if (pptype == 'minglipan') {
        if (state) {
            var metime = getMyTimeCurrentTime();
            var selectTimeBaZi = getTimesGanZhiByTime(metime);
            //1:获取九星开始位置
            var myArray = selectTimeBaZi.split(",");
            var gan;
            var kgan = myArray[4].substr(myArray[4], 1);
            var posStart = getNineStartByGan(kgan);
            //2:按顺序飞九星
            var nineStartList = getRedNineStartInfo(posStart);
        } else {
            //返回空值(黑九星必须返回)
            var nineHtStart = getTianPanHouTianJiuXingArray();
            //格式化九星
            var nineStartList = new Array();

            //初始化后天红九星都为空
            for (i = 1; i < nineHtStart.length; i++) {
                nineStartList[nineHtStart[i]] = '';
            }
        }
    } else {
        //返回空值(黑九星必须返回)
        var nineHtStart = getTianPanHouTianJiuXingArray();
        //格式化九星
        var nineStartList = new Array();

        //初始化后天红九星都为空
        for (i = 1; i < nineHtStart.length; i++) {
            nineStartList[nineHtStart[i]] = '';
        }
    }

    return nineStartList;
}

//根据用户选择的信息,返回先天9星所有宫位
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
//state 用户是否显示时空盘的五柱(只有命理排盘才有效)
//时空盘显示五柱,命理盘根据选项设置来显示与不显示时空的五柱
function getXtNineStart(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    //2:设置八字,与本时间内的年,月,日,时干支
    var selectTimeBaZi = getTimesGanZhiByMingLiTime(mytime);

    var nineStartList;

    if (pptype == 'minglipan') {
        //1:获取九星开始位置
        selectTimeBaZi = getTimesBaZiGanZhiByTime(mytime);
        var myArray = selectTimeBaZi.split(",");
        var gan;
        var kgan = myArray[3].substr(myArray[3], 1);
        var posStart = getNineStartByGan(kgan);
        //2:按顺序飞九星
        nineStartList = getBlackNineStartInfo(posStart);
    } else {
        //返回空值(黑九星必须返回)
        var nineXtStart = getTianPanXianTianJiuXingArray();

        //格式化九星
        var nineStartList = new Array();
        //初始化后天黑九星都为空
        for (i = 1; i < nineXtStart.length; i++) {
            nineStartList[nineXtStart[i]] = '';
        }

    }

    /*
     for(var key in nineStartList){
     console.log( '先天星:'+ key+"==="+nineStartList[key]);
     }
     */

    return nineStartList;
}

//根据用户选择的信息,返回八神所有宫位
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
function getBaShenList(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    var baShenList;

    //时间盘只有五柱信息
    if (pptype == 'shijianpan') {
        //2:设置八字,与本时间内的年,月,日,时,刻干支
        var selectTimeBaZi = getTimesGanZhiByTime(mytime);
        baShenList = getBaShenInfo(mytime, selectTimeBaZi);
    }

    //如果命理盘就是四柱信息
    if (pptype == 'minglipan') {
        //2:设置八字,与本时间内的年,月,日,时干支
        var selectTimeBaZi = getTimesGanZhiByMingLiTime(mytime);
        baShenList = getBaShenInfo(mytime, selectTimeBaZi);
    }

    return baShenList;
}


//设置八神
function getBaShenInfo(mytime, baZi) {

    var myArray = baZi.split(",");

    var gan;
    var rgan = myArray[2].substr(myArray[2], 1);

    var startPost = getBaShenPost(mytime, rgan);

    //八神数组
    var baShenArr = getBaShenArray();
    var initBaShenArr = initBaShen();
    var len = initBaShenArr.length;


    //格式化九星
    var baShenList = new Array(8);

    var i, st = parseInt(startPost);
    //先走第一断
    for (i = st, j = 1; i <= 8; i++, j++) {
        //$("#"+baShenArr[i]).text(initBaShenArr[j]);
        baShenList[baShenArr[i]] = initBaShenArr[j];
    }

    //八神第二轮开始位置
    var twoStart = j;
    for (i = 1, j = twoStart; i < startPost; i++, j++) {
        //$("#"+baShenArr[i]).text(initBaShenArr[j]);
        baShenList[baShenArr[i]] = initBaShenArr[j];
    }

    /*
     for(var key in baShenList){
     console.log(  key+"==="+baShenList[key]);
     }
     */
    return baShenList;
}

//设置红色的九星位置并显示
function getRedNineStartInfo(startPost) {
    var nineHtStart = getTianPanHouTianJiuXingArray();
    var initNineStart = initJiuXing();
    var len = nineHtStart.length;

    var i, st = parseInt(startPost);
    //格式化九星
    var nineStartList = new Array();

    //初始化后天红九星都为空
    for (i = 1; i < nineHtStart.length; i++) {
        nineStartList[nineHtStart[i]] = '';
    }

    //先走第一断
    for (i = st, j = 1; i <= 9; i++, j++) {
        //$("#"+nineStart[i]).text(initNineStart[j]);
        nineStartList[nineHtStart[i]] = initNineStart[j];
    }

    //九星第二轮开始位置
    var twoStart = j;

    for (i = 1, j = twoStart; i < startPost; i++, j++) {
        nineStartList[nineHtStart[i]] = initNineStart[j];
    }

    return nineStartList;
}

//设置黑色的九星位置并显示
function getBlackNineStartInfo(startPost) {
    //var nineHtStart = getTianPanHouTianJiuXingArray();
    var nineXtStart = getTianPanXianTianJiuXingArray();
    var initNineStart = initJiuXing();
    var len = nineXtStart.length;

    var i, st = parseInt(startPost);

    //格式化九星
    var nineStartList = new Array();

    //初始化后天黑九星都为空
    for (i = 1; i < nineXtStart.length; i++) {
        nineStartList[nineXtStart[i]] = '';
    }

    //先走第一断
    for (i = st, j = 1; i <= 9; i++, j++) {
        //$("#"+nineStart[i]).text(initNineStart[j]);
        nineStartList[nineXtStart[i]] = initNineStart[j];
    }

    //九星第二轮开始位置
    var twoStart = j;

    for (i = 1, j = twoStart; i < startPost; i++, j++) {
        nineStartList[nineXtStart[i]] = initNineStart[j];
    }

    return nineStartList;
}

//通过天干找到九星的开始位置
function getNineStartByGan(kgan) {
    //获取九星所有位置
    var nineStart = initNineStartGanZhi();
    //获取甲干所在位置
    var jiaStart = initNineStartGanZhiJia();
    var j = 0;

    for (var i = 1; i <= nineStart.length; i++) {
        if (nineStart[i] == kgan) {
            j = i;
            break;
        }
    }

    if (j == 0) {
        for (var i = 1; i <= jiaStart.length; i++) {
            if (jiaStart[i] == kgan) {
                j = i;
                break;
            }
        }
    }

    return j;
}


//获取步长的函数
function getShiErGongByTimeByTip(mytime, baZi) {
    //找到指定时间的年,月,日信息
    var timeMonthDayTip = getDateTimeTipByTime(mytime);

    var timeShiKeTip = getShiKeTipByTime(mytime);

    var tM = timeMonthDayTip.split(",");
    var tD = timeShiKeTip.split(",");

    //月的偏移量
    var monthTip = tM[0];
    //日的偏移量
    var dayTip = tM[1];
    //时的偏移量
    var shiTip = tD[0];
    //刻的偏移量
    var keTip = tD[1];

    var totalTip = parseInt(monthTip) + parseInt(dayTip) + parseInt(shiTip) + parseInt(keTip);
    var totalMingTip = parseInt(monthTip) + parseInt(dayTip) + parseInt(shiTip);

    //设置命宫字体的颜色
    var styleList = getMingGongTimeStyle(totalMingTip);

    return styleList;
}


//通过八字找到年支,设置命理盘的命宫
function getMingGongMinLiPanFontStyle(mytime, baZi) {
    var baziArr = baZi.split(",");
    var nianZhi = baziArr[0][1];

    var diZhiArr = initDiZhi();
    var dizhiNum = getIntNumByDiZhiArrayValue(diZhiArr, nianZhi);

    var dizhiList = getRenPanStyleArray();

    //$("#"+dizhiList[dizhiNum]).css("color","#46aed3");

    var dizhiStyleList = new Array(12);
    //alert('命里盘设置');
    for (var i = 1; i < dizhiList.length; i++) {
        dizhiStyleList[dizhiList[i]] = '#f00';//styleList[dizhiList[i]];
    }

    dizhiStyleList[dizhiList[dizhiNum]] = '#46aed3';

    return dizhiStyleList;
}


//修改命宫的字体颜色
function getMingGongTimeStyle(totalMingTip) {
    //八卦宫对应地支从0开始,所以向后移位一个
    var baGua = initBaGua();

    var start = 1;
    //减去日,时,刻,三个重复的位置
    var tTip = totalMingTip - 2;

    var sta = tTip % 8;

    if (sta == 0) {
        start = 8;
    } else {
        start = tTip % 8;
    }

    //找到第start个宫位的地支
    var gongList = initBaGuaDiZhi();
    var gaIndex = start - 1;
    if (gaIndex < 0) {
        gaIndex = 8;
    }

    var dizhiNum = gongList[gaIndex].toString();
    var dizhiList = getRenPanStyleArray();
    var lenArr = dizhiNum.split(",");

    //初始化所有字体颜色
    var styleList = getInitRenPanStyleArray();
    var dizhiStyleList = new Array(12);

    for (var i = 1; i < dizhiList.length; i++) {
        dizhiStyleList[dizhiList[i]] = '#f00';//styleList[dizhiList[i]];
    }

    var len = lenArr.length;
    for (var i = 0; i < len; i++) {
        dizhiStyleList[dizhiList[lenArr[i]]] = '#46aed3';
    }

    /*
     for(var key in dizhiStyleList){
     console.log(  key+"==="+dizhiStyleList[key]);
     }
     */

    return dizhiStyleList;

}


//根据用户选择的信息,返回把有八字信息
//mytime用户选择的时间
//dateType阴阳历信息(0:阳历 1:阴历)
//pptype时间起局，命里起局(shijianpan:时间盘,minglipan:命理盘)
//时空盘显示五柱,命理盘根据选项设置来显示与不显示时空的五柱
function getBaZiList(mytime, dateType, pptype, state) {
    //处理传入的时间为阳历 or 阴历
    //统一换成阳历
    if (dateType == 1) {
        mytime = getMyTimeYinLiToYangli(mytime);
        mytime= new Date(Date.parse(mytime.replace(/-/g,  "/")));
    }

    //2:设置八字,与本时间内的年,月,日,时,刻干支
    var selectTimeBaZi = getTimesGanZhiByTime(mytime);

    //<2>当前时间的八字
    var metime = getMyTimeCurrentTime();
    var currentTimeBaZi = getTimesGanZhiByTime(metime);

    var baziListArr = Array(4);
    baziListArr['mingligan'] = '';
    baziListArr['minglizhi'] = '';
    baziListArr['shikonggan'] = '';
    baziListArr['shikongzhi'] = '';

    //时间盘只有五柱信息
    if (pptype == 'shijianpan') {
        //处理selectTimeBaZi

        //获取五柱信息
        if (selectTimeBaZi != '') {
            var strs = selectTimeBaZi.split(",");
            var shikonggan = '';
            var shikongzhi = '';
            for (i = 0; i < strs.length; i++) {
                var ganzhi = strs[i];
                var gan = ganzhi.substring(0, 1);
                var zhi = ganzhi.substring(1, 2);
                shikonggan = shikonggan + gan + " ";
                shikongzhi = shikongzhi + zhi + " ";

            }
            //alert('干='+shikonggan+"  支="+shikongzhi);
            baziListArr['shikonggan'] = shikonggan;
            baziListArr['shikongzhi'] = shikongzhi;
        }

    }
    if (pptype == 'minglipan') {
        //命里盘要带着五柱时空信息
        if (state) {
            //处理selectTimeBaZi,currentTimeBaZi
            selectTimeBaZi = getTimesBaZiGanZhiByTime(mytime);
            //获取四柱信息(用户选择的时间)
            if (selectTimeBaZi != '') {
                var strs = selectTimeBaZi.split(",");
                var mingligan = '';
                var minglizhi = '';
                for (i = 0; i < strs.length; i++) {
                    var ganzhi = strs[i];
                    var gan = ganzhi.substring(0, 1);
                    var zhi = ganzhi.substring(1, 2);
                    mingligan = mingligan + gan + " ";
                    minglizhi = minglizhi + zhi + " ";

                }
                //alert('干='+shikonggan+"  支="+shikongzhi);
                baziListArr['mingligan'] = mingligan;
                baziListArr['minglizhi'] = minglizhi;
            }
            //获取五柱信息(当前时间)
            if (currentTimeBaZi != '') {
                var strs = currentTimeBaZi.split(",");
                var shikonggan = '';
                var shikongzhi = '';
                for (i = 0; i < strs.length; i++) {
                    var ganzhi = strs[i];
                    var gan = ganzhi.substring(0, 1);
                    var zhi = ganzhi.substring(1, 2);
                    shikonggan = shikonggan + gan + " ";
                    shikongzhi = shikongzhi + zhi + " ";

                }
                //alert('干='+shikonggan+"  支="+shikongzhi);
                baziListArr['shikonggan'] = shikonggan;
                baziListArr['shikongzhi'] = shikongzhi;
            }

        } else {
            //获取四柱信息(用户选择的时间)
            selectTimeBaZi = getTimesBaZiGanZhiByTime(mytime);
            //alert('selectTimeBaZi=='+selectTimeBaZi);
            //处理currentTimeBaZi
            if (selectTimeBaZi != '') {
                var strs = selectTimeBaZi.split(",");
                var mingligan = '';
                var minglizhi = '';
                for (i = 0; i < strs.length; i++) {
                    var ganzhi = strs[i];
                    var gan = ganzhi.substring(0, 1);
                    var zhi = ganzhi.substring(1, 2);
                    mingligan = mingligan + gan + " ";
                    minglizhi = minglizhi + zhi + " ";

                }
                //alert('干='+shikonggan+"  支="+shikongzhi);
                baziListArr['mingligan'] = mingligan;
                baziListArr['minglizhi'] = minglizhi;
            }
        }
    }

    return baziListArr;

}

//设置指定时间的干支
//格式: 丁 戊 壬 丙 己
//      酉 申 辰 午 丑
//默认取出八字,刻的干支要自己计算
function getTimesGanZhiByTime(mytime) {
    //alert("----------------->1==="+mytime);
    var mytime = parserDate(mytime);
    //alert("----------------->2==="+mytime);
    var metime = dualNowTimeRealTime(mytime);

    //var myRealTime = parserDate(metime);
    //var myRealTime = new Date(metime);
    var myRealTime = new Date(Date.parse(metime.replace(/-/g, "/")));
    //alert("metime=="+metime+"   myRealTime=="+myRealTime);

    var ob = new Object();

    var year = year2Ayear(myRealTime.getFullYear());
    var month = myRealTime.getMonth() + 1;
    if (month > 12) {
        year = year2Ayear(myRealTime.getFullYear() + 1);
        month = 1;
    }
    var day = myRealTime.getDate();
    var hour = myRealTime.getHours();
    var minute = myRealTime.getMinutes();
    var second = myRealTime.getSeconds();

    var myBaZiMin = mytime.getMinutes();
    var myBaZiHour = mytime.getHours();

    var cml_his = hour + ":" + minute + ":" + second;
    var times = year + ":" + month + ":" + day + " " + cml_his;
    //alert("times==="+times);
    //alert("myBaZiMin==="+myBaZiMin);
    var t = timeStr2hour(cml_his);
    var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

    var now = myRealTime;//new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

    var cp11_j = -116.383333;
    obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算
    //alert("11--->ob===>"+JSON.stringify(ob));
    //alert("ob.bz_js="+ob.bz_js+"   myBaZiHour="+myBaZiHour+"   myBaZiMin="+myBaZiMin);
    var keGanZhi = getKeGanZhiByTime(ob.bz_js, myBaZiHour, myBaZiMin);

    var bazi = ob.bz_jn + ',' + ob.bz_jy + ',' + ob.bz_jr + ',' + ob.bz_js + ',' + keGanZhi;

    return bazi;
}

//设置指定时间的干支
//格式: 丁 戊 壬 丙
//      酉 申 辰 午
//默认取出八字,刻的干支要自己计算
function getTimesBaZiGanZhiByTime(mytime) {
    //alert("----------------->1==="+mytime);
    var mytime = parserDate(mytime);
    //alert("----------------->2==="+mytime);
    var metime = dualNowTimeRealTime(mytime);

    //var myRealTime = parserDate(metime);
    //var myRealTime = new Date(metime);
    var myRealTime = new Date(Date.parse(metime.replace(/-/g, "/")));
    //alert("metime=="+metime+"   myRealTime=="+myRealTime);

    var ob = new Object();

    var year = year2Ayear(myRealTime.getFullYear());
    var month = myRealTime.getMonth() + 1;
    if (month > 12) {
        year = year2Ayear(myRealTime.getFullYear() + 1);
        month = 1;
    }
    var day = myRealTime.getDate();
    var hour = myRealTime.getHours();
    var minute = myRealTime.getMinutes();
    var second = myRealTime.getSeconds();

    var myBaZiMin = mytime.getMinutes();
    var myBaZiHour = mytime.getHours();
    //alert('hour====='+hour);
    if(hour%2 != 0){
        hour = hour +1;
    }
    //alert('hour=111===='+hour);

    //return;

    var cml_his = hour + ":" + minute + ":" + second;
    var times = year + ":" + month + ":" + day + " " + cml_his;
    //alert("times==="+times);
    //alert("times==="+times);
    var t = timeStr2hour(cml_his);
    var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

    var now = myRealTime;//new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

    var cp11_j = -116.383333;
    obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算


    var bazi = ob.bz_jn + ',' + ob.bz_jy + ',' + ob.bz_jr + ',' + ob.bz_js;

    return bazi;
}


//设置指定时间的干支
//格式: 丁 戊 壬 丙 己
//      酉 申 辰 午 丑
//默认取出八字,刻的干支要自己计算
function getTimesGanZhiByMingLiTime(mytime) {
    //alert("----------------->1==="+mytime);
    var mytime = parserDate(mytime);
    //alert("----------------->2==="+mytime);
    var metime = dualNowTimeRealTime(mytime);

    //var myRealTime = parserDate(metime);
    //var myRealTime = new Date(metime);
    var myRealTime = new Date(Date.parse(metime.replace(/-/g, "/")));
    //alert("metime=="+metime+"   myRealTime=="+myRealTime);

    var ob = new Object();

    var year = year2Ayear(myRealTime.getFullYear());
    var month = myRealTime.getMonth() + 1;
    if (month > 12) {
        year = year2Ayear(myRealTime.getFullYear() + 1);
        month = 1;
    }
    var day = myRealTime.getDate();
    var hour = myRealTime.getHours();
    var minute = myRealTime.getMinutes();
    var second = myRealTime.getSeconds();

    var myBaZiMin = mytime.getMinutes();
    var myBaZiHour = mytime.getHours();

    var cml_his = hour + ":" + minute + ":" + second;
    var times = year + ":" + month + ":" + day + " " + cml_his;
    //alert("times==="+times);
    //alert("myBaZiMin==="+myBaZiMin);
    var t = timeStr2hour(cml_his);
    var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

    var now = myRealTime;//new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

    var cp11_j = -116.383333;
    obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算
    //alert("11--->ob===>"+JSON.stringify(ob));
    //alert("ob.bz_js="+ob.bz_js+"   myBaZiHour="+myBaZiHour+"   myBaZiMin="+myBaZiMin);
    //var keGanZhi = getKeGanZhiByTime(ob.bz_js,myBaZiHour,myBaZiMin);

    var bazi = ob.bz_jn + ',' + ob.bz_jy + ',' + ob.bz_jr + ',' + ob.bz_js;

    return bazi;
}

//根据指定的时间,设置十二宫信息
function getShiErGongBySelectMingLiTime(mytime, selectTimeBaZi) {
    //找到指定时间的年,月,日信息
    var timeMonthDayTip = getDateTimeTipByTime(mytime);

    var timeShiKeTip = getShiKeTipByTime(mytime);

    var tM = timeMonthDayTip.split(",");
    var tD = timeShiKeTip.split(",");

    //月的偏移量
    var monthTip = tM[0];
    //日的偏移量
    //var dayTip = tM[1];
    //时的偏移量
    var shiTip = tD[0];
    //刻的偏移量
    //var keTip = tD[1];

    //顺序数月,从月上逆向起时
    var totalTip = parseInt(monthTip) - parseInt(shiTip) + 1;

    var startDiZhi;

    if (totalTip > 0) {
        startDiZhi = totalTip;
    } else {
        startDiZhi = 12 + totalTip;
    }

    var newDiZhiArr = getDiZhiToLabel();
    startDiZhi = newDiZhiArr[startDiZhi];

    //设置地支十二宫的信息(完成)
    var serErGongList = getShiErGongInfoListByStart(startDiZhi);

    return serErGongList;
}


//根据指定的时间,设置十二宫信息
function getShiErGongBySelectMingLiTimeTwo(mytime, selectTimeBaZi) {


    var mytime = parserDate(mytime);
    //alert("----------------->2==="+mytime);
    var metime = dualNowTimeRealTime(mytime);

    //var myRealTime = parserDate(metime);
    //var myRealTime = new Date(metime);
    var myRealTime = new Date(Date.parse(metime.replace(/-/g, "/")));
    //alert("metime=="+metime+"   myRealTime=="+myRealTime);

    var ob = new Object();

    var year = year2Ayear(myRealTime.getFullYear());
    var month = myRealTime.getMonth() + 1;
    if (month > 12) {
        year = year2Ayear(myRealTime.getFullYear() + 1);
        month = 1;
    }
    var day = myRealTime.getDate();
    var hour = myRealTime.getHours();
    var minute = myRealTime.getMinutes();
    var second = myRealTime.getSeconds();

    var myBaZiMin = mytime.getMinutes();
    var myBaZiHour = mytime.getHours();
    //alert('hour====='+hour);
    if(hour%2 != 0){
        hour = hour +1;
    }


    var cml_his = hour + ":" + minute + ":" + second;
    var times = year + "-" + month + "-" + day + " " + cml_his;

    //var mytime = new Date(Date.parse(times.replace(/-/g, "/")));

    var mytime = new Date(Date.parse(times.replace(/-/g,  "/")));


    //找到指定时间的年,月,日信息
    var timeMonthDayTip = getDateTimeTipByTime(mytime);

    var timeShiKeTip = getShiKeTipByTime(mytime);

    var tM = timeMonthDayTip.split(",");
    var tD = timeShiKeTip.split(",");

    //月的偏移量
    var monthTip = tM[0];
    //日的偏移量
    //var dayTip = tM[1];
    //时的偏移量
    var shiTip = tD[0];
    //刻的偏移量
    //var keTip = tD[1];

    //顺序数月,从月上逆向起时
    var totalTip = parseInt(monthTip) - parseInt(shiTip) + 1;

    var startDiZhi;

    if (totalTip > 0) {
        startDiZhi = totalTip;
    } else {
        startDiZhi = 12 + totalTip;
    }

    var newDiZhiArr = getDiZhiToLabel();
    startDiZhi = newDiZhiArr[startDiZhi];

    //设置地支十二宫的信息(完成)
    var serErGongList = getShiErGongInfoListByStart(startDiZhi);

    return serErGongList;
}

//根据指定的时间,设置十二宫信息
function getShiErGongBySelectTime(mytime, selectTimeBaZi) {

    //找到指定时间的年,月,日信息
    var timeMonthDayTip = getDateTimeTipByTime(mytime);
    //alert('mytime=='+mytime);
    //return;
    var timeShiKeTip = getShiKeTipByTime(mytime);

    var tM = timeMonthDayTip.split(",");
    var tD = timeShiKeTip.split(",");

    //月的偏移量
    var monthTip = tM[0];
    //日的偏移量
    var dayTip = tM[1];
    //时的偏移量
    var shiTip = tD[0];
    //刻的偏移量
    var keTip = tD[1];

    var totalTip = parseInt(monthTip) + parseInt(dayTip) + parseInt(shiTip) + parseInt(keTip);
    var totalMingTip = parseInt(monthTip) + parseInt(dayTip) + parseInt(shiTip);

    //设置命宫字体的颜色
    //TODO
    //setMingGongTimeStyle(totalMingTip);


    //找到十二宫的入口(对应八卦数字)
    //1:坎 2:艮 ......
    var startGong = findGongStartByTip(totalTip);

    var sta = getYinYangKeZhi(selectTimeBaZi);

    //找到对应的12地支入口(对应地支数字)
    //1:子 2:丑 3:寅......
    //起始位置都对
    var startDiZhi = findDiZhiStartByTip(startGong, parseInt(keTip), sta);

    //设置地支十二宫的信息(完成)
    //TODO::这里要返回了
    var serErGongList = getShiErGongInfoListByStart(startDiZhi);

    return serErGongList;
}


//通过时间获取时,刻值
function getShiKeTipByTime(mytime) {
    var txtArr = getTimesGanZhiByTime(mytime);

    var diZhi = initDiZhi();
    var txtArrs = txtArr.split(",");
    var txtDtxt = txtArrs[3].substr(1, 1);
    var txtKtxt = txtArrs[4].substr(1, 1);

    var dTip = getIntNumByDiZhiArrayValue(diZhi, txtDtxt);
    var kTip = getIntNumByDiZhiArrayValue(diZhi, txtKtxt);

    var cTip = dTip + "," + kTip;

    return cTip;
}


//通过找到的地支入口,逆排12宫
function getShiErGongInfoListByStart(startDiZhi) {
    //十二宫列表
    var gongList = initRenPanGong();
    //十二宫位置信息
    var gongLocationList = getRenPanGongArray();
    //地支后断长
    var twoDiZhiLen = 12 - parseInt(startDiZhi);
    //十二宫二断长
    var twoGongLen = 12 - parseInt(startDiZhi);

    var i, st = parseInt(startDiZhi);
    var shiErGongList = new Array(12);

    //先走第一断
    for (i = st, j = 1; i >= 1; i--, j++) {
        //$("#"+gongLocationList[i]).text(gongList[j]);
        shiErGongList[gongLocationList[i]] = gongList[j];
    }
    //十二宫第二轮开始位置
    var twoStart = parseInt(startDiZhi) + 1;


    //TODO::这里返回
    for (i = 12, j = twoStart; i > startDiZhi; i--, j++) {
        //$("#"+gongLocationList[i]).text(gongList[j]);
        shiErGongList[gongLocationList[i]] = gongList[j];
    }
    /*
     for(var i=0;i<shiErGongList.length;i++){
     document.writeln(shiErGongList[i]);
     }

     for(var key in shiErGongList){
     document.write(key+"==="+shiErGongList[key] );
     }
     */

    return shiErGongList;
}


//根据指定时间找到年,月,日信息
function getDateTimeTipByTime(mytime) {

    var mydate = new Date(mytime);
    //var mydate = mytime;
    //var mydate = mytime.replace(/-/g,"/");
    //alert('mytime='+mytime+'   mydate='+mydate.getFullYear());
    //return;
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    var day = mydate.getDay();
    var hours = mydate.getHours();
    var times = year + ":" + month + ":" + day + " " + hours;

    times = times.replace(/-/g, "/");

    //取当前年份(2017)
    var By = year2Ayear(mydate.getFullYear());
    //取当前月份(9)
    var Bm = mydate.getMonth() + 1;
    //取当前小时
    var nowHour = mydate.getHours();
    //取当前分钟
    var nowMinutes = mydate.getMinutes();
    //取当前秒
    var nowSeconds = mydate.getSeconds();

    var now = new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时
    curJD = now / 86400000 - 10957.5 - curTZ / 24; //J2000起算的儒略日数(当前本地时间)
    curJD = int2(curJD + 0.5);
    if (By == -10000) return;

    if (!lun.dn || lun.y != By || lun.m != Bm) {  //月历未计算
        lun.yueLiHTML(By, Bm, curJD);
    }
    var n = mydate.getDate();
    n = n - 1;

    var ob = lun.lun[n];
    //日的偏移量0=初一,1=初二
    var dayTip = ob.Ldi + 1;

    var monthTip = getChangeZhongWenToNum(ob.Lmc);

    var monthDayTip = monthTip + "," + dayTip;

    return monthDayTip;

}

//获取当前时间
function getMyTimeCurrentTime() {

    var mytime = new Date();
    return mytime;

}

//获取用户选择的阴历时间
function getMyTimeYinLiToYangli(mytime) {
    //alert('33333='+mytime);
    var mtime = parserDate(mytime);
    var oDate = new Date(mtime);
    //alert('44444='+mtime);
    var sY = oDate.getFullYear();
    var sM = oDate.getMonth() + 1;
    var sD = oDate.getDate();
    var sH = oDate.getHours();
    var sMin = oDate.getMinutes();

    var yTime = calendar.lunar2solar(sY, sM, sD);

    var cYear = yTime.cYear;
    var cMonth = yTime.cMonth;
    var cDay = yTime.cDay;


    var metime = cYear + "-" + cMonth + "-" + cDay + " " + sH + ":" + sMin + ":00";
    //add zhanghao
    //metime = parserDate(metime);

    return metime;
}


//根据宫位找到地支,由刻阴阳决定地支的阴阳
function findDiZhiStartByTip(startGong, keTip, sta) {
    var kTip = keTip;
    //八卦宫对应地支从0开始,所以向后移位一个
    var startGong = startGong - 1;

    var cDiZhi;
    var baGuaDiZhi = initBaGuaDiZhi();

    var txt = baGuaDiZhi[startGong].toString();

    var lenArr = txt.split(",");
    var len = lenArr.length;

    if (len == 1) {
        cDiZhi = lenArr[0];
    } else {
        if (sta == "yin") {
            cDiZhi = lenArr[0];
        } else {
            cDiZhi = lenArr[1];
        }
    }

    return cDiZhi;
}


//格式化指定时间(阳历)
//返回指定时间的阳历时间
//格式:1981年07月26日6:30分
function getYangLiTimeByMyTime(mytime) {
    //格式化完要返回的时间
    var myRTime;
    var mtime = parserDate(mytime);
    //var mtime = new Date(mytime).getTime();
    var oDate = new Date(mtime);
    //alert("mtime="+mtime+"  oDate="+oDate);
    var myRTimeY = oDate.getFullYear();
    var myRTimeM = oDate.getMonth() + 1;
    var myRTimeD = oDate.getDate();
    var myRTimeH = oDate.getHours();
    var myRTimeMi = oDate.getMinutes();

    //myRTime = myRTimeY +'年'+ getzf(myRTimeM) +'月'+ getzf(myRTimeD) +'日'+ getzf(myRTimeH) +':'+ getzf(myRTimeMi) +'分';//最后拼接时间
    myRTime = myRTimeY + '年' + getzf(myRTimeM) + '月' + getzf(myRTimeD) + '日' + getzf(myRTimeH) + ':' + getzf(myRTimeMi);//最后拼接时间

    return myRTime;

}

//格式化指定时间(阴历)
//返回指定时间的阴历时间
//格式:农历1981年六月26日6:30分
function getYinLiTimeByMyTime(mytime) {

    //格式化完要返回的时间
    var myRTime;

    var mytime = parserDate(mytime);
    //取当前年份(2017)
    var By = year2Ayear(mytime.getFullYear());
    //取当前月份(9)
    var Bm = mytime.getMonth() + 1;
    //取当前日子
    var Bd = mytime.getDate();
    //取当前小时
    var nowHour = mytime.getHours();
    //取当前分钟
    var nowMinutes = mytime.getMinutes();
    //取当前秒
    var nowSeconds = mytime.getSeconds();

    var hours = getzf(nowHour) + ':' + getzf(nowMinutes);

    //alert("By="+By+" Bm="+Bm+"  Bd="+Bd+" nowHour="+nowHour+" nowMinutes="+nowMinutes+" nowSeconds="+nowSeconds);
    //阳历转阴历处理
    var mydate = new Date(By, Bm - 1, Bd);
    var now = new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时
    curJD = now / 86400000 - 10957.5 - curTZ / 24; //J2000起算的儒略日数(当前本地时间)
    curJD = int2(curJD + 0.5);
    if (By == -10000) return;

    if (!lun.dn || lun.y != By || lun.m != Bm) {  //月历未计算
        lun.yueLiHTML(By, Bm, curJD);
    }
    var n = mydate.getDate();
    n = n - 1;
    var ob = lun.lun[n];

    var myRTime = "农历" + ob.Lyear3 + '年 ' + ob.Lleap + ob.Lmc + '月' + getzf(ob.Ldc) + hours;

    return myRTime;
}

//获取指定时间的当月节气
function getCurrentJieQiByMyTime(mytime) {

    //格式化完要返回的时间
    var myRJieQi;

    var mytime = parserDate(mytime);
    //取当前年份(2017)
    var By = year2Ayear(mytime.getFullYear());
    //取当前月份(9)
    var Bm = mytime.getMonth() + 1;
    //取当前日子
    var Bd = mytime.getDate();
    //取当前小时
    var nowHour = mytime.getHours();
    //取当前分钟
    var nowMinutes = mytime.getMinutes();
    //取当前秒
    var nowSeconds = mytime.getSeconds();

    var now = new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时
    curJD = now / 86400000 - 10957.5 - curTZ / 24; //J2000起算的儒略日数(当前本地时间)
    curJD = int2(curJD + 0.5);
    if (By == -10000) return;
    var lun = new Lunar();
    if (!lun.dn || lun.y != By || lun.m != Bm) {  //月历未计算
        lun.yueLiHTML(By, Bm, curJD);
    }

    //格式10:08:05转成10时08分getzf
    var jieQiTime;
    var times = lun.cunrentJeiQiTime.split(":");
    //jieQiTime = getzf(times[0])+"时"+getzf(times[1])+"分";
    jieQiTime = times[0] + ":" + times[1];

    var myRJieQi = lun.cunrentJeiQiName + ":" + lun.cunrentJeiQiYear + "年";
    myRJieQi += lun.cunrentJeiQiMonth + "月" + lun.cunrentJeiQiDay + "日";

    myRJieQi += jieQiTime;

    return myRJieQi;
}

//获取指定时间的下一个月节气
function getNextJieQiByMyTime(mytime) {
    //格式化完要返回的时间
    var myRJieQi;

    var mytime = parserDate(mytime);
    //取当前年份(2017)
    var By = year2Ayear(mytime.getFullYear());
    //取当前月份(9)
    var tp = mytime.getMonth() + 2;
    if (tp > 12) {
        var Bm = tp - 12;
        var By = year2Ayear(mytime.getFullYear() + 1);
    } else {
        var Bm = tp;
        var By = year2Ayear(mytime.getFullYear());
    }

    //取当前日子
    var Bd = mytime.getDate();
    //取当前小时
    var nowHour = mytime.getHours();
    //取当前分钟
    var nowMinutes = mytime.getMinutes();
    //取当前秒
    var nowSeconds = mytime.getSeconds();

    //var hours = getzf(nowHour) +':'+ getzf(nowMinutes);

    var now = new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时
    curJD = now / 86400000 - 10957.5 - curTZ / 24; //J2000起算的儒略日数(当前本地时间)
    curJD = int2(curJD + 0.5);
    if (By == -10000) return;

    if (!lun.dn || lun.y != By || lun.m != Bm) {  //月历未计算
        lun.yueLiHTML(By, Bm, curJD);
    }

    //格式10:08:05转成10时08分
    var jieQiTime;
    var times = lun.cunrentJeiQiTime.split(":");
    //jieQiTime = getzf(times[0])+"时"+getzf(times[1])+"分";
    jieQiTime = getzf(parseInt(times[0])) + ":" + getzf(parseInt(times[1]));

    var myRJieQi = lun.cunrentJeiQiName + ":" + lun.cunrentJeiQiYear + "年";
    myRJieQi += lun.cunrentJeiQiMonth + "月" + lun.cunrentJeiQiDay + "日";
    //myRJieQi += lun.cunrentJeiQiTime;
    myRJieQi += jieQiTime;

    return myRJieQi;
}

//转成中国标准时间
function parserDate(myDate) {

    var t = Date.parse(myDate);
    var tt = new Date(myDate);

    var vt = getMyDate(myDate);
    var rDate;
    if (!isNaN(t)) {
        var d = vt.replace(/-/g, "/");
        var p = Date.parse(d);
        rDate = new Date(p);
    } else {

        rDate = new Date();
    }
    //alert("开始myDate="+myDate+"   t="+t+"  rDate="+rDate);
    return rDate;
}

function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间

    return oTime;
}

function getzf(num) {
    if (parseInt(num) < 10) {
        if (num != 0 || num != 00) {
            num = '0' + num;
        }
    }
    return num;
}

function getNum(num) {

    var cNum;
    var strlen = num.length;
    cNum = parseInt(num[0]) * 10 + parseInt(num[1]);
    //alert("num==="+num+"   cNum"+cNum);
    return parseInt(cNum);
}

//处理平太阳时和真太阳时的问题
function dualNowTimeRealTime(mytime) {
    var ob = new Object();
    var now = new Date(mytime);
    //alert("开始处理时间函数="+now);
    var year = year2Ayear(now.getFullYear());
    var month = now.getMonth() + 1;
    if (month > 12) {
        year = year2Ayear(now.getFullYear() + 1);
        month = 1;
    }
    var day = now.getDate();

    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    var cml_his = hour + ":" + minute + ":" + second;
    var times = year + ":" + month + ":" + day + " " + hour + ":" + minute + ":" + second;

    var t = timeStr2hour(cml_his);
    var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

    var mydate = new Date();
    curTZ = mydate.getTimezoneOffset() / 60; //时区 -8为北京时

    var cp11_j = -116.383333;
    obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算

    //2017-11-01 14:39:00 转成中国标准时间
    var zTaiYangShi = ob.bz_zty;

    var tpTime = ob.TestJD;
    var myTestDate = new Date(Date.parse(tpTime.replace(/-/g, "/")));

    var zRealTime = parserDate(myTestDate);

    var tpDate = parserDate(zRealTime);

    var realTime = new Date(zRealTime).getTime();


    var nowTime = new Date(now).getTime();

    var realTime = new Date(zRealTime).getTime();
    var nTime = new Date(now);

    var rTime = new Date(zRealTime);

    var jianGe = realTime - nowTime;
    //(1)如果jianGe>0就是当前时间小于真太阳时,用当前时间加相差的时间,
    //(1)此时真太阳时加上相隔时间为现在时间.
    if (jianGe > 0) {
        newNowTime = int2(nowTime - jianGe);
    } else {
        newNowTime = int2(nowTime - jianGe);
        //newNowTime = int2(nowTime + jianGe);
    }
    //var nnTime = new Date(newNowTime+66000);


    //alert("jianGe==="+Math.floor(jianGe + newNowTime));
    var nDate = getMyDate(newNowTime);
    //alert("设定的时间=="+nTime+"   设定的真太阳时间=="+rTime+"   相差毫秒数="+jianGe+"    newNowTime=="+nDate);

    return nDate;
    //alert("原来时间为="+nowTime+"       真太阳时为="+realTime);

}

//通过时的干支与时间,找到刻的干支
function getKeGanZhiByTime(js_gz, hour, mins) {
    var myhoures = 0;
    if (hour % 2 == 0) {
        myhoures = 1;
    }

    var totalmin = myhoures * 60 + mins;

    var tip = Math.floor(totalmin / 10) + 1;

    //alert("totalmin==="+totalmin+"     tip==="+tip);
    //从子时起,数 tip 个干支
    //设置好甲,丙,戊,庚,壬,这五个时干的子时的天干
    var myGanZhi = getMyGanZhi(js_gz, tip);

    return myGanZhi;
}

//指定干支日,通过地支与天干移动来取指定步长的干支
function getMyGanZhi(js_gz, tip) {
    var diZhi = initDiZhi();
    var tianGanArr = initTianGan();
    var cDiZhi = diZhi[tip];
    var cTianGan;
    //本时辰的天干
    var tian = js_gz.substr(js_gz, 1);
    //通过本时辰的天干,可以确定子时干天,从子时天干起,加上步长,为要找的刻的天干
    var ganTip = getIntNumByArrayValue(tianGanArr, tian);

    var initGan = initGanZhiStart();
    var ganStart = initGan[ganTip];

    var totalLen = ganStart + tip - 1;
//alert("ganTip=="+ganTip+"   ganStart=="+ganStart+"   totalLen=="+totalLen);
    var findTip = 1;
    //alert("totalLen=="+totalLen);
    if (totalLen > 10) {
        findTip = totalLen % 10;
        if (findTip == 0) {
            findTip = 10;
        }
    } else {
        findTip = totalLen;
    }
    //alert("findTip=="+findTip);
    cTianGan = tianGanArr[findTip];
    cDiZhi = diZhi[tip];
//alert("cDiZhi=="+cDiZhi);
    return cTianGan + cDiZhi;
}

//返回十二地支数据信息
function initDiZhi() {

    var DiZhi = new Array(12);

    DiZhi[1] = "子";
    DiZhi[2] = "丑";
    DiZhi[3] = "寅";
    DiZhi[4] = "卯";
    DiZhi[5] = "辰";
    DiZhi[6] = "巳";
    DiZhi[7] = "午";
    DiZhi[8] = "未";
    DiZhi[9] = "申";
    DiZhi[10] = "酉";
    DiZhi[11] = "戌";
    DiZhi[12] = "亥";

    return DiZhi;
}

//返回十天干数据信息
function initTianGan() {

    var TianGan = new Array(10);

    TianGan[1] = "甲";
    TianGan[2] = "乙";
    TianGan[3] = "丙";
    TianGan[4] = "丁";
    TianGan[5] = "戊";
    TianGan[6] = "己";
    TianGan[7] = "庚";
    TianGan[8] = "辛";
    TianGan[9] = "壬";
    TianGan[10] = "癸";

    return TianGan;
}

//返回八神
function initBaShen() {

    var BaShen = new Array(8);

    BaShen[1] = "青龙";
    BaShen[2] = "朱雀";
    BaShen[3] = "勾陈";
    BaShen[4] = "腾蛇";
    BaShen[5] = "白虎";
    BaShen[6] = "玄武";
    BaShen[7] = "地运";
    BaShen[8] = "天运";

    return BaShen;
}


//八神数组
function getBaShenArray() {
    var BaShenPos = new Array(8);

    BaShenPos[1] = "kangongshen";//坎宫八神
    BaShenPos[2] = "gengongshen";//艮宫八神
    BaShenPos[3] = "zhengongshen";//震宫八神
    BaShenPos[4] = "xungongshen";//巽宫八神
    BaShenPos[5] = "ligongshen";//离宫八神
    BaShenPos[6] = "kungongshen";//坤宫八神
    BaShenPos[7] = "duigongshen";//兑宫八神
    BaShenPos[8] = "qiangongshen";//乾宫八神

    return BaShenPos;
}

//后天九星数组位置
function getTianPanHouTianJiuXingArray() {
    var TianPanHouTianJiuXingPos = new Array(9);

    TianPanHouTianJiuXingPos[1] = "kangonghtxing";//坎宫后天九星
    TianPanHouTianJiuXingPos[2] = "kungonghtxing";//坤宫后天九星
    TianPanHouTianJiuXingPos[3] = "zhengonghtxing";//震宫后天九星
    TianPanHouTianJiuXingPos[4] = "xungonghtxing";//巽宫后天九星
    TianPanHouTianJiuXingPos[5] = "zhonggonghtxing";//中宫后天九星
    TianPanHouTianJiuXingPos[6] = "qiangonghtxing";//乾宫后天九星
    TianPanHouTianJiuXingPos[7] = "duigonghtxing";//兑宫后天九星
    TianPanHouTianJiuXingPos[8] = "gengonghtxing";//艮宫后天九星
    TianPanHouTianJiuXingPos[9] = "ligonghtxing";//离宫后天九星

    return TianPanHouTianJiuXingPos;
}

//先天九星数组位置
function getTianPanXianTianJiuXingArray() {
    var TianPanCurrentJiuXingPos = new Array(9);

    TianPanCurrentJiuXingPos[1] = "kangongxtxing";//坎宫先天九星
    TianPanCurrentJiuXingPos[2] = "kungongxtxing";//坤宫先天九星
    TianPanCurrentJiuXingPos[3] = "zhengongxtxing";//震宫先天九星
    TianPanCurrentJiuXingPos[4] = "xungongxtxing";//巽宫先天九星
    TianPanCurrentJiuXingPos[5] = "zhonggongxtxing";//中宫先天九星
    TianPanCurrentJiuXingPos[6] = "qiangongxtxing";//乾宫先天九星
    TianPanCurrentJiuXingPos[7] = "duigongxtxing";//兑宫先天九星
    TianPanCurrentJiuXingPos[8] = "gengongxtxing";//艮宫先天九星
    TianPanCurrentJiuXingPos[9] = "ligongxtxing";//离宫先天九星

    return TianPanCurrentJiuXingPos;
}


//返回天盘9星
function initJiuXing() {

    var JiuXing = new Array(9);

    JiuXing[1] = "①";
    JiuXing[2] = "②";
    JiuXing[3] = "③";
    JiuXing[4] = "④";
    JiuXing[5] = "⑤";
    JiuXing[6] = "⑥";
    JiuXing[7] = "⑦";
    JiuXing[8] = "⑧";
    JiuXing[9] = "⑨";

    return JiuXing;
}

//通过数组值找下标(天干)
function getIntNumByArrayValue(arr, txt) {
    var array = initTianGan();
    var j = 0;
    for (var i = 1; i <= array.length; i++) {
        if (array[i] == txt) {
            j = i;
            break;
        }
    }

    return j;
}

//通过数组值找下标(地支)
function getIntNumByDiZhiArrayValue(arr, txt) {
    var array = initDiZhi();
    var j = 0;
    for (var i = 1; i <= array.length; i++) {
        if (array[i] == txt) {
            j = i;
            break;
        }
    }

    return j;
}

//设置初始时的地支配合的天干
function initGanZhiStart() {
    var strArr = new Array(10);
    //天干,甲己日,子时天干为甲
    strArr[1] = 1;
    strArr[6] = 1;
    //天干,乙庚日,子时天干为丙
    strArr[2] = 3;
    strArr[7] = 3;
    //天干,丙辛日,子时天干为戊
    strArr[3] = 5;
    strArr[8] = 5;
    //天干,丁壬日,子时天干为庚
    strArr[4] = 7;
    strArr[9] = 7;
    //天干,戊癸日,子时天干为壬
    strArr[5] = 9;
    strArr[10] = 9;

    return strArr;
}
//返回后天八卦所对应地支
function initBaGuaDiZhi() {

    var BaGuaDiZhi = [
        ["1"],
        ["2,3"],
        ["4"],
        ["6,5"],
        ["7"],
        ["8,9"],
        ["10"],
        ["12,11"]
    ];
    return BaGuaDiZhi;
}

//设置九星干支组合
function initNineStartGanZhiJia() {
    var tianGanJiuXingPos = new Array(1);

    //tianGanJiuXingPos[5] = "甲";//中宫后天九星
    tianGanJiuXingPos[1] = "甲";//中宫后天九星

    return tianGanJiuXingPos;
}

//大写月份转数字
function getChangeZhongWenToNum(txt) {
    var monthNum;

    if (txt == "一") {
        monthNum = 1;
    } else if (txt == "二") {
        monthNum = 2;
    } else if (txt == "三") {
        monthNum = 3;
    } else if (txt == "四") {
        monthNum = 4;
    } else if (txt == "五") {
        monthNum = 5;
    } else if (txt == "六") {
        monthNum = 6;
    } else if (txt == "七") {
        monthNum = 7;
    } else if (txt == "八") {
        monthNum = 8;
    } else if (txt == "九") {
        monthNum = 9;
    } else if (txt == "十") {
        monthNum = 10;
    } else if (txt == "十一") {
        monthNum = 11;
    } else if (txt == "十二") {
        monthNum = 12;
    } else if (txt == "正") {
        monthNum = 1;
    }

    return monthNum;
}

//寅月对应地支标签map
function getDiZhiToLabel() {
    var mapArr = new Array(12);

    mapArr[1] = 3;
    mapArr[2] = 4;
    mapArr[3] = 5;
    mapArr[4] = 6;
    mapArr[5] = 7;
    mapArr[6] = 8;
    mapArr[7] = 9;
    mapArr[8] = 10;
    mapArr[9] = 11;
    mapArr[10] = 12;
    mapArr[11] = 1;
    mapArr[12] = 2;

    return mapArr;

}

//人盘十二宫位置
function getRenPanGongArray() {
    var RenPanGongPos = new Array(12);

    RenPanGongPos[1] = "zishuigong";//子宫位
    RenPanGongPos[2] = "choutugong";//丑宫位
    RenPanGongPos[3] = "yinmugong";//寅宫位
    RenPanGongPos[4] = "maomugong";//卯宫位
    RenPanGongPos[5] = "chentugong";//辰宫位
    RenPanGongPos[6] = "sihuogong";//巳宫位
    RenPanGongPos[7] = "wuhuogong";//午宫位
    RenPanGongPos[8] = "weitugong";//未宫位
    RenPanGongPos[9] = "shenjingong";//申宫位
    RenPanGongPos[10] = "youjingong";//酉宫位
    RenPanGongPos[11] = "xutugong";//戌宫位
    RenPanGongPos[12] = "haishuigong";//亥宫位

    return RenPanGongPos;
}

//人盘十二宫位置
function getRenPanStyleArray() {
    var RenPanGongPos = new Array(12);

    RenPanGongPos[1] = "zishuistyle";//子宫位
    RenPanGongPos[2] = "choutustyle";//丑宫位
    RenPanGongPos[3] = "yinmustyle";//寅宫位
    RenPanGongPos[4] = "maomustyle";//卯宫位
    RenPanGongPos[5] = "chentustyle";//辰宫位
    RenPanGongPos[6] = "sihuostyle";//巳宫位
    RenPanGongPos[7] = "wuhuostyle";//午宫位
    RenPanGongPos[8] = "weitustyle";//未宫位
    RenPanGongPos[9] = "shenjinstyle";//申宫位
    RenPanGongPos[10] = "youjinstyle";//酉宫位
    RenPanGongPos[11] = "xutustyle";//戌宫位
    RenPanGongPos[12] = "haishuistyle";//亥宫位

    return RenPanGongPos;
}


//人盘十二宫位置
function getInitRenPanStyleArray() {
    var RenPanGongPos = new Array(12);
    /*
     RenPanGongPos['zishuistyle'] = "fs-15 c-f00 w-20 ta-c p-a t-455 l-170";//子宫位
     RenPanGongPos['choutustyle'] = "fs-15 c-f00 w-20 ta-c p-a t-450 l-100";//丑宫位
     RenPanGongPos['yinmustyle'] = "fs-15 c-f00  ta-c p-a t-393 l-27";//寅宫位
     RenPanGongPos['maomustyle'] = "fs-15 c-f00  ta-c p-a t-323 l-27";//卯宫位
     RenPanGongPos['chentustyle'] = "fs-15 c-f00  ta-c p-a t-255 l-27";//辰宫位
     RenPanGongPos['sihuostyle'] = "fs-15 c-f00 w-20 ta-c p-a t-180 l-100";//巳宫位
     RenPanGongPos['wuhuostyle'] = "fs-15 c-f00 w-20 ta-c p-a t-180 l-170";//午宫位
     RenPanGongPos['weitustyle'] = "fs-15 c-f00 w-20 ta-c p-a t-180 l-240";//未宫位
     RenPanGongPos['shenjinstyle'] = "fs-15 c-f00  ta-c p-a t-255 l-300";//申宫位
     RenPanGongPos['youjinstyle'] = "fs-15 c-f00  ta-c p-a t-323 l-300";//酉宫位
     RenPanGongPos['xutustyle'] = "fs-15 c-f00  ta-c p-a t-393 l-300";//戌宫位
     RenPanGongPos['haishuistyle'] = "fs-15 c-f00 w-20 ta-c p-a t-450 l-240";//亥宫位
     */

    RenPanGongPos['zishuistyle'] = "red";//子宫位
    RenPanGongPos['choutustyle'] = "red";//丑宫位
    RenPanGongPos['yinmustyle'] = "red";//寅宫位
    RenPanGongPos['maomustyle'] = "red";//卯宫位
    RenPanGongPos['chentustyle'] = "red";//辰宫位
    RenPanGongPos['sihuostyle'] = "red";//巳宫位
    RenPanGongPos['wuhuostyle'] = "red";//午宫位
    RenPanGongPos['weitustyle'] = "red";//未宫位
    RenPanGongPos['shenjinstyle'] = "red";//申宫位
    RenPanGongPos['youjinstyle'] = "red";//酉宫位
    RenPanGongPos['xutustyle'] = "red";//戌宫位
    RenPanGongPos['haishuistyle'] = "red";//亥宫位

    return RenPanGongPos;
}

//返回人盘十二宫
function initRenPanGong() {

    var RenPanGong = new Array(12);

    RenPanGong[1] = "运气";
    RenPanGong[2] = "兄弟";
    RenPanGong[3] = "配偶";
    RenPanGong[4] = "子女";
    RenPanGong[5] = "财帛";
    RenPanGong[6] = "疾病";
    RenPanGong[7] = "迁移";
    RenPanGong[8] = "交友";
    RenPanGong[9] = "事业";
    RenPanGong[10] = "田宅";
    RenPanGong[11] = "福德";
    RenPanGong[12] = "父母";

    return RenPanGong;
}

//返回后天八卦宫位
function initBaGua() {

    var BaGua = new Array(8);

    BaGua[1] = "坎";
    BaGua[2] = "艮";
    BaGua[3] = "震";
    BaGua[4] = "巽";
    BaGua[5] = "离";
    BaGua[6] = "坤";
    BaGua[7] = "兑";
    BaGua[8] = "乾";

    return BaGua;
}

//设置九星干支组合
function initNineStartGanZhi() {
    var tianGanJiuXingPos = new Array(9);

    tianGanJiuXingPos[1] = "戊";//坎宫后天九星
    tianGanJiuXingPos[2] = "己";//坤宫后天九星
    tianGanJiuXingPos[3] = "庚";//震宫后天九星
    tianGanJiuXingPos[4] = "辛";//巽宫后天九星
    tianGanJiuXingPos[5] = "壬";//中宫后天九星
    tianGanJiuXingPos[6] = "癸";//乾宫后天九星
    tianGanJiuXingPos[7] = "丁";//兑宫后天九星
    tianGanJiuXingPos[8] = "丙";//艮宫后天九星
    tianGanJiuXingPos[9] = "乙";//离宫后天九星

    return tianGanJiuXingPos;
}

//通过偏移找到12宫运宫的开始位置
function findGongStartByTip(totalTip) {
    var baGua = initBaGua();

    var start = 1;
    //减去日,时,刻,三个重复的位置
    var tTip = totalTip - 3;

    var sta = tTip % 8;
    //alert("sta=="+sta);
    if (sta == 0) {
        start = 8;
    } else {
        start = tTip % 8;
    }
    //alert("start=="+start);
    return start;
}

//通过刻支找到(刻支)阴阳
function getYinYangKeZhi(baZi) {
    var diZhiArr = initDiZhi();

    var baziArr = baZi.split(",");

    var keZhi = baziArr[4][1];

    var sta;
    var dizhiNum = getIntNumByDiZhiArrayValue(diZhiArr, keZhi);

    if (dizhiNum % 2 == 0) {
        sta = "yin";
    } else {
        sta = "yang";
    }

    return sta;

}

//取八神信息
function getBaShenPost(mytime, rgan) {
    var startPost;
    if (rgan == "戊") {
        startPost = 1;
    } else if (rgan == "己") {
        startPost = 6;
    } else if (rgan == "庚") {
        startPost = 3;
    } else if (rgan == "辛") {
        startPost = 4;
    } else if (rgan == "壬" || rgan == "甲") {
        var monthNum = getMonthYinLiNum(mytime);
        if (monthNum == 1 || monthNum == 2 || monthNum == 3) {
            startPost = 4;
        } else if (monthNum == 4 || monthNum == 5 || monthNum == 6) {
            startPost = 6;
        } else if (monthNum == 7 || monthNum == 8 || monthNum == 9) {
            startPost = 8;
        } else if (monthNum == 10 || monthNum == 11 || monthNum == 12) {
            startPost = 2;
        }

    } else if (rgan == "癸") {
        startPost = 8;
    } else if (rgan == "丁") {
        startPost = 7;
    } else if (rgan == "丙") {
        startPost = 2;
    } else if (rgan == "乙") {
        startPost = 5;
    }


    return startPost;
}

//获取指定时间的阴历月份
function getMonthYinLiNum(mytime) {
    var monthArr = getDateTimeTipByTime(mytime);
    var tM = monthArr.split(",");


    //月的偏移量
    var monthTip = tM[0];

    return monthTip;
}

//通过干支找到年份
function getYearByBaZi(cYearGanZhi) {
    var cYear;
    //从现在逆推年份,找到阴历的年份与传入的年份一致时,则找到了出生年份
    var now = new Date();
    var ob = new Object();
    var year = year2Ayear(now.getFullYear());
    var minYear = 1900;
    var i;
    for (i = year; i--; i >= minYear) {

        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        var cml_his = hour + ":" + minute + ":" + second;
        var times = year + ":" + month + ":" + day + " " + cml_his;

        var t = timeStr2hour(cml_his);
        var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

        var now = new Date();
        curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

        var cp11_j = -116.383333;
        obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算

        if (ob.bz_jn == cYearGanZhi) {
            cYears = year;
            break;
        }
        year = year - 1;
    }

    return cYears;

}

//通过年份(数字)与月份的干支找到月份在阴历几月
function getMonthByYear(cYear, cMonthGanZhi) {
    var year = cYear, cMonth;
    //从现在逆推年份,找到阴历的年份与传入的年份一致时,则找到了出生年份
    var now = new Date();
    var ob = new Object();
    //var year  = year2Ayear(now.getFullYear());
    //var minYear = 1900;
    var i;
    var month;
    for (i = 1; i++; i <= 12) {

        month = i;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        var cml_his = hour + ":" + minute + ":" + second;
        var times = year + ":" + month + ":" + day + " " + cml_his;

        var t = timeStr2hour(cml_his);
        var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

        var now = new Date();
        curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

        var cp11_j = -116.383333;
        obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算

        if (ob.bz_jy == cMonthGanZhi) {
            cMonth = i;
            break;
        }

    }

    return cMonth;
}

//获取指定年份,指定月份有多少天数
function getDayNumsByYearMonth(cYear, CMonth) {
    var dayNums;

    var year = cYear;
    var month = CMonth;
    var mydate = new Date();
    //取当前年份(2017)
    var By = year2Ayear(cYear);
    //取当前月份(9)
    var Bm = month + 1;

    //取当前小时
    var nowHour = mydate.getHours();
    //取当前分钟
    var nowMinutes = mydate.getMinutes();
    //取当前秒
    var nowSeconds = mydate.getSeconds();

    var now = new Date();
    curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时
    curJD = now / 86400000 - 10957.5 - curTZ / 24; //J2000起算的儒略日数(当前本地时间)
    curJD = int2(curJD + 0.5);
    if (By == -10000) return;

    //新加的
    if (!lun.dn || lun.y != By || lun.m != Bm) {  //月历未计算
        lun.yueLiHTML(By, Bm, curJD);
    }

    lun.yueLiCalc(year, month);

    if (lun.dn > 0) {
        dayNums = lun.dn;
    }

    return dayNums;
}

//通过年份,月份找到指定的阴历日子
//首先确定指定年,月,有多少天,然后从1开始查找
function getDayByYearMonth(cYear, cMonth, cDayGanZhi) {
    var year = cYear, month = cMonth, cDays;
    //从现在逆推年份,找到阴历的年份与传入的年份一致时,则找到了出生年份
    var now = new Date();
    var ob = new Object();

    var i;
    var day;
    //先要找到本年月,一共有多少天,然后再循环查找
    var num = getDayNumsByYearMonth(cYear, cMonth);
    for (i = 1; i++; i <= num) {

        day = i;
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        var cml_his = hour + ":" + minute + ":" + second;
        var times = year + ":" + month + ":" + day + " " + cml_his;

        var t = timeStr2hour(cml_his);
        var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

        var now = new Date();
        curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

        var cp11_j = -116.383333;
        obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算

        if (ob.bz_jr == cDayGanZhi) {
            cDays = i;
            break;
        }
        //year = year - 1;
    }

    return cDays;
}

//通过年,月,日,本获取指定的时辰
function getTimeByYearMonthDay(cYear, cMonth, cDay, cShiGanZhi) {
    var year = cYear;
    var month = cMonth;
    var day = cDay;
    var cTimes;
    //从现在逆推年份,找到阴历的年份与传入的年份一致时,则找到了出生年份
    var now = new Date();
    var ob = new Object();
    //var year  = year2Ayear(now.getFullYear());
    //var minYear = 1900;
    var i;
    var hour;
    for (i = 0; i <= 23; i++) {
        hour = i;
        var minute = now.getMinutes();
        var second = now.getSeconds();

        var cml_his = hour + ":" + minute + ":" + second;
        var times = year + ":" + month + ":" + day + " " + cml_his;

        var t = timeStr2hour(cml_his);
        var jd = JD.JD(year2Ayear(year), month, day - 0 + t / 24)

        var now = new Date();
        curTZ = now.getTimezoneOffset() / 60; //时区 -8为北京时

        var cp11_j = -116.383333;
        obb.mingLiBaZi(jd + curTZ / 24 - J2000, cp11_j / radd, ob); //八字计算

        if (ob.bz_js == cShiGanZhi) {
            cTimes = i;
            break;
        }

    }

    return cTimes;
}


