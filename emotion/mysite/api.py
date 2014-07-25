# -*- encoding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from weibo import APIClient
import urllib2
import json
import re
import os
import time
import numpy
basetime = 1325347200
adaytime = 86400
APP_KEY = '471383603'
APP_SECRET = '3bb8250c98409cb5d36202cb1e7078f9'
CALLBACK_URL = 'http://weibo.emotionanalyser.com'
WEIBOS=[]

import urllib
import cStringIO
import Image
from ctypes import *
def getArtAttribute(url):
    try:
        file = cStringIO.StringIO(urllib.urlopen(url).read())
        img = Image.open(file)
        img=img.convert('RGB')
        img.save('tmp.jpg')
        lib=CDLL("/home/yanchen/libArtAttribute.so")
        lib.getArtAttribute.restype=c_char_p
        lib.getArtAttribute.argtype=c_char_p
        st=lib.getArtAttribute('tmp.jpg')
        return st.replace(',',' ')
    except:
        return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "


def get_query(request):
    if request.method == 'GET':
        return request.GET
    else:
        return request.POST

def get_session(request):
    return request.session.get('uid', None), \
            request.session.get('access_token', None), \
            request.session.get('expires_in', None)

def homepage(request):
    return HttpResponse('<html><head><title>EmotionAnalysis</title><meta property="wb:webmaster" content="bf95619774c33c6c" /></head><body><script type="text/javascript">window.location.href="/static/web/homepage.html"</script></body></html>')

def code(request):
    if not request.GET.has_key('code'):
        return HttpResponse('<html><head><title>EmotionAnalysis</title><meta property="wb:webmaster" content="bf95619774c33c6c" /></head><body><script type="text/javascript">window.location.href="/static/web/homepage.html"</script></body></html>')
    code = request.GET['code']
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    r = client.request_access_token(code)
    request.session['uid'] = r.uid
    request.session['access_token'] = r.access_token
    request.session['expires_in'] = r.expires_in
    return HttpResponse('<html><head><title>EmotionAnalysis</title><meta property="wb:webmaster" content="bf95619774c33c6c" /></head><body><script type="text/javascript">window.location.href="/static/web/view.html"</script></body></html>')

def check_token(uid, token, exp):
    if (uid == None): 
        return True
    if (int(time.time()) > int(exp)):
        request.session['uid'] = None
        request.session['access_token'] = None
        request.session['expires_in'] = None
        return True
    return False

def logout(request):
    request.session['uid'] = None
    request.session['access_token'] = None
    request.session['expires_in'] = None
    return HttpResponse(json.dumps({}))

def get_weibo_by_uid(uid, access_token, expires_in):
    print uid
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    client.set_access_token(access_token, expires_in)
    result = client.statuses.user_timeline.get(uid=uid,count=200)
    weibo = result.get("statuses")
    return weibo

def lastweibo(request):
    try:
        print "getin last weibo"
        query = get_query(request)
        cur_num = int(query['num'])
        print cur_num
        if cur_num <= 1:
            return HttpResponse(json.dumps({'success': 0}))
        cur_num = cur_num-1
        #print WEIBOS
        result = WEIBOS[cur_num-1]
        return HttpResponse(json.dumps({'success': 1, 'content': result,'num':cur_num}))
    except Exception as e:
        print e
        return HttpResponse(json.dumps({'success': 0}))

def getweibo(request):
    try:
        print "getweibo!!!!"
        uid, token, exp = get_session(request)
        if (check_token(uid, token, exp)):
            print "token expired"
            return HttpResponse(json.dumps({'success': -1}))
        query = get_query(request)
        print "before get weibo by id"
        weibos = get_weibo_by_uid(uid, token, exp)
        global WEIBOS 
        WEIBOS = weibos
        cur_num = int(query['num']);
        if cur_num >= len(weibos):
            #cur_num = cur_num
            return HttpResponse(json.dumps({'success': 0}))
        else:
            cur_num = cur_num+1
        #print weibos
        result = weibos[cur_num-1]
        return HttpResponse(json.dumps({'success': 1,'content': result,'num':cur_num}))
    except Exception as e:
        print e
        return HttpResponse(json.dumps({'success': 0}))

def test(request):
    return HttpResponse('<meta property="wb:webmaster" content="9e0dbd85c9f959fe" />')

def parsetext(content):
    print "start parsing"
    save = open("mysite/sentiment/weibo_content.txt",'wb')
    #print type(content.encode('utf-8'))
    save.write(content.encode('utf-8'))
    save.close()
    os.system("python mysite/gettextfeatures.py")
    f = open('mysite/sentiment/weibo_feature.txt','r')
    res = f.readline()
    f.close()
    #res = res.split()
    #res = [int(res) for res in res]
    return res

def get_img_attr(src):
    img_attr = getArtAttribute(src) + " "
    return img_attr

