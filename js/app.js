app = {

    objects:[],

    transport:{
        startStation:{
            firstBus:'ул. Гудкова',
            secondBus:'м. Кузьминки',
            firstTrain:'ОТДЫХ',
            secondTrain:'ВЫХИНО'
        },
        transportLimit:5,
        transportType:'train',
        transportRefreshInterval:60000, //1 min


        buildTransportForm:function () {
            if (app.getCookie('transType')) {
                app.transport.transportType = app.getCookie('transType');
            }

            $('body').click(function () {
                $('.gray-input.schedule-from input, .gray-input.schedule-to input').removeClass('active');
                $('.drop-list').remove();
                $('.schedule-table').removeClass('gray');
            });

            $('.schedule-btn-sh').click(function () {
                if ($('.schedule-btn-sh').hasClass('hide')) {
                    $(this).removeClass('hide').addClass('show');
                    $(this).parent().next('.schedule-table').slideUp();
                } else {
                    $(this).removeClass('show').addClass('hide');
                    $(this).parent().next('.schedule-table').slideDown();
                    app.transport.layoutTransportList();
                }
            });

            if (app.transport.transportType == 'bus') {
                $('li.schedule-transport-bus').addClass('active');
                $('.gray-input.schedule-from input').val(app.transport.startStation.firstBus);
                $('.gray-input.schedule-to input').val(app.transport.startStation.secondBus);
            }

            if (app.transport.transportType == 'train') {
                $('li.schedule-transport-train').addClass('active');
                $('.gray-input.schedule-from input').val(app.transport.startStation.firstTrain);
                $('.gray-input.schedule-to input').val(app.transport.startStation.secondTrain);
            }

            $('.gray-input.schedule-from input').bind('focus',
                function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('.drop-list').remove();
                    $('.gray-input.schedule-to input').removeClass('active');
                    if ($(this).val().length > 0 && !$('.gray-input.schedule-from input.active').length) {
                        this.select();
                        app.transport.showHelper('from', true);
                    }
                    if ($(this).val().length == 0) {
                        app.transport.showHelper('from');
                    }
                    $(this).addClass('active');
                }).mouseup(
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

            $('.gray-input.schedule-to input').bind('focus',
                function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('.drop-list').remove();
                    $('.gray-input.schedule-from input').removeClass('active');
                    if ($(this).val().length > 0 && !$('.gray-input.schedule-to input.active').length) {
                        this.select();
                        app.transport.showHelper('to', true);
                    }
                    if ($(this).val().length == 0) {
                        app.transport.showHelper('to');
                    }
                    $(this).addClass('active');
                }).mouseup(
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

            $('.gray-input.schedule-from input').bind('keyup', function (e) {
                console.log(e);
                e.stopPropagation();
                e.preventDefault();
                if (e.keyCode != 13) {
                    if ((e.keyCode > 45 && e.keyCode < 91) || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 0) {
                        app.transport.showHelper('from');
                    }
                } else {
                    if ($('.drop-list div').length > 0) {
                        $('.schedule-from input').val($('.drop-list div.focus').text());
                    }
                    $('.drop-list').remove();
                    $('.schedule-table').removeClass('gray');
                    app.transport.layoutTransportList();
                }
            });
            $('.gray-input.schedule-to input').bind('keyup', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (e.keyCode != 13) {
                    if ((e.keyCode > 45 && e.keyCode < 91) || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 0) {
                        app.transport.showHelper('to');
                    }
                } else {
                    if ($('.drop-list div')) {
                        $('.schedule-to input').val($('.drop-list div.focus').text());
                    }
                    $('.drop-list').remove();
                    $('.schedule-table').removeClass('gray');
                    app.transport.layoutTransportList();
                }
            });
            $('.schedule-transport li.schedule-transport-bus').bind('click', function () {
                app.transport.transportType = 'bus';
                $('.schedule-transport li').removeClass('active');
                $(this).addClass('active');
                $('.gray-input.schedule-from input').val(app.transport.startStation.firstBus);
                $('.gray-input.schedule-to input').val(app.transport.startStation.secondBus);
                app.transport.layoutTransportList();
            });
            $('.schedule-transport li.schedule-transport-train').bind('click', function () {
                app.transport.transportType = 'train';
                $('.schedule-transport li').removeClass('active');
                $(this).addClass('active');
                $('.gray-input.schedule-from input').val(app.transport.startStation.firstTrain);
                $('.gray-input.schedule-to input').val(app.transport.startStation.secondTrain);
                app.transport.layoutTransportList();
            });
            app.transport.layoutTransportList();

            app.transport.tranportRefresh = window.setInterval(function () {
                if (!$('.drop-list').length) {
                    app.transport.layoutTransportList();
                }
            }, app.transport.transportRefreshInterval);
        },

        showHelper:function (direction, full) {
            var selector = '.gray-input.schedule-' + direction;
            $('.drop-list').remove();
            if (!$(selector + ' div')[0]) {
                $('<div class="drop-list"></div>').appendTo(selector);
            }
            var query = $(selector + ' input').val();
            var type = app.transport.transportType;
            $('.schedule-table').addClass('gray');
            $(selector + ' div').empty();
            for (var i = 0; i < app.transport_stations.length; i++) {
                var item = app.transport_stations[i]
                if (item.type == type) {
                    if ((item.title.toLowerCase().indexOf(query.toLowerCase()) + 1) || (!query.length) || full) {
                        $(selector + ' .drop-list').append($('<div></div>').text(item.title).click(
                            function (e) {
                                $(selector + ' input').val($(this).text());
                                $('.drop-list').remove();
                                app.transport.layoutTransportList();
                            }
                        ).mouseenter(
                            function () {
                                $('.drop-list div').removeClass('focus');
                                $(this).addClass('focus')
                            }
                        ))
                    }
                }
            }
            if ($(selector + ' .drop-list:empty')[0]) {
                $('.drop-list').remove();
            }
            $($('.drop-list div')[0]).addClass('focus')
        },

        layoutTransportList:function () {
            if (!($('.gray-input.schedule-to input').val() && $('.gray-input.schedule-from input').val())) {
                $('.schedule-table .list-row').remove();
                $('<tr class="list-row"></tr>')
                    .append($('<td colspan="3">Ничего не найдено</td>'))
                    .appendTo('.schedule-table table')
                return;
            }
            var fromVal = $('.gray-input.schedule-from input').val();
            var toVal = $('.gray-input.schedule-to input').val();
            var URL = 'http://test.zhukcity.ru/transport?act=get_schedule&type=' + app.transport.transportType + '&dep_from=' + fromVal + '&arr_to=' + toVal + '&when=today&limit=' + app.transport.transportLimit;
            $.get(URL, function (data) {
                if (data.success) {
                    if (data.items.length) {
                        app.transport.saveTransportCookie();
                        $('.schedule-table .list-row').remove();
                        for (var i = 0; i < data.items.length; i++) {
                            $('<tr class="list-row"></tr>')
                                .append($('<td>' + data.items[i].title + '</td>'))
                                .append($('<td>' + data.items[i].dep_time + '</td>'))
                                .append($('<td>' + data.items[i].arr_time + '</td>'))
                                .appendTo('.schedule-table table')
                        }
                    } else {
                        $('.schedule-table .list-row').remove();
                        $('<tr class="list-row"></tr>')
                            .append($('<td colspan="3">Ничего не найдено</td>'))
                            .appendTo('.schedule-table table')
                    }
                }
            });
        },

        saveTransportCookie:function () {
            if (app.transport.transportType == 'bus') {
                app.setCookie("transType", 'bus');
                app.setCookie("firstBus", $('.gray-input.schedule-from input').val());
                app.transport.startStation.firstBus = $('.gray-input.schedule-from input').val();
                app.setCookie("secondBus", $('.gray-input.schedule-to input').val());
                app.transport.startStation.secondBus = $('.gray-input.schedule-to input').val();
            } else {
                app.setCookie("transType", 'train');
                app.setCookie("firstTrain", $('.gray-input.schedule-from input').val());
                app.transport.startStation.firstTrain = $('.gray-input.schedule-from input').val();
                app.setCookie("secondTrain", $('.gray-input.schedule-to input').val());
                app.transport.startStation.secondTrain = $('.gray-input.schedule-to input').val();
            }
        },

        getStationFromCookie:function () {
            if (app.getCookie('firstBus'))  app.transport.startStation.firstBus = app.getCookie('firstBus');
            if (app.getCookie('secondBus')) app.transport.startStation.secondBus = app.getCookie('secondBus');
            if (app.getCookie('firstTrain')) app.transport.startStation.firstTrain = app.getCookie('firstTrain');
            if (app.getCookie('secondTrain')) app.transport.startStation.secondTrain = app.getCookie('secondTrain');
        }
    },

    menu:{
        buildMenu:function () {
            $('.subcategory a').click(function () {
                app.menu.getObjects($(this).attr('data-subcategory'));
            });
        },
        getObjects:function (id) {
            var URL = 'http://test.zhukcity.ru/map?act=get_objects&cat_ids=' + id + '&sort_by=0';
            $.get(URL, function (data) {
                if (data.success) {
                    app.curentSubcategory = id;
                    app.gmap.closeAllInfoWindows();
                    app.gmap.removeAllMarkers();
                    app.objects = [];
                    if (data.objects.length > 0) {
                        for (var i = 0; i < data.objects.length; i++) {
                            var mapItem = app.gmap.addMarker(data.objects[i]);
                            var item = {
                                data:data.objects[i],
                                mapItem:mapItem
                            };
                            app.objects.push(item);
                        }
                        app.menu.layoutSubcategoryItems();
                    }
                }
            })
        },
        buildTabs:function (activeTab) {
            var tabsControll = '<ul class="tabs">' +
                '<li class="posters"><a href="#">Афиши</a></li>' +
                '<li class="categorys"><a href="#">Категории</a></li>' +
                '<li class="news"><a href="#">Новости</a></li>' +
                '</ul>' +
                '<div class="list-filter">' +
                '<ul class="object-list-filter">' +
                '<li><a href="#" class="active">По названию</a></li>' +
                '<li><a href="#">По рейтингу</a></li>' +
                '<li><a href="#">По дате</a></li>' +
                '</ul>' +
                '<div class="work-filter">' +
                'Работает' +
                '<div class="ui-work-bg">' +
                '<span class="ui-work-item off"></span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>';
            $('<div class="filter-wrap">').html(tabsControll).appendTo('.items-list');
            $('.news').bind('click', function () {
                $(this).addClass('active');
                $('.categotys').removeClass('active');
                $('.posters').removeClass('active');
                $('.object-list-filter').empty();
            });
            $('.posters').bind('click', function () {
                $(this).addClass('active');
                $('.categotys').removeClass('active');
                $('.news').removeClass('active');
                $('.object-list-filter').empty();
            });
            $($('.filter-wrap .tabs a')[activeTab]).addClass('active');
        },

        layoutNewsItems:function () {

        },

        layoutSubcategoryItems:function () {
            $('.category-list').addClass('hide-subcategory');
            app.menu.buildTabs(1);
            for (var i = 0; i < app.objects.length; i++) {
                var item = app.objects[i];
                var listItem = $('<div class="list-item object-item" data-obj-id=' + item.data.id + '>')
                    .append($('<span class="status-work">')
                    .addClass(item.data.operating_minutes >= 0 ? 'online' : '')
                    .html(item.data.operating_minutes >= 0 ? 'работает' : 'неработает'))
                    .append($('<a href="#" class="list-item-name">')
                    .html(item.data.name))
                    .append($('<p class="list-item-info">').html(
                    'Адрес: <a href="#">' + item.data.address + '</a> <br>' +
                        'Телефон: ' + item.data.phone + '  <br>' +
                        'Сайт: <a href="#">' + item.data.website + '</a> <br>'
                ))
                    .append($('<div class="object-list-time">')
                    .append($('<ul class="object-list-time-details">')
                    .append($('<li>пн-пт: 9:00 - 18:00</li>'))
                    .append($('<li>сб: 10:00 - 15:00</li>'))
                    .append($('<li>вс: выходной</li>'))
                    .append($('<li>')
                    .html(
                    '<a class="open-lunch-info">перерывы</a>' +
                        '<div class="lunch-info">' +
                        '<table>' +
                        '<tr>' +
                        '<th>ежедневно</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>11:00 - 11:20</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>14:20 - 14:40</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>16:20 - 16:40</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th>в субботу</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>10:20 - 10:45</td>' +
                        '</tr>' +
                        '</table>' +
                        '</div>'
                ))))
                    .append($('<div class="object-item-footer">')
                    .append($('<div class="object-item-rating">')
                    .html(
                    '<span class="object-item-comments">' + item.data.n_reviews + '</span>' +
                        '<div class="rating-stars"></div>' +
                        'Рейтинг: <b>' + item.data.rating + '</b>'
                ))
                    .append($('<div class="object-item-controls">')
                    .append('<a href="#" class="gray-btn">В закладки</a>')
                    .append($('<a href="#" class="gray-btn location" data-obj-id="' + item.data.id + '" ></a>').append(
                    $('<span class="object-item-show-map"></span>')
                ))
                ));

                $('.filter-wrap').append(listItem);

            }
            $('.gray-btn.location').click(function () {
                e.preventDefault();
                e.stopPropagation();
                app.gmap.showObject($(this).attr('data-obj-id'));
            });
            $('.list-item.object-item').click(function () {
                app.menu.openObjectDetails($(this).attr('data-obj-id'));
            });
        },

        openObjectDetails:function (id) {
            $.getJSON('http://test.zhukcity.ru/map/?act=get_object&obj_id=' + id, function (data) {
                $('.list-item.object-item').remove();

                console.log(data);

                var details = $('<div class="list-item object-details">')
                    .append($('<span class="status-work">')
                    .addClass(data.operating_minutes >= 0 ? 'online' : '')
                    .html(data.operating_minutes >= 0 ? 'работает' : 'неработает'))
                    .append('<a href="#" class="list-item-name">' + data.name + '</a>')
                    .append('<p class="list-item-info">' +
                    'Адрес: <a href="#">' + data.address + '</a> <br>' +
                    'Телефон: ' + data.phone + '  <br>' +
                    'Сайт: <a href="#"> ' + data.website + ' </a> <br>' +
                    '</p>')
                    .append('<div class="object-list-time">'+
                    '<ul class="object-list-time-details">'+
                    '<li>пн-пт: 9:00 - 18:00</li>'+
                    '<li>сб: 10:00 - 15:00</li>'+
                    '<li>вс: выходной</li>'+
                    '<li><a class="open-lunch-info">перерывы</a>'+
                    '<div class="lunch-info" style="display: none; ">'+
                    '<table>'+
                    '<tbody><tr>'+
                    '<th>ежедневно</th>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>11:00 - 11:20</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>14:20 - 14:40</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>16:20 - 16:40</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<th>в субботу</th>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>10:20 - 10:45</td>'+
                    '</tr>'+
                    '</tbody></table>'+
                    '</div>'+
                    '</li>'+
                    '</ul>' +
                    '</div>')
                    .append('<div class="object-item-footer">'+
                    '<div class="object-item-rating">'+
                    '<div class="rating-stars" style="overflow: auto; "><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div></div>'+
                    'Рейтинг: <b>' + data.rating + '</b>'+
                    '</div>'+
                    '<div class="object-item-controls">'+
                    '<a href="#" class="gray-btn">В закладки</a>'+
                    '</div>'+
                    '</div>')
                    .append('<div class="object-details-gallery">')
                    .append('<p class="object-details-info">')
                    .append('<a href="#" class="gray-btn back-object-list"><span class="arrow-left"></span>К списку обьектов</a>' +
                    '<a href="#" class="gray-btn add-comment-object open-modal">Оставить отзыв</a>'+
                    '<div class="modal add-comment-modal">'+
                    '<a class="close-modal"></a>'+
                    '<div class="modal-header">'+
                    '<h3 class="modal-name">Оставить отзыв</h3>'+
                    '</div>'+
                    '<form>'+
                    '<label>'+
                    'Тема'+
                    '<div class="modal-input theme-input">'+
                    '<input type="text" value="">'+
                    '</div>'+
                    '</label>'+
                    '<label>'+
                    'Моя оценка'+
                    '<div class="rating-stars" style="overflow: auto; "><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div><div class="jquery-ratings-star"></div></div>'+
                    '</label>'+
                    '<div class="clear"></div>'+
                    '<div class="add-comment-textarea-wrap">'+
                    'Текст отзыва<br>'+
                    '<div class="add-comment-textarea">'+
                    '<textarea></textarea>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '<button class="blue-btn modal-submit">Отправить</button>'+
                    '</form>'+
                    '</div>'+
                    '<div class="clear-r"></div>'+
                    '<div class="comment-object-wrap">'+
                    '<span class="comments-object-count">Всего отзывов: <b>' + data.totalReviewsCount + '</b></span>'+
                    '<a class="show-all-comments-object" href="#">Показать все</a>'+
                    '<div class="clear-r"></div>'+
                    '<section class="comments-list">'+
                    '</section>'+
                    '</div>'+
                    '</div>')
                    .appendTo('.items-list.object-list');
                if(data.reviews.length){
                    for(var i = 0; i < data.reviews.length; i++){
                        $('<div class="comment-object-item">' +
                            ' <div class="comment-object-info">'+
                            '<a href="#" class="comment-object-name female">' + data.reviews[i].user_name + '</a>'+
                            '<span class="comment-object-date">' + data.reviews[i].date_time + '</span>'+
                            '<div class="comment-object-rating">'+
                            '<span class="comment-object-rating-minus"></span>'+
                            '<span class="comment-object-rating-plus"></span>'+
                            '<a href="#" class="comment-object-rating-rate">' + data.reviews[i].votes + '</a>'+
                            '</div>'+
                            '</div>'+
                            '<div class="comment-object-content">' +
                            '<p class="comment-object-text">' + data.reviews[i].msg_text + '</p>'+
                            '<span class="comment-object-mark">Моя оценка: <b>' + data.reviews[i].rating + '</b></span>' +
                            '<a href="#" class="comment-object-answer">Ответить</a>' +
                            '</div>' +
                            '<div class="clear-r"></div>' +
                            '</div>').appendTo('.comments-list')
                    }
                }

                $('.gray-btn.back-object-list').bind('click', function () {
                    $('.items-list').empty();
                    app.menu.layoutSubcategoryItems();
                });

                app.gmap.showObject(id);
            })
        }
    },

    gmap:{
        markers:{},
        startPosition:{
            lat:55.598135,
            lng:38.113778,
            zoom:12
        },
        initMap:function () {
            $('<div id="mapContainer"></div>').css('width', '100%').css('height', '100%').css('z-index', '1')
                .appendTo('.map');
            var startOptions = {
                mapTypeControl:true,
                zoom:12,
                center:new google.maps.LatLng(app.gmap.startPosition.lat, app.gmap.startPosition.lng),
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            app.gmap.map = new google.maps.Map(window.document.getElementById('mapContainer'), startOptions);
        },
        addMarker:function (object) {
            var marker = new google.maps.Marker({
                position:new google.maps.LatLng(object.latitude, object.longitude),
                icon:'images/marker.1.png',
                map:app.gmap.map,
                title:"Hello World!"
            });

            var infoString = '<div class="object-onmap-wrap">' +
                '<div class="onmap-arrow"></div>' +
                '<div class="object-onmap-header">' +
                '<h4 class="object-onmap-name">' + object.name + '</h4>' +
                '<div class="onmap-comment-count">' + object.n_reviews + '</div>' +
                '</div>' +
                '<div class="object-onmap-content">' +
                'Категория: <a href="#">Банки</a> <br>' +
                'Адрес: <a href="#">' + object.address + '</a> <br>' +
                'Телефон: ' + object.phone +
                '</div>' +
                '<div class="object-onmap-time">' +
                object.worktime +
                '</div>' +
                '<div class="object-onmap-footer">' +
                '<span class="object-onmap-rating">Рейтинг: <b>' + object.rating + '</b></span>' +
                '<a href="#" class="object-onmap-comment">Оставить отзыв</a>' +
                '</div>' +
                '</div>';

            var box = document.createElement("div");
            box.style.cssText = "";
            box.innerHTML = infoString;

            var infoBoxOptions = {
                content:box,
                maxWidth:0,
                pixelOffset:new google.maps.Size(-100, -40),
                zIndex:null,
                alignBottom:true,
                boxStyle:{
                    height:"auto",
                    opacity:1,
                    width:"200px"
                },
                closeBoxMargin:"5px 5px 2px 2px",
                closeBoxURL:"http://www.google.com/intl/en_us/mapfiles/close.gif",
                infoBoxClearance:new google.maps.Size(1, 1),
                isHidden:false,
                pane:"floatPane",
                enableEventPropagation:false
            };

            var infoBox = new InfoBox(infoBoxOptions);

            google.maps.event.addListener(marker, 'click', function () {
                app.gmap.closeAllInfoWindows();
                infoBox.open(app.gmap.map, marker);
            });

            var item = {
                marker:marker,
                infoBox:infoBox
            };

            return item;
        },

        showObject:function (id) {
            for (var i = 0; i < app.objects.length; i++) {
                if (app.objects[i].data.id == id) {
                    app.gmap.closeAllInfoWindows();
                    app.objects[i].mapItem.infoBox.open(app.gmap.map, app.objects[i].mapItem.marker);
                    app.gmap.map.setCenter(new google.maps.LatLng(app.objects[i].data.latitude, app.objects[i].data.longitude));
                }
            }
        },

        closeAllInfoWindows:function () {
            for (var i = 0; i < app.objects.length; i++) {
                app.objects[i].mapItem.infoBox.close();
            }
        },

        removeAllMarkers:function () {
            for (var i = 0; i < app.objects.length; i++) {
                console.log(app.objects[i].mapItem.marker);
                app.objects[i].mapItem.marker.setMap(null);
            }
        }
    },

    init:function () {
        app.transport.getStationFromCookie();
        app.transport.buildTransportForm();
        app.gmap.initMap();
        app.menu.buildMenu();
    },

    setCookie:function (name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    },

    getCookie:function (name) {
        var cookie = " " + document.cookie;
        var search = " " + name + "=";
        var setStr = null;
        var offset = 0;
        var end = 0;
        if (cookie.length > 0) {
            offset = cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = cookie.indexOf(";", offset);
                if (end == -1) {
                    end = cookie.length;
                }
                setStr = unescape(cookie.substring(offset, end));
            }
        }
        return(setStr);
    }
};
