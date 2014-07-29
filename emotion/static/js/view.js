var URL_STRESS = '/api/get_stress';
var URL_STRESS_TIME = '/api/get_stress_by_time';
var URL_REASON = '/api/get_reason';
var URL_KEYWORD = '/api/get_keyword';
var URL_GETWEIBO = '/api/getweibo';
var URL_PREDICT = '/api/predict';
var URL_LASTWEIBO = '/api/lastweibo';
var URL_GET_HISTORY = '/api/get_history';
var URL_LOGOUT = '/api/logout';
var uid = 0;
var weibos = [];
var cur_weibo = 0;
var weibo_content = "";
var pic;
var style=0;
var debug;
var debug_time;
var basetime = 1311868800;
var adaytime = 86400;
var cur_day = 4;
var cur_his = 1;
//var items = ['stress', 'stress-time', 'reason', 'keyword', 'map'];
var items = ['stress', 'stress-time', 'map'];
var CLASSTYPE = ['','','两类','','','','六类'];
var ATTRTYPE = ['文','文社','文图','文图社'];
//var myChart;
//var option={};
var maxi_6=1;
var src_6=["","","",""];
var dd_6=[[],[],[],[]];
/*
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
        
        
        //    If the file is an image and the web browser supports FileReader,
        //    present a preview in the file list
        
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
}*/

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
            //document.getElementById("predict-result").src = "/static/img/0.png";
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
            //document.getElementById("predict-result").src = "/static/img/0.png";
            //todo   pic = ...
        }
        else {
            //$('#weibo-content').val("获取失败");
            alert("没有更多微博！");
        }
    }, 'json');
}

function set_6_his(dd,re){
//dd=dd_6[j];
maxi=Math.max.apply(null,dd);
                document.getElementById("6-class-face-his").src="../img/"+re+".png";
                AmCharts.makeChart("6-class-polar-his", {
    "type": "radar",
    "theme": "none",
    "dataProvider": [{
        "type": "生气",
        "litres": dd[0]
    }, {
        "type": "恶心",
        "litres": dd[1]
    }, {
        "type": "害怕",
        "litres": dd[2]
    }, {
        "type": "高兴",
        "litres": dd[3]
    }, {
        "type": "伤心",
        "litres": dd[4]
    }, {
        "type": "惊讶",
        "litres": dd[5]
    }],
    "valueAxes": [{
        "axisTitleOffset": 20,
        "minimum": 0,
        "maximum": maxi,
        "axisAlpha": 0.15
    }],
    "startDuration": 2,
    "graphs": [{
        "balloonText": "[[value]]%",
        "bullet": "round",
        "fillAlphas": 0.3,
        "valueField": "litres"
    }],
    "categoryField": "type"
});

}

function set_6(j){
dd=dd_6[j];
                document.getElementById("6-class-face").src=src_6[j];
                AmCharts.makeChart("6-class-polar", {
    "type": "radar",
    "theme": "none",
    "dataProvider": [{
        "type": "生气",
        "litres": dd[0]
    }, {
        "type": "恶心",
        "litres": dd[1]
    }, {
        "type": "害怕",
        "litres": dd[2]
    }, {
        "type": "高兴",
        "litres": dd[3]
    }, {
        "type": "伤心",
        "litres": dd[4]
    }, {
        "type": "惊讶",
        "litres": dd[5]
    }],
    "valueAxes": [{
        "axisTitleOffset": 20,
        "minimum": 0,
        "maximum": maxi_6,
        "axisAlpha": 0.15
    }],
    "startDuration": 2,
    "graphs": [{
        "balloonText": "[[value]]%",
        "bullet": "round",
        "fillAlphas": 0.3,
        "valueField": "litres"
    }],
    "categoryField": "type"
});

}

