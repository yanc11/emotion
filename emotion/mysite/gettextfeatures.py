# -*- coding:utf8 -*-
import urllib2
import json
import re

def judgelevel(a):
    if a in most:
        return 1
    if a in very:
        return 2
    if a in more:
        return 3
    if a in ish:
        return 4
    if a in insufficiently:
        return 5
    if a in over:
        return 6
    else:
        return 100      
        
    
url_get_base = "http://api.ltp-cloud.com/analysis/?"
api_key = 'g1k8H281BeVRSQhsIV6A5k7KmJvkOOvE8SToMYyA'
format = 'json'
pattern = 'all'
#正性词
positive = []
f = open("mysite/sentiment/positive.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    positive.append(tmp)
    line = f.readline()
f.close()
#负性词
negative = []
f = open("mysite/sentiment/negative.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    negative.append(tmp)
    line = f.readline()
f.close()
#极
most = []
f = open("mysite/sentiment/most.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    most.append(tmp)
    line = f.readline()
f.close()
#很
very = []
f = open("mysite/sentiment/very.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    very.append(tmp)
    line = f.readline()
f.close()
#较
more = []
f = open("mysite/sentiment/more.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    more.append(tmp)
    line = f.readline()
f.close()
#稍
ish = []
f = open("mysite/sentiment/ish.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    ish.append(tmp)
    line = f.readline()
f.close()
#欠
insufficiently = []
f = open("mysite/sentiment/insufficiently.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    insufficiently.append(tmp)
    line = f.readline()
f.close()
#超
over = []
f = open("mysite/sentiment/over.txt",'r')
line = f.readline()
while line:
    tmp = line.strip()
    over.append(tmp)
    line = f.readline()
f.close()
#否定
deny = ['不','没有']


#存储表情信息
biaoqingzhong = ['\[微博益起来\]','\[微公益爱心\]','\[转发\]','\[moc转发\]','\[xkl转圈\]',
   '\[神马\]','\[浮云\]',
    '\[围观\]','\[熊猫\]','\[兔子\]','\[奥特曼\]','\[囧\]','\[互粉\]',
    '\[礼物\]','\[呵呵\]','\[挖鼻屎\]','\[害羞\]',
    '\[猪头\]','\[花心\]','\[懒得理你\]',
    '\[左哼哼\]','\[右哼哼\]','\[嘘\]',
    '\[馋嘴\]','\[拜拜\]','\[思考\]','\[汗\]','\[睡觉\]','\[钱\]',
    '\[蛋糕\]','\[话筒\]','\[钟\]','\[蜡烛\]','\[来\]',
    '\[不要\]','\[懒得理你\]','\[阳光\]','\[g瀑汗\]',
    '\[钻戒\]','\[酒\]','\[花\]' ,'\[干杯\]','\[微风\]',
    '\[禮物\]','\[落葉\]','\[飛機\]',
    '\[饞嘴\]' ,'\[月亮\]','\[豬頭\]','\[爱心传递\]','\[沙塵暴\]',
    '\[ala囧\]','\[bed弹跳\]','\[bofu啃西瓜\]','\[cai晃头\]',
    '\[c看热闹\]','\[dx超人\]',
    '\[gbz真穿越\]','\[g脸红\]','\[g裸奔2\]','\[g挑眉\]','\[g无所谓\]',
    '\[hold住\]','\[km拜年\]',
    '\[km花癡\]','\[km相機\]','\[lb味\]',
    '\[lt五一\]','\[lxhx逗转圈\]','\[lxhx滚过\]',
    '\[TAIWAN\]','\[TAIWAN\]','\[toto我最搖滾\]',
    '\[奧特曼\]','\[被电\]','\[冰棍\]','\[茶\]','\[吃驚\]','\[冲锋\]',
    '\[飞机\]','\[非你莫属\]','\[风扇\]',           
    '\[国旗\]','\[好囧\]','\[洪水\]','\[咖啡\]',
    '\[蠟燭\]','\[來\]','\[懶得理你\]','\[禮花\]',
    '\[六一快乐\]','\[龙卷风\]','\[路过这儿\]','\[落叶\]',
    '\[绿丝带\]','\[冒个泡\]','\[玫瑰\]','\[男孩儿\]','\[南京\]','\[噢耶\]',
    '\[拍手\]','\[霹雳\]','\[汽车\]','\[汽车\]',
    '\[群体围观\]','\[沙尘暴\]','\[闪电\]','\[圣诞铃铛\]','\[聖誕樹\]',
    '\[书呆子\]','\[帅\]','\[台风\]','\[太陽\]','\[叹号\]','\[跳舞花\]',
    '\[哇哈\]','\[圍觀\]','\[温暖帽子\]','\[小丑\]',
    '\[熊貓\]','\[羞嗒嗒\]','\[雪\]','\[叶子\]','\[音乐\]',
    '\[右边亮了\]','\[照相机\]','\[震撼\]','\[正片\]',
    '\[织\]','\[抓沙發\]','\[转载\]','\[自行车\]','\[足球\]',
    '\[懒得理你\]','\[ali顶起\]','\[ali扑倒\]','\[ali哇\]',
    '\[bed奔跑\]','\[bed扯\]','\[bobo拜年\]','\[bobo拋媚眼\]','\[bofu咸蛋超人\]',
    '\[cai肚腩\]','\[candy爱不单行\]','\[cc撞墙\]',
    '\[c捂脸\]','\[c疑惑\]','\[din害羞\]','\[g摇手\]',
    '\[lt雷\]','\[lt挖鼻\]','\[lt羞\]','\[lt中枪\]','\[lt转发\]',
    '\[lt轉發\]','\[lxhx奔跑\]','\[lxhx逗轉圈\]','\[lxhx逗左右\]',
    '\[lxhx滾過\]','\[lxhx喵\]','\[lxhx跳跃\]','\[nono水汪汪\]','\[orz\]',
    '\[xb小花\]','\[愛心傳遞\]','\[奥运金牌\]','\[奧運金牌\]',
    '\[白云\]','\[拜年\]','\[拜年了\]','\[鞭炮\]','\[变花\]',
    '\[冰雹\]','\[不好意思\]','\[不要啊\]','\[彩虹\]','\[扯脸\]',
    '\[吃饭\]','\[呲牙\]','\[大巴\]','\[带感\]','\[帶感\]','\[电话\]','\[多云转晴\]',
    '\[发嗲\]','\[房子\]','\[非常汗\]','\[粉红丝带\]',
    '\[浮雲\]','\[勾引\]','\[互相膜拜\]','\[花痴闪闪\]','\[話筒\]','\[回放\]',
    '\[交给我吧\]','\[脚印\]','\[酒壶\]','\[巨蟹\]','\[康乃馨\]',
    '\[摳鼻屎\]','\[雷锋\]','\[礼花\]','\[流星\]','\[伦敦奥火\]','\[膜拜了\]','\[牛\]',
    '\[女孩儿\]','\[拍照\]','\[跑\]','\[汽車\]','\[强壮\]',
    '\[拳头\]','\[拳头\]','\[拳头\]','\[揉\]','\[撒花\]','\[色眯眯\]',
    '\[哨子\]','\[射手座\]','\[神馬\]','\[圣诞老人\]','\[圣诞树\]','\[聖誕老人\]','\[手套\]',
    '\[甩甩手\]','\[太阳\]','\[淘气\]','\[天使\]','\[天天向上\]',
    '\[天蝎\]','\[天蝎座\]','\[听音乐\]','\[同意\]','\[推荐\]','\[万圣节\]','\[围脖\]',
    '\[我爱听\]','\[瞎眼\]','\[下雨\]','\[鲜花\]','\[相机\]',
    '\[星星眼\]','\[噓\]','\[雪人\]','\[驯鹿\]',
    '\[鸭梨\]','\[葉子\]','\[一头竖线\]','\[音乐盒\]','\[愚人节\]','\[雨伞\]','\[运气中\]',
    '\[招财\]','\[抓沙发\]','\[轉發\]',
    '\[自己闲人\]','\[最右\]','\[草泥马\]','\[疑問\]','\[疑问\]','\[挖鼻屎\]'
]
biaoqingfu = ['\[bed凌乱\]','\[bed淩亂\]','\[打哈氣\]','\[lxhx泪目\]','\[lxhx淚目\]',
'\[猥瑣\]','\[淚\]','\[淚流滿面\]', '\[j疯了\]','\[g震惊\]','\[打哈气\]','\[怕怕\]',
'\[din推撞\]','\[xb压力\]','\[悲催\]','\[崩潰\]',
'\[泪\]','\[打哈欠\]','\[怒\]','\[哼\]','\[傷心\]','\[上火\]',
'\[可怜\]','\[吃惊\]', '\[生病\]','\[闭嘴\]','\[bobo纠结\]',
'\[鄙视\]','\[衰\]','\[委屈\]','\[吐\]','\[惊讶\]',
'\[晕\]','\[抓狂\]','\[悲伤\]','\[黑线\]','\[阴险\]','\[怒骂\]','\[伤心\]',
'\[失望\]','\[弱\]','\[骷髅\]','\[怒駡\]','\[g头晕\]','\[lb糟糕\]',
'\[悲傷\]','\[惊恐\]','\[恐怖\]','\[困\]','\[km好餓\]',
'\[泪流满面\]','\[冷\]','\[流泪\]','\[怒吼\]','\[猥琐\]','\[陰險\]',
'\[din抓狂\]','\[j吐血\]','\[g爆哭\]','\[lt黑线\]','\[鄙視\]',
'\[飙泪中\]','\[愤怒\]','\[憤怒\]','\[感冒\]','\[黑線\]','\[困死了\]',
'\[可怜的\]','\[咆哮\]','\[咒骂\]','\[最差\]',
'\[不想上班\]','\[可憐\]','\[bofu怒\]','\[xb哭\]'
]
biaoqingzheng = ['\[奮鬥\]','\[mua\]','\[high\]','\[c期待\]','\[c甩舌头\]',
'\[c坏笑\]','\[c卖萌\]','\[哇哈\]','\[美好\]','\[鬼脸\]','\[好棒\]',
'\[好的\]','\[得瑟\]','\[愛你哦\]','\[好喜欢\]','\[ali加油\]',
'\[bed撒娇\]','\[萌\]','\[萌萌抠鼻\]',
    '\[萌萌扭屁股\]', '\[给劲\]','\[給力\]','\[顶\]','\[哎呦熊感动\]','\[j撒娇\]','\[nonokiss\]','\[ppb鼓掌\]','\[啦啦啦啦\]','\[喜得金牌\]','\[笑哈哈\]','\[得意地笑\]','\[ali做鬼脸\]','\[bm可爱\]',
'\[威武\]','\[给力\]','\[嘻嘻\]','\[哈哈\]','\[可爱\]','\[赞\]','\[cai開心\]',
'\[偷笑\]','\[抱抱\]','\[酷\]','\[挤眼\]','\[太开心\]','\[心\]',
'\[爱你\]', '\[ok\]','\[亲亲\]','\[耶\]',
'\[鼓掌\]',	'\[good\]','\[愛你\]','\[gst耐你\]','\[愛你\]','\[握手\]',
'\[做鬼臉\]','\[din鬼脸\]','\[haha\]','\[帅爆\]','\[帥\]','\[太開心\]',
'\[春暖花开\]','\[坏笑\]','\[加油\]','\[好爱哦\]','\[好得意\]',
'\[开心\]','\[可愛\]','\[乐乐\]','\[亲一口\]','\[親親\]',
'\[喜\]','\[贊\]','\[cai开心\]','\[cai太好了\]','\[j浪笑\]',
'\[km爱你\]','\[lb嘻\]','\[爱\]','\[爱你哦\]','\[愛\]','\[放假啦\]',
'\[必胜\]','\[大笑\]','\[許願\]','\[激动\]','\[擠眼\]','\[加油啊\]','\[din爱你\]',
'\[亲\]','\[親一口\]','\[偷乐\]','\[喜欢你\]'
]

import os
neg =[0,0,0,0,0,0,0]
pos =[0,0,0,0,0,0,0]
f = open('mysite/sentiment/weibo_content.txt','r')
output = open('mysite/sentiment/weibo_feature.txt','wb')
line = f.readline()
linecounter = 0
while line:
    linecounter += 1
    linetext = line.split()
    #print linecounter
    #print ':'+line
    #os.system("pause")
    #output.write(linetext[0] + ' ')
    text = ''
    for i in range(0,len(linetext)):
        text += linetext[i]
    #print text
    text = text.strip()
    #print type(text)
    emoneu = 0
    for emoticon in biaoqingzhong:
        if re.search(emoticon,text):
            emoneu += 1
    emopos = 0
    for emoticon in biaoqingzheng:
        if re.search(emoticon,text):
            emopos += 1
    emoneg = 0
    for emoticon in biaoqingfu:
        if re.search(emoticon,text):
            emoneg += 1
    output.write(str(emopos) + ' ' + str(emoneu) + ' '+ str(emoneg) + ' ')
    #print str(emopos) + ' ' + str(emoneu) + ' '+ str(emoneg)
    if text == '':
        for i in range(0,14):
            output.write('0 ')
        output.write('\n')
        line = f.readline()
        continue
    #print text
    for i in range(0,7):
            neg[i] = 0
            pos[i] = 0
    try:
        result = urllib2.urlopen("%sapi_key=%s&text=%s&format=%s&pattern=%s" % (url_get_base,api_key,text,format,pattern))
        content = result.read().strip()
        jsoninfo = json.loads(content)
        for words in jsoninfo[0]:
            #print content
            for word in words:
                #print word['cont']
                acword = word['cont'].encode('utf-8')
                flag = 0
                if (word["pos"] == 'v') or (word["pos"] == 'a'):
                   #print word['cont'] 
                   if (acword in positive) or (acword in negative):
                       #print "inside "
                       #print word['cont']
                       if acword in positive:
                           flag = 1
                       else:
                           flag = 2
                       args = word['arg']
                       num = 0
                       level = 100
                       for arg in args:
                           for j in range(arg['beg'],arg['end']+1):
                               tw = words[j]
                               actw = tw['cont'].encode('utf-8')
                               if actw in deny:
                                   num += 1
                               tr = judgelevel(actw)
                               if tr < level:
                                   level = tr
            
                       if (flag == 1 and num %2 == 1) or (flag == 2 and num%2 == 0):
                           #negtive                   
                           if level <100:
                               neg[level] +=1
                           else:
                               neg[0] += 1
                           #print "neg"
                       else:
                            #positive
                            if level <100:
                                pos[level] +=1
                            else:
                                pos[0] += 1
                            #print "pos"
    except:
        print "httperror"
    for i in range(0,7):
        output.write(str(pos[i]) + ' ')
    for i in range(0,7):
        output.write(str(neg[i]) + ' ')
    output.write('\n')
    #print pos
    #print neg
    line = f.readline()
f.close()
output.close()

                
            
                       
                       
                   
            
        
        
            
    
    
    
    

