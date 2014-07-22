function bind_hover() {
    $('#start').hover(
            function(){
                $(this).addClass('hover');
                $(this).removeClass('unhover');
            },  
            function(){
                $(this).addClass('unhover');
                $(this).removeClass('hover');
            });
}

function bind_start() {
    $('#start').bind('click', function(){
        //window.location.href = '/static/web/view.html'
        window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=471383603&response_type=code&redirect_uri=http://weibo.emotionanalyser.com/api/code';
    });
}
$(document).ready(function(){
    bind_hover();
    bind_start();
    bind_homepage();
});
