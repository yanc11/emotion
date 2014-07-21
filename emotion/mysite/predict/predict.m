close all
clear
include
load network.mat;
load thetaOpt-2014-07-10-19-20-39-048.mat;
%load thetaPre-2014-07-10-19-01-21-281.mat;

fid=fopen('attr41.txt','r');
[testData,COUNT] = fscanf(fid,'%d',41);
fclose(fid);
%testData=[1 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]';
result = SAEFeedForward(thetaOpt, testData, network, []);
if result(1)>result(2)
    res=11;
else
    res=22;
end
fid=fopen('predict_res.txt','w');
fprintf(fid,'%d',res);
fclose(fid);
