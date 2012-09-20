$(document).ready(function() {
    $('.main-icon').click(function(){
        $('.main-icon').removeClass('active');
        $('.subcategory').removeClass('active');
        $(this).addClass('active');
        $(this).next('.subcategory').addClass('active');
    });
    $('.schedule-transport li').click(function(){
        $('.schedule-transport li').removeClass('active');
        $(this).addClass('active');
    });
    $('.schedule-btn-sh').click(function() {

        if($('.schedule-btn-sh').hasClass('hide')) {
            $(this).removeClass('hide').addClass('show');
            $(this).parent().next('.schedule-table').slideUp();
        } else {
            $(this).removeClass('show').addClass('hide');
            $(this).parent().next('.schedule-table').slideDown();
        }
    });
    $('input[type="text"]').focus(function(){
        $(this).val('');

    });
    $('input [type="text"]').blur(function(){

    });

    $('.poster-wrap dd a').click(function(){
        $('.poster-wrap dd').removeClass('active');
        $('.poster-wrap dt').hide();
        $(this).parent().addClass('active');
        $(this).parent().prev().show();

    });
    $('.poster-category a').click(function(){
        $('.poster-category a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });
    $('.news-wrap dd a').click(function(){
        $('.news-wrap dd').removeClass('active');
        $('.news-wrap dt').hide();
        $(this).parent().addClass('active');
        $(this).parent().prev().show();

    });
    $('.news-category a').click(function(){
        $('.news-category a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });

    $('.open-modal').click(function() {
        $('.modal').hide();
        $(this).next('.modal').show();
    });
    $('.close-modal').click(function() {
        $(this).parent('.modal').hide();
    });

    $('.ui-work-bg').click(function (){
        if($('.ui-work-item').hasClass('on')) {
            $('.ui-work-item').removeClass('on').addClass('off');
        } else {
            $('.ui-work-item').removeClass('off').addClass('on');
        }
    });
    $('.object-list-filter a').click(function (){
        $('.object-list-filter a').removeClass('active');
        $(this).addClass('active');
    });


    $('.tabs a').click(function (){
        $('.tabs a').removeClass('active');
        $(this).addClass('active');
    });
    $('.open-lunch-info').hover(
        function(){
            $(this).next('.lunch-info').show();
        },
        function(){
            $(this).next('.lunch-info').hide();
        }
    );
    $(document).ready(function() {
        $('.rating-stars').ratings(5).bind('ratingchanged', function(event, data) {
           $(this).next('b').html(data.rating);
        });
    });

});
