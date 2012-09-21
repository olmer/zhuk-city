app = {
  page:{
    startStation:{
      firstBus:'ул. Гудкова',
      secondBus:'м. Кузьминки',
      firstTrain:'ОТДЫХ',
      secondTrain:'ВЫХИНО'
    },
    transportLimit: 5,
    transportType :'train',

    init:function () {
      app.page.getStationFromCookie();
      app.page.buildTransportForm();
      app.gmap.initMap();
      app.page.addCategoryMenuFunctionality();
      console.log(Math.random());
    },

    getData:function () {

    },

    addCategoryMenuFunctionality:function () {
      $('.category-list li .subcategory a').click(function (e) {
        $('.main-icon, .subcategory').removeClass('active');
        $(this).closest('.subcategory').addClass('active');
        $(this).closest('li').find('.main-icon').addClass('active');
        app.page.showObjectListBySubCategory($(this).attr('data-subcategory'));
      })
    },

    showObjectListBySubCategory:function (id) {
      $('.category-list').removeClass('show-subcategore').addClass('active-for-hover');
      $('.items-list').empty();
      app.page.buildTabs(1);
      app.page.getObjects(id)
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
        '</div>'
      $('<div class="filter-wrap">').html(tabsControll).appendTo('.items-list');
      $($('.filter-wrap .tabs a')[activeTab]).addClass('active');
    },

    getObjects:function (id) {
      var URL = 'http://test.zhukcity.ru/map?act=get_objects&cat_ids=' + id + '&sort_by=0';
      $.get(URL, function (data) {
        if (data.success) {
          if (data.objects.length > 0) {
            $('list-item').remove();
            for (var i = 0; i < data.objects.length; i++) {
              app.page.layoutObject(data.objects[i]);
            }
          }
        }
      })
    },

    layoutObject:function (data) {
      var item = $('<div class="list-item object-item">')
        .append($('<span class="status-work">')
        .addClass(data.operating_minutes >= 0 ? 'online' : '')
        .html(data.operating_minutes >= 0 ? 'работает' : 'неработает'))
        .append($('<a href="#" class="list-item-name">')
        .html(data.name))
        .append($('<p class="list-item-info">').html(
        'Адрес: <a href="#">' + data.address + '</a> <br>' +
          'Телефон: ' + data.phone + '  <br>' +
          'Сайт: <a href="#">' + data.website + '</a> <br>'
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
        '<span class="object-item-comments">' + data.n_reviews + '</span>' +
          '<div class="rating-stars"></div>' +
          'Рейтинг: <b>' + data.rating + '</b>'
        ))
        .append($('<div class="object-item-controls">')
        .html(
        '<a href="#" class="gray-btn">В закладки</a>' +
          '<a href="#" class="gray-btn"><span class="object-item-show-map"></span></a>'
        )));
      $('.filter-wrap').append(item);
    },

    setCookie: function (name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    },
    
    getCookie: function(name) {
      var cookie = " " + document.cookie;
      var search = " " + name + "=";
      var setStr = null;
      var offset = 0;
      var end = 0;
      if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
          offset += search.length;
          end = cookie.indexOf(";", offset)
          if (end == -1) {
            end = cookie.length;
          }
          setStr = unescape(cookie.substring(offset, end));
        }
      }
      return(setStr);
    },

    getStationFromCookie:function() {
      if(app.page.getCookie('firstBus'))  app.page.startStation.firstBus = app.page.getCookie('firstBus');
      if(app.page.getCookie('secondBus')) app.page.startStation.secondBus = app.page.getCookie('secondBus');
      if(app.page.getCookie('firsttrain')) app.page.startStation.firstTrain = app.page.getCookie('firstTrain');
      if(app.page.getCookie('secondTrain')) app.page.startStation.secondTrain = app.page.getCookie('secondTrain');
    },

    buildTransportForm:function () {
      if (app.page.transportType == 'bus') {
        $('.gray-input.schedule-from input').val(app.page.startStation.firstBus);
        $('.gray-input.schedule-to input').val(app.page.startStation.secondBus);
      }
      if (app.page.transportType == 'train') {
        $('.gray-input.schedule-from input').val(app.page.startStation.firstTrain);
        $('.gray-input.schedule-to input').val(app.page.startStation.secondTrain);
      }
      $('.gray-input input').bind('click',function(e){
          e.stopPropagation();
          e.preventDefault();
          $(this).select();
      })
      $('.gray-input.schedule-from input').bind('keyup', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode != 13) {
          app.page.showHelper('from');
        } else {
          if ($('.drop-list div').length > 0) {
            $('.schedule-from input').val($($('.drop-list div')[0]).text());
          }
          $('.drop-list').remove();
          $('.schedule-table').removeClass('gray');
          app.page.layoutTransportList();
        }
      });
      $('.gray-input.schedule-to input').bind('keyup',function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode != 13) {
          app.page.showHelper('to');
        } else {
          if ($('.drop-list div')) {
            $('.schedule-to input').val($($('.drop-list div')[0]).text());
          }
          $('.drop-list').remove();
          $('.schedule-table').removeClass('gray');
          app.page.layoutTransportList();
        }
      });
      $('.schedule-transport li.schedule-transport-bus').bind('click', function(){
        app.page.transportType = 'bus';
        $('.schedule-transport li').removeClass('active');
        $(this).addClass('active');
        $('.gray-input.schedule-from input').val(app.page.startStation.firstBus);
        $('.gray-input.schedule-to input').val(app.page.startStation.secondBus);
        app.page.layoutTransportList();
      })
      $('.schedule-transport li.schedule-transport-train').bind('click', function(){
        app.page.transportType = 'train';
        $('.schedule-transport li').removeClass('active');
        $(this).addClass('active');
        $('.gray-input.schedule-from input').val(app.page.startStation.firstTrain);
        $('.gray-input.schedule-to input').val(app.page.startStation.secondTrain);
        app.page.layoutTransportList();
      })
      app.page.layoutTransportList();
    },

    showHelper:function (direction) {
      var selector = '.gray-input.schedule-' + direction;
      if (!$(selector + ' div')[0]) {
        $('<div class="drop-list"></div>').appendTo(selector);
      }
      $('body').click(function () {
        $('.drop-list').remove();
        $('.schedule-table').removeClass('gray');
      })

        var query = $(selector + ' input').val();
        var type = app.page.transportType;
        $('.schedule-table').addClass('gray');
        $(selector + ' div').empty();
        for (var i = 0; i < app.transport_stations.length; i++) {
          var item = app.transport_stations[i]
          if (item.type == type) {
            if ((item.title.toLowerCase().indexOf(query.toLowerCase()) + 1)||(!query.length)) {
              $(selector + ' .drop-list').append($('<div></div>').text(item.title).click(
                function (e) {
                  $(selector + ' input').val($(this).text());
                  $(selector + ' .drop-list').remove();
                  app.page.layoutTransportList();
                }
                ))
            }
          }
        }
        if ($(selector + ' .drop-list:empty')[0]) {
          $(selector + ' .drop-list').remove();
        }
    },


    layoutTransportList:function () {
      if (!($('.gray-input.schedule-to input').val() && $('.gray-input.schedule-from input').val())) {
        return;
      }
      app.page.saveTransportCookie();
      var fromVal = $('.gray-input.schedule-from input').val();
      var toVal = $('.gray-input.schedule-to input').val();
      var transportType = $('.schedule-transport-bus active') ? 'bus' : 'train' ;
      var URL = 'http://test.zhukcity.ru/transport?act=get_schedule&type=' + app.page.transportType + '&dep_from=' + fromVal + '&arr_to=' + toVal + '&when=today&limit=' + app.page.transportLimit;
      $.get(URL, function(data){
        if(data.success) {
          if (data.items.length) {
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
                .append($('<td colspan="3">Ничего не найденно</td>'))
                .appendTo('.schedule-table table')
          }
        }
      });
    },

    saveTransportCookie: function(){
      if (app.page.transportType == 'bus') {
        app.page.setCookie("firstBus", $('.gray-input.schedule-from input').val());
        app.page.startStation.firstBus = $('.gray-input.schedule-from input').val();
        app.page.setCookie("secondBus", $('.gray-input.schedule-to input').val());
        app.page.startStation.secondBus = $('.gray-input.schedule-to input').val();
      } else {
        app.page.setCookie("firstTrain", $('.gray-input.schedule-from input').val());
        app.page.startStation.firstTrain =  $('.gray-input.schedule-from input').val();
        app.page.setCookie("secondTrain", $('.gray-input.schedule-to input').val());
        app.page.startStation.secondTrain = $('.gray-input.schedule-to input').val();
      }
    }

  },
  gmap:{
    markers:{},
    startPosition:{
      lat: 55.598135,
      lng: 38.113778,
      zoom: 12
    },
    initMap:function () {
      $('<div id="mapContainer"></div>').css('width', '100%').css('height', '100%').css('z-index', '1')
        .appendTo('.map');
      var startOptions = {
        mapTypeControl: true,
        zoom: 12,
        center: new google.maps.LatLng(app.gmap.startPosition.lat, app.gmap.startPosition.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(window.document.getElementById('mapContainer'), startOptions);
    }
  }

}
