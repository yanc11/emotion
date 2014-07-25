var URL_STRESS = '/api/get_stress';
var URL_STRESS_TIME = '/api/get_stress_by_time';
var URL_REASON = '/api/get_reason';
var URL_KEYWORD = '/api/get_keyword';
var URL_GETWEIBO = '/api/getweibo';
var URL_PREDICT = '/api/predict';
var URL_LASTWEIBO = '/api/lastweibo';
var uid = 0;
var weibos = [];
var cur_weibo = 0;
var weibo_content = "";
var pic;
var debug;
var basetime = 1325347200;
var adaytime = 86400;
//var items = ['stress', 'stress-time', 'reason', 'keyword', 'map'];
var items = ['stress', 'stress-time', 'map'];
var CLASSTYPE = ['','','两类','','','','六类'];
var ATTRTYPE = ['文','文社','文图','文图社'];


function upload_prepare() {
    var filesUpload = document.getElementById("files-upload"),
        fileList = document.getElementById("file-list");
    
    function uploadFile (file) {
        //fileList.removeChild(document.getElementById("weibo-img"));
        var li = document.createElement("li"),
            div = document.createElement("div"),
            img,
            progressBarContainer = document.createElement("div"),
            progressBar = document.createElement("div"),
            reader,
            xhr,
            fileInfo;
            
        li.id = "weibo-img";
        li.appendChild(div);
        
        progressBarContainer.className = "progress-bar-container";
        progressBar.className = "progress-bar";
        progressBarContainer.appendChild(progressBar);
        li.appendChild(progressBarContainer);
        
        /*
            If the file is an image and the web browser supports FileReader,
            present a preview in the file list
        */
        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
            img = document.createElement("img");
            img.id = "weibo-imgimg";
            li.appendChild(img);
            reader = new FileReader();
            reader.onload = (function (theImg) {
                return function (evt) {
                    theImg.src = evt.target.result;
                };
            }(img));
            reader.readAsDataURL(file);
        }
        else{
            alert("请上传正确的图片格式");
            return false;
        }
        fileList.removeChild(document.getElementById("weibo-img"));
        // Uploading - for Firefox, Google Chrome and Safari
        xhr = new XMLHttpRequest();
        
        // Update progress bar
        xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
            }
            else {
                // No data to calculate on
            }
        }, false);
        
        // File uploaded
        xhr.addEventListener("load", function () {
            progressBarContainer.className += " uploaded";
            //progressBar.innerHTML = "Uploaded!";
        }, false);
        
        xhr.open("post", "upload/upload.php", true);
        
        // Set appropriate headers
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("X-File-Name", file.name);
        xhr.setRequestHeader("X-File-Size", file.size);
        xhr.setRequestHeader("X-File-Type", file.type);

        // Send the file (doh)
        xhr.send(file);
        
        // Present file info and append it to the list of files
        fileInfo = "<div><strong>Name:</strong> " + file.name + "</div>";
        fileInfo += "<div><strong>Size:</strong> " + parseInt(file.size / 1024, 10) + " kb</div>";
        fileInfo += "<div><strong>Type:</strong> " + file.type + "</div>";
        div.innerHTML = "";//fileInfo;
        
        fileList.appendChild(li);
    }
    
    function traverseFiles (files) {
        if (typeof files !== "undefined") {
            for (var i=0, l=files.length; i<l; i++) {
                uploadFile(files[i]);
            }
            pic = files[files.length-1];
        }
        else {
            fileList.innerHTML = "No support for the File API in this web browser";
        }   
    }
    
    
    filesUpload.addEventListener("change", function () {
        traverseFiles(this.files);
    }, false);
}