def get_soc_attr(n1,n2,n3):
    soc_attr = "0 0 0 "
    if len(WEIBOS)>0:
        zan=[]
        pinglun=[]
        zhuanfa=[]
        for weibo in WEIBOS:
            z=weibo['attitudes_count']
            pl=weibo['comments_count']
            zf=weibo['reposts_count']
            if weibo.has_key('retweeted_status'):
                z=z+weibo['retweeted_status']['attitudes_count']
                pl=pl+weibo['retweeted_status']['comments_count']
                zf=zf+weibo['retweeted_status']['reposts_count']
            zan.append(z)
            pinglun.append(pl)
            zhuanfa.append(zf)
        m1=numpy.mean(pinglun)
        v1=numpy.var(pinglun)
        m2=numpy.mean(zhuanfa)
        v2=numpy.var(zhuanfa)
        m3=numpy.mean(zan)
        v3=numpy.var(zan)
        vc1=(n1-m1)*(n1-m1)/v1
        vc2=(n2-m2)*(n2-m2)/v2
        vc3=(n3-m3)*(n3-m3)/v3
        soc_attr=str(vc1)+' '+str(vc2)+' '+str(vc3)+' '
    return soc_attr


def predict(request):
    try:
        print "getin predict"
        query = get_query(request)
        weibo = query['weibo']
        #class_type = int(query['class_type'])
        #attr_type = int(query['attr_type'])
        text_attr = parsetext(weibo)
        print "parse over"
        save = open("attr41.txt",'wb')
        img_attr = get_img_attr(query['img'])
        print img_attr
        #print query['social']
        soc_attr = get_soc_attr(int(query['pl']),int(query['zf']),int(query['z']))
        print 'socail:'+soc_attr
        other_attr = img_attr + soc_attr
        save.write(text_attr+other_attr);
        save.close()
        #os.system("cd mysite/predict")
        #os.system("matlab -nojvm -nodesktop -nodisplay -r predict")
        os.system("./../../../../lijingbei/bin/matlab -nojvm -nodesktop -nodisplay -r predict")
        #time.sleep(3)
        #os.system("cd ../..")
        result = {}
        f = open('predict_res.txt','r')
        #result = f.readline()
        #result = result.split(' ')
        for i in range(4):
            tmp = f.readline().strip('\n').split(' ')
            result['2'+str(i)]=tmp
        for i in range(4):
            tmp = f.readline().strip('\n').split(' ')
            result['6'+str(i)]=tmp
        f.close()
        print result
        #print "parse over!!"
        return HttpResponse(json.dumps({'success': 1, 'result':result}))
    except Exception as e:
        print e
        return HttpResponse(json.dumps({'success': 0}))

def get_stress(request):
    try:
        query = get_query(request)
        uid = query['uid']
        def work(uid):
            return 0.5
        result = work(uid)
        return HttpResponse(json.dumps({'success': 1, 'stress': result}))
    except:
        return HttpResponse(json.dumps({'success': 0}))

def get_stress_by_time(request):
    print 'get in dailyemotion'
    try:
        query = get_query(request)
        uid, f, u = query['uid'], int(query['from']), int(query['until'])
        def work(uid, f, u):
            fid2 = open('mysite/dailyemotion/dailyemotion2.txt','r')
            fid6 = open('mysite/dailyemotion/dailyemotion6.txt','r')
            #timestamp = []
            ret=[]
            for ii in range(f-1):
                fid2.readline()
                fid6.readline()
            for ii in range(u-f+1):
                res2 = fid2.readline()
                res6 = fid6.readline()
                res2 = res2.split()
                res6 = res6.split()
                res2 = [int(res) for res in res2]
                res6 = [int(res) for res in res6]
                ret.append((basetime+adaytime*(f-1+ii), res2[0], res2[1], res6[0], res6[1], res6[2], res6[3], res6[4], res6[5]))
                #pos.append(res[0])
                #neg.append(res[1])
            fid2.close()
            fid6.close()
            return ret#[(1404144000, 0.5), (1404230400, 0.7), (1404316800, 0.6), \#(1404403200, 0.4), (1404489600, 0.5), (1404576000, 0.9), (1404662400, 0.7)]
        result = work(uid, f, u)
        result = [{'time': t, 'pos': pos, 'neg':neg,'anger':anger,'disgust':disgust,'fear':fear,'happy':happy,'sad':sad,'surprise':surprise} for t, pos, neg, anger,disgust,fear,happy,sad,surprise in result]
        #print result
        return HttpResponse(json.dumps({'success': 1, 'data': result}))
    except Exception as e:
        print e
        return HttpResponse(json.dumps({'success': 0}))

def get_reason(request):
    try:
        query = get_query(request)
        uid, limit = query['uid'], int(query.get('limit', 10000))
        def work(uid, limit):
            return [('no girlfriend', 0.5), ('work', 0.4)]
        result = work(uid, limit)
        result = [{'reason': x, 'weight': y} for x, y in result]
        return HttpResponse(json.dumps({'success': 1, 'data': result}))
    except:
        return HttpResponse(json.dumps({'success': 0}))

def get_keyword(request):
    try:
        query = get_query(request)
        uid, limit = query['uid'], int(query.get('limit', 10000))
        def work(uid, limit):
            return [('busy', 0.7), ('work hard', 0.6), ('tired', 0.3), ('dog', 0.2)]
        result = work(uid, limit)
        result = [{'keyword': x, 'weight': y} for x, y in result]
        return HttpResponse(json.dumps({'success': 1, 'data': result}))
    except:
        return HttpResponse(json.dumps({'success': 0}))

