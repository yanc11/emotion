try
clear
include
fid=fopen('attr41.txt','r');
class_type = fscanf(fid,'%d',1);
attr = fscanf(fid,'%d',1);
load(['network/network-' num2str(class_type) '-' num2str(attr) '.mat']);
load(['thetaOpt/thetaOpt-' num2str(class_type) '-' num2str(attr) '.mat']);
%load thetaPre-2014-07-10-19-01-21-281.mat;

if attr==0
    attr_num=0;
elseif attr==1
    attr_num=3;
elseif attr==2
    attr_num=21;
else
    attr_num=24;
end


[testData,COUNT] = fscanf(fid,'%f',17+attr_num);
fclose(fid);

%testData=[1 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]';
result = SAEFeedForward(thetaOpt, testData, network, []);
[notcare, res] = max(result);
if class_type==2
    res=res*10+res;
end
fid=fopen('predict_res.txt','w');
fprintf(fid,'%d',res);
fclose(fid);
exit;
catch
fprintf('error in matlab');
if class_type==6
    fid=fopen('predict_res.txt','r');
    res_old=fscanf(fid,'%d',1);
    fclose(fid);
    if res_old>9
        fid=fopen('predict_res.txt','w');
        fprintf(fid,'%d',1);
        fclose(fid);
    end
end
exit;
end