function lastweibo(){
    $.get(URL_LASTWEIBO, {num:cur_weibo}, function(data){
        debug = data;
        if (data.success == 1){
            cur_weibo = data.num;
            weibos=data.content;
            weibo_content = data.content["text"];
            rac=0;
            rcc=0;
            rrc=0;//retweeted reposts count
            if (data.content.hasOwnProperty("retweeted_status")){
                weibo_content = weibo_content+"//"+ data.content["retweeted_status"]["text"];
                rac=data.content.retweeted_status.attitudes_count;
                rcc=data.content.retweeted_status.comments_count;
                rrc=data.content.retweeted_status.reposts_count;
            }
            $('#weibo-content').val(weibo_content);
            $('#social1').val(data.content["attitudes_count"]+rac);
            $('#social2').val(data.content["comments_count"]+rcc);
            $('#social3').val(data.content["reposts_count"]+rrc);
            if (data.content["pic_urls"].length == 0){
                document.getElementById("weibo-imgimg").src = "";
                if (data.content.hasOwnProperty("retweeted_status")){
                    if (data.content.retweeted_status.pic_urls.length > 0)
                       document.getElementById("weibo-imgimg").src = data.content.retweeted_status.pic_urls[0].thumbnail_pic;
                }
            }
            else{
                document.getElementById("weibo-imgimg").src = data.content["pic_urls"][0].thumbnail_pic;
            }
            document.getElementById("predict-result").src = "/static/img/0.png";
        }
        else{
            alert("没有上一条微博");
        }
    }, 'json');
}

function getweibo(){
    //$('#weibo-content').val("???????");
    $.get(URL_GETWEIBO, {num:cur_weibo}, function(data){
        debug=data;
        if (data.success == 1) {
            //$('#stress-value').html(parseInt(data.stress*100));
            //weibo_content = data.content;
            cur_weibo=data.num;
            weibos=data.content;
            weibo_content = data.content["text"];
            rac=0;
            rcc=0;
            rrc=0;//retweeted reposts count
            if (data.content.hasOwnProperty("retweeted_status")){
                weibo_content = weibo_content+"//"+ data.content["retweeted_status"]["text"];
                rac=data.content.retweeted_status.attitudes_count;
                rcc=data.content.retweeted_status.comments_count;
                rrc=data.content.retweeted_status.reposts_count;
            }
            $('#weibo-content').val(weibo_content);
            $('#social1').val(data.content["attitudes_count"]+rac);
            $('#social2').val(data.content["comments_count"]+rcc);
            $('#social3').val(data.content["reposts_count"]+rrc);
            if (data.content["pic_urls"].length == 0){
                document.getElementById("weibo-imgimg").src = "";
                if (data.content.hasOwnProperty("retweeted_status")){
                    if (data.content.retweeted_status.pic_urls.length > 0)
                       document.getElementById("weibo-imgimg").src = data.content.retweeted_status.pic_urls[0].thumbnail_pic; 
                }
            }
            else{
                document.getElementById("weibo-imgimg").src = data.content["pic_urls"][0].thumbnail_pic;
            }
            document.getElementById("predict-result").src = "/static/img/0.png";
            //todo   pic = ...
        }
        else {
            //$('#weibo-content').val("获取失败");
            alert("没有更多微博！");
        }
    }, 'json');
}

/*function predict(){
    res_2_1 = predict_once(2,1);
    res_2_0 = predict_once(2,0);
    res_2_2 = predict_once(2,2);
    res_2_3 = predict_once(2,3);
    res_6_1 = predict_once(6,1);
    res_6_0 = predict_once(6,0);
    res_6_2 = predict_once(6,2);
    res_6_3 = predict_once(6,3);
    debug=[];
    debug.concat(res_2_0);
    debug.concat(res_2_1);
    debug.concat(res_2_2);
    debug.concat(res_2_3);
    debug.concat(res_6_0);
    debug.concat(res_6_1);
    debug.concat(res_6_2);
    debug.concat(res_6_3);
    alert('预测完成');
}*/