function set_highcharts(res){
	    neg=[];
            pos=[];
            maxi=1;
            getmaxi=[];
            for (var j=0; j<=3; j++){
                pos.push(parseFloat((parseFloat(res["2"+j][1])*100).toFixed(1)));
                neg.push(parseFloat((parseFloat(res["2"+j][2])*100).toFixed(1)));
                dd_6[j]=[];
                src_6[j]="../img/"+res["6"+j][0]+".png";
                for (var kk=1;kk<=6;kk++){
                    getmaxi.push(parseFloat(res["6"+j][kk]));
                    dd_6[j].push(parseFloat(res["6"+j][kk]));
                }
            }
            maxi=Math.max.apply(null,getmaxi);
            maxi_6 = maxi;
            set_6(3);
            $('#2-class-zhutu').highcharts({
        chart: {type: 'bar'},
        title: {text: '两类情感分析概率结果'},
        xAxis: {categories: ['文本', '文本+社会', '文本+图像', '文本+图像+社会']},
        yAxis: {
            min: 0,
            max: 100,
            title: {text: '概率'},
            labels: {formatter: function () {return this.value+'%';}}
        },
        legend: {
            backgroundColor: '#FFFFFF',
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

            series: [{
            name: '负性情感',
            data: neg,
            color: '#555555',
            dataLabels: {
                enabled: true,

                color: '#FFFFFF',
                align: 'center',
                x: 0,
                y: 0,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }, {
            name: '正性情感',
            data: pos,
            color: '#FF0000',
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'center',
                x: 0,
                y: 0,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
});
}

function set_highcharts_his(res){
            neg=[];
            pos=[];
            dd=[[],[],[],[]];
            for (var j=0; j<=3; j++){
                pos.push(parseFloat((parseFloat(res["2"+j][1])*100).toFixed(1)));
                neg.push(parseFloat((parseFloat(res["2"+j][2])*100).toFixed(1)));
                dd[j]=[];
                for (var kk=1;kk<=6;kk++){
                    dd[j].push(parseFloat(res["6"+j][kk]));
                }
            }
            $('#2-class-zhutu-his').highcharts({
        chart: {type: 'bar'},
        title: {text: '两类情感分析概率结果'},
        xAxis: {categories: ['文本', '文本+社会', '文本+图像', '文本+图像+社会']},
        yAxis: {
            min: 0,
            max: 100,
            title: {text: '概率'},
            labels: {formatter: function () {return this.value+'%';}}
        },
        legend: {
            backgroundColor: '#FFFFFF',
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
            series: [{
            name: '负性情感',
            data: neg,
            color: '#555555',
            dataLabels: {
                enabled: true,

                color: '#FFFFFF',
                align: 'center',
                x: 0,
                y: 0,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }, {
            name: '正性情感',
            data: pos,
            color: '#FF0000',
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'center',
                x: 0,
                y: 0,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
});
 set_6_his(dd[3],res["63"][0]);
}

function get_history(page){
	$.get(URL_GET_HISTORY, {objPage:page}, function(data){
		if (data.success == 1){
			document.getElementById('weibo-content-his').innerHTML = data.result['content'];
			document.getElementById('weibo-imgimg-his').src = data.result['img'];
			document.getElementById('social1-his').innerHTML = data.result['z'];
                        document.getElementById('social2-his').innerHTML = data.result['pl'];
                        document.getElementById('social3-his').innerHTML = data.result['zf'];
			set_highcharts_his(data.result);
			
		}
		else{
			cur_his=data['total_page'];
			if (cur_his==0){
				document.getElementById('no-his').style.display="";
				document.getElementById('has-his').style.display="none";
			}
		}
	},'json');
}

function next_his(){
	cur_his=cur_his+1;
	get_history(cur_his);
}

function last_his(){
	cur_his=cur_his-1;
	if (cur_his<1){cur_his=1;}
	else{get_history(cur_his);}
}

function change_6(){
	var obj=document.getElementsByName("attr-com");
	for (i=0;i<obj.length;i++){
		if (obj[i].checked){
			set_6(i);
			break;
		}
	}
}

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
    if ($('#weibo-content').val()==""){
	alert('必须输入微博文本内容');
	return;
    }
    social=[$('#social1').val(),$('#social2').val(),$('#social3').val()];
    imgsrc=document.getElementById("weibo-imgimg").src;
    if (imgsrc=="http://weibo.emotionanalyser.com/static/web/view.html"){
        imgsrc = "";
    }
    $.get(URL_PREDICT, {uid: uid, weibo: $('#weibo-content').val(), pl:social[1],zf:social[2],z:social[0],img:imgsrc}, function(data){
        if (data.success == 1) {
document.getElementById("yucejieguo").innerHTML="<br/><br/>分析结果：";
document.getElementById("liuleijieguo").innerHTML="六类情感分析概率结果";
document.getElementById("6-class-table").style.display="";
//$('#stress-value').html(parseInt(data.stress*100));
		set_highcharts(data.result);
            alert("分析完毕");
        }
        else {
            alert("分析出错");
            //if (class_type==2){return ['1','0.5','0.5']}
            //else{return ['4','0.167','0.167','0.167','0.167','0.167','0.167']}
            //$('#weibo-content').html("获取失败");
        }
    }, 'json');
}

function delimg(){
    document.getElementById("weibo-imgimg").src="";
}

function logout(){
	$.get(URL_LOGOUT, {}, function(data){
		alert("退出成功");
	});
}

/*function bind_homepage() {
    $("#homepage-btn").bind('click', function(){
        window.location.href = '/static/web/homepage.html'
    });
    $("#about-us-btn").bind('click', function(){
	logout();
        window.location.href = '/static/web/homepage.html'
    });
}*/

function load_stress_time(sty) {
    var from = cur_day-3;
    var until = cur_day+3;
    $.get(URL_STRESS_TIME, {uid:get_uid(),from: from, until: until}, function(data){
        debug_time = data;
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
		if (style==0){
//alert("style==0");
                sum2=data.data[j].pos+data.data[j].neg;
                sum6=data.data[j].anger+data.data[j].disgust+data.data[j].fear+data.data[j].happy+data.data[j].sad+data.data[j].surprise;
                x.push(data.data[j].time);
                pos.push(data.data[j].pos/sum2);
                neg.push(data.data[j].neg/sum2);
                anger.push(data.data[j].anger/sum6);
                disgust.push(data.data[j].disgust/sum6);
                fear.push(data.data[j].fear/sum6);
                happy.push(data.data[j].happy/sum6);
                sad.push(data.data[j].sad/sum6);
                surprise.push(data.data[j].surprise/sum6);
		}
		else{
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
            }
            function formatAuto() {
                ret = new Date(this.value*1000).format('yyyy-<br/>mm-dd');
                if (ret=='2012-<br/>01-01'){
                    ret = ret+'<br/>元旦';
                }
                else if (ret=='2012-<br/>01-22'){
                    ret = ret+'<br/>除夕';
                }
                else if (ret=='2012-<br/>02-14'){
                    ret = ret+'<br/>情人节';
                }
                else if (ret=='2012-<br/>10-01'||ret=='2011-<br/>10-01'){
                    ret = ret+'<br/>国庆节';
                }
                else if (ret=='2012-<br/>05-01'){
                    ret = ret+'<br/>劳动节';
                }

                return ret;
            }
	if (style==0){
//alert("yes");
            $('#class2-div').highcharts({
                chart: {type: 'column'},
                title: {text: '两类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {min:0,max:1,title: '百分比'},
                tooltip: {
            formatter: function() {
                return new Date(this.x*1000).format('yyyy-mm-dd') +'<br/>'+
                    this.series.name +': '+ (this.y*100).toFixed(1)+'%';
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
                series: [{
                    name: 'Positive',
                    color: '#FF0000',
                    data: pos
                }, {
                    name: 'Negative',
                    color: '#555555',
                    data: neg
                }]
            });
            $('#class6-div').highcharts({
                chart: {type: 'column'},//area
                title: {text: '六类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {min:0,max:1,title: '百分比'},
                tooltip: {
            formatter: function() {
                return new Date(this.x*1000).format('yyyy-mm-dd') +'<br/>'+
                    this.series.name +': '+ (this.y*100).toFixed(1)+'%';            
}
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
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
		else{
$('#class2-div').highcharts({
		                chart: {type: 'area'},
                title: {text: '两类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {title: '百分比'},
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
		});
		            $('#class6-div').highcharts({
                chart: {type: 'area'},//area
                title: {text: '六类情感变化', x:0},
                xAxis: {categories: x, labels: {formatter: formatAuto}},
                //yAxis: {title: '情感',plotLines: [{value: 0, width: 1, color: '#808080'}]},
                yAxis: {title: '百分比'},
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
        }
    }, 'json');
}

function share(){
emotion_type=['','生气','恶心','害怕','高兴','伤心','惊讶'];
content=$('#weibo-content').val();
reg=new RegExp("//@.+:","g");
content=content.replace(reg,"");
if (content.length>80){
content=content.substr(0,80)+"...";
}
window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent('我在微博情感分析网weibo.emotionanalyser.com分析了“'+content+'”的情感，结果是'+emotion_type[parseInt(document.getElementById("6-class-face").src[44])]+'，一起来玩吧！')+'&url='+encodeURIComponent(location.href) + '&pic=' + document.getElementById("6-class-face").src,'_blank','width=450,height=400');
}

//function share(){alert('share');}

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
    $("#next-his-btn").bind('click', function(){
        next_his();
    })
    $("#last-his-btn").bind('click', function(){
        last_his();
    })
    //$("#delimg-btn").bind('click', function(){
    //    delimg();
    //})
    $("#share-btn").bind('click', function(){
        share();
    })
    $("#homepage-btn").bind('click', function(){
        window.location.href = '/static/web/homepage.html'
    })
    $("#about-us-btn").bind('click', function(){
        logout();
        window.location.href = '/static/web/homepage.html'
    })
    $("#datepicker").datepicker({dateFormat: 'yy/mm/dd', rangeSelect: true, firstDay: 1, showOn: 'both',
            buttonImageOnly: true, buttonImage: '../img/calendar.jpg', minDate:new Date("2011/08/01"), maxDate:new Date("2012/12/22"),
            onSelect: function(dateText, inst) {
                d = new Date(dateText);
                cur_day = (d.getTime()/1000 - basetime)/adaytime + 1;
                load_stress_time(style);
            }});
}

function increase_day(){
	cur_day = cur_day+7;
	if (cur_day>513){cur_day=513;}
	load_stress_time(style);
}

function decrease_day(){
	cur_day=cur_day-7;
	if(cur_day<4){cur_day=4;}
	load_stress_time(style);
}

function get_uid() {
    return 1;
}

function changestyle(){
	style=1-style;
	load_stress_time(style);
}

$(document).ready(function() {
    bind_select();
    uid = get_uid();
    //load_stress(uid);
    //load_keyword(uid);
    //upload_prepare();
    load_stress_time(style);
    //predict();
    get_history(1);
    //bind_homepage();
    //myChart = echarts.init(document.getElementById('main')); 
})

