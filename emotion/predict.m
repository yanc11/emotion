try
include
fid=fopen('attr41.txt','r');
all_attr = fscanf(fid,'%f',41);
fclose(fid);
shunxu=[1,1,2,2];
fid=fopen('predict_res.txt','w');

for class_type=2:4:6
for i=0:1:3
if class_type==6
    attr=shunxu(i+1);
else
    attr=i;
end


load(['network/network-' num2str(class_type) '-' num2str(attr) '.mat']);
load(['thetaOpt/thetaOpt-' num2str(class_type) '-' num2str(attr) '.mat']);

if attr==0
    testData=all_attr(1:17);
elseif attr==1
    testData=[all_attr(1:17);all_attr(39:41)];
elseif attr==2
    testData=all_attr(1:38);
else
    testData=all_attr;
end

result = SAEFeedForward(thetaOpt, testData, network, []);
[notcare, res] = max(result);
if class_type==2
    res=res*10+res;
end

fprintf(fid,'%d ',res);
if class_type==2
    fprintf(fid,'%f %f\n',result(1),result(2));
else
    fprintf(fid,'%f %f %f %f %f %f\n',result(1),result(2),result(3),result(4),result(5),result(6));
end

end
end





fclose(fid);

catch
    fprintf('error in matlab');
end
exit;