function predict(){
    //$('#weibo-content').html("OK");
    /*var class_type, attr_type;
    var obj = document.getElementsByName("emotion-class");
    for(i=0; i<obj.length; i++){
        if(obj[i].checked){
            class_type = obj[i].value;
            break;
        }
    }
    obj = document.getElementsByName("attr-com");
    for(i=0; i<obj.length; i++){
        if(obj[i].checked){
            attr_type = obj[i].value;
            break;
        }
    }*/

    social=[$('#social1').val(),$('#social2').val(),$('#social3').val()];
    imgsrc=document.getElementById("weibo-imgimg").src;
    if (imgsrc=="http://weibo.emotionanalyser.com/static/web/view.html"){
        imgsrc = "";
    }
    $.get(URL_PREDICT, {uid: uid, weibo: $('#weibo-content').val(), pl:social[1],zf:social[2],z:social[0],img:imgsrc}, function(data){
        if (data.success == 1) {
            //$('#stress-value').html(parseInt(data.stress*100));
            debug = data.result;
            //return res;
            //document.getElementById("predict-result").src = "/static/img/"+res+".png";
            alert("预测完毕");
            //<td width="50"><img src="/static/img/4.png"></img></td>
            //<td width="50"><p style="font-size:14px">两类<br>文图社</p></td>
            //<td><p style="font-size:14px">今天天气真好~~</p></td>
            /*
            newtr = document.createElement("tr");
            newtd1 = document.createElement("td");
            newtd1.width = "60";
            newtd2 = document.createElement("td");
            newtd2.width = "60";
            newtd3 = document.createElement("td");
            newimg = document.createElement("img");
            newimg.src = "/static/img/"+res+".png";
            newtd1.appendChild(newimg);
            newp1 = document.createElement("p");
            newp1.style = "font-size:14px";
            newp1.innerHTML = CLASSTYPE[parseInt(class_type)]+"<br>"+ATTRTYPE[parseInt(attr_type)];
            newtd2.appendChild(newp1);
            newp2 = document.createElement("p");
            newp2.style = "font-size:14px";
            newp2.innerHTML = $('#weibo-content').val();
            newtd3.appendChild(newp2);
            newtr.appendChild(newtd1);
            newtr.appendChild(newtd2);
            newtr.appendChild(newtd3);
            document.getElementById("his-table-body").appendChild(newtr);*/
        }
        else {
            alert("预测出错");
            //if (class_type==2){return ['1','0.5','0.5']}
            //else{return ['4','0.167','0.167','0.167','0.167','0.167','0.167']}
            //$('#weibo-content').html("获取失败");
        }
    }, 'json');
}

function delimg(){
    document.getElementById("weibo-imgimg").src="";
}


