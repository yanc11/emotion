# -*- encoding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
import urllib2
import json
import re
import os
import time
basetime = 1325347200
adaytime = 86400

def get_query(request):
    if request.method == 'GET':
        return request.GET
    else:
        return request.POST

def test(request):
    return HttpResponse('<meta property="wb:webmaster" content="9e0dbd85c9f959fe" />')

def parsetext(content):
    #print "start parsing"
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


def getweibo(request):
    try:
        print "getweibo!!!!"
        query = get_query(request)
        result = "今天天气真好！[哈哈]"
        return HttpResponse(json.dumps({'success': 1, 'content': result}))
    except:
        return HttpResponse(json.dumps({'success': 0}))

def predict(request):
    try:
        #print "getin"
        query = get_query(request)
        weibo = query['weibo']
        class_type = int(query['class_type'])
        attr_type = int(query['attr_type'])
        text_attr = parsetext(weibo)
        print "parse over"
        save = open("attr41.txt",'wb')
        if attr_type == 0:
            other_attr = ""
        elif attr_type == 1:
            other_attr = "0 0 0"
        elif attr_type == 2:
            other_attr = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
        else:
            other_attr = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
        save.write(str(class_type)+' '+str(attr_type)+' '+text_attr+other_attr);
        save.close()
        #os.system("cd mysite/predict")
        os.system("matlab -nojvm -nodesktop -nodisplay -r predict")
        time.sleep(3)
        #os.system("cd ../..")
        f = open('predict_res.txt','r')
        result = f.readline()
        f.close()
        print result
        #print "parse over!!"
        return HttpResponse(json.dumps({'success': 1, 'result':result}))
    except:
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