function load_stress_time(uid, from, until) {
    //var from = 8;
    //var until = 14;
    $.get(URL_STRESS_TIME, {uid: uid, from: from, until: until}, function(data){
        if (data.success == 1) {
            var x = [];
            var pos = [];
            var neg = [];
            var anger = [];
            var disgust = [];
            var fear = [];
            var happy = [];
            var sad = [];
            var surprise = [];
            for (var j=0; j<data.data.length; j++) {
                x.push(data.data[j].time);
                pos.push(data.data[j].pos);
                neg.push(data.data[j].neg);
                anger.push(data.data[j].anger);
                disgust.push(data.data[j].disgust);
                fear.push(data.data[j].fear);
                happy.push(data.data[j].happy);
                sad.push(data.data[j].sad);
                surprise.push(data.data[j].surprise);
            }
            function formatAuto() {
                ret = new Date(this.value*1000).format('mm-dd');
                if (ret=='01-01'){
                    ret = ret+'<br/>元旦';
                }
                else if (ret=='01-23'){
                    ret = ret+'<br/>春节';
                }
                else if (ret=='02-14'){
                    ret = ret+'<br/>情人节';
                }
                return ret;
            }
            $('#class2-div').highcharts({
                chart: {type: 'area'},
                title: {text: '两类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {title: 'precent'},
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br>',
                    shared: true
                },
                plotOptions: {
                    area: {
                        stacking: 'percent',
                        lineColor: '#ffffff',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#ffffff'
                        }
                    }
                },
                //legend:{borderWidth:0, itemStyle:{fontSize:'10px'}},
                //series: [{data:y}]
                series: [{
                    name: 'Positive',
                    color: '#FF0000',
                    data: pos
                }, {
                    name: 'Negative',
                    color: '#555555',
                    data: neg
                }]
                /*series: [{
                    name: 'Happy',
                    data: [502, 635, 809, 947, 1402, 3634, 5268]
                }, {
                    name: 'Surprise',
                    data: [106, 107, 111, 133, 221, 767, 1766]
                }, {
                    name: 'Anger',
                    data: [163, 203, 276, 408, 547, 729, 628]
                }, {
                    name: 'Sad',
                    data: [180, 310, 540, 156, 339, 818, 1201]
                }, {
                    name: 'Fear',
                    data: [18, 31, 54, 156, 339, 818, 1201]
                }, {
                    name: 'Disgust',
                    data: [2, 2, 2, 6, 13, 30, 46]
                }]*/
            });
            $('#class6-div').highcharts({
                chart: {type: 'area'},
                title: {text: '六类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {title: 'precent'},
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br>',
                    shared: true
                },
                plotOptions: {
                    area: {
                        stacking: 'percent',
                        lineColor: '#ffffff',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#ffffff'
                        }
                    }
                },
                //legend:{borderWidth:0, itemStyle:{fontSize:'10px'}},
                //series: [{data:y}]
                series: [{
                    name: 'Happy',
                    color: '#FF0000',
                    data: happy
                }, {
                    name: 'Surprise',
                    color: '#FFFF00',
                    data: surprise
                }, {
                    name: 'Anger',
                    color: '#68228B',
                    data: anger
                }, {
                    name: 'Sad',
                    color: '#555555',
                    data: sad
                }, {
                    name: 'Fear',
                    color: '#0000FF',
                    data: fear
                }, {
                    name: 'Disgust',
                    color: '#228B22',
                    data: disgust
                }]
            });
        }
    }, 'json');
}


function select_item(item) {
    var btn_now = '#' + item + '-btn';
    var div_now = '#' + item + '-div';
    $(btn_now).addClass('active');
    $(btn_now).removeClass('pointer');
    $(div_now).show();
}

function deselect_item(item) {
    var btn_now = '#' + item + '-btn';
    var div_now = '#' + item + '-div';
    $(btn_now).removeClass('active');
    $(btn_now).addClass('pointer');
    $(div_now).hide();
}

function bind_select() {
    for (var i=0; i<items.length; i++) {
        var btn = '#' + items[i] + '-btn';
        $(btn)[0].o = items[i];
        $(btn).bind('click', function(){
            deselect_item($('.active')[0].o);
            select_item(this.o);
        })
    }
    $("#get-weibo-btn").bind('click', function(){
        getweibo();
    })
    $("#predict-btn").bind('click', function(){
        predict();
    })
    $("#last-weibo-btn").bind('click', function(){
        lastweibo();
    })
    $("#delimg-btn").bind('click', function(){
        delimg();
    })
    $("#datepicker").datepicker({dateFormat: 'yy/mm/dd', rangeSelect: true, firstDay: 1, showOn: 'both',
            buttonImageOnly: true, buttonImage: '../img/calendar.jpg', minDate:new Date("2012/01/04"), maxDate:new Date("2012/02/13"),
            onSelect: function(dateText, inst) {
                d = new Date(dateText);
                var daynum = (d.getTime()/1000 - basetime)/adaytime + 1;
                load_stress_time(get_uid(),daynum-3,daynum+3);
            }});
}

function get_uid() {
    return 1;
}

$(document).ready(function() {
    bind_select();
    uid = get_uid();
    //load_stress(uid);
    //load_keyword(uid);
    upload_prepare();
    load_stress_time(uid,1,7);
    //predict();
    bind_homepage();
})



