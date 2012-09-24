app = {

  transport: {
    startStation:{
      firstBus:'ул. Гудкова',
      secondBus:'м. Кузьминки',
      firstTrain:'ОТДЫХ',
      secondTrain:'ВЫХИНО'
    },
    transportLimit: 5,
    transportType :'train',
    transportRefreshInterval: 60000, //1 min


    buildTransportForm:function () {
      if (app.getCookie('transType')){
        app.transport.transportType = app.getCookie('transType');
      }

      $('body').click(function () {
        $('.gray-input.schedule-from input, .gray-input.schedule-to input').removeClass('active');
        $('.drop-list').remove();
        $('.schedule-table').removeClass('gray');
      });

      $('.schedule-btn-sh').click(function() {
        if($('.schedule-btn-sh').hasClass('hide')) {
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

      $('.gray-input.schedule-from input').bind('focus', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.drop-list').remove();
        $('.gray-input.schedule-to input').removeClass('active');
        if($(this).val().length>0 && !$('.gray-input.schedule-from input.active').length) {
          this.select();
          app.transport.showHelper('from',true);
        }
        if ($(this).val().length == 0){
          app.transport.showHelper('from');
        }
        $(this).addClass('active');
      }).mouseup(function(e){
        e.preventDefault();
        e.stopPropagation();
      }).click(function(e){
        e.preventDefault();
        e.stopPropagation();
      });
      
      $('.gray-input.schedule-to input').bind('focus', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.drop-list').remove();
        $('.gray-input.schedule-from input').removeClass('active');
        if($(this).val().length>0 && !$('.gray-input.schedule-to input.active').length) {
          this.select();
          app.transport.showHelper('to',true);
        }
        if ($(this).val().length == 0){
          app.transport.showHelper('to');
        }
        $(this).addClass('active');
      }).mouseup(function(e){
        e.preventDefault();
        e.stopPropagation();
      }).click(function(e){
        e.preventDefault();
        e.stopPropagation();
      });

      $('.gray-input.schedule-from input').bind('keyup', function (e) {
        console.log(e);
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode != 13) {
          if((e.keyCode > 45 && e.keyCode < 91) || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 0){
            app.transport.showHelper('from');
         } //else if (e.keyCode == 38) {
//            var prevElement = $('.drop-list div.focus').prev() ? $('.drop-list div.focus').prev() : $('.drop-list div')[$('.drop-list div').length - 1];
//            $('.drop-list div.focus').removeClass('focus')
//            prevElement.addClass('focus');
//            console.log($('.drop-list').scrollTop())
//          } else if (e.keyCode == 40) {
//            var nextElement = $('.drop-list div.focus').next() ? $('.drop-list div.focus').next() : $('.drop-list div')[0];
//            $('.drop-list div.focus').removeClass('focus')
//            nextElement.addClass('focus');
//          }
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
          if((e.keyCode > 45 && e.keyCode < 91) || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 0){
            app.transport.showHelper('to');
          } //else if (e.keyCode == 38) {
//            var prevElement = $('.drop-list div.focus').prev() ? $('.drop-list div.focus').prev() : $('.drop-list div')[$('.drop-list div').length - 1];
//            $('.drop-list div.focus').removeClass('focus')
//            prevElement.addClass('focus');
//          } else if (e.keyCode == 40) {
//            var nextElement = $('.drop-list div.focus').next() ? $('.drop-list div.focus').next() : $('.drop-list div')[0];
//            $('.drop-list div.focus').removeClass('focus')
//            nextElement.addClass('focus');
//          }
        } else {
          if ($('.drop-list div')) {
            $('.schedule-to input').val($('.drop-list div.focus').text());
          }
          $('.drop-list').remove();
          $('.schedule-table').removeClass('gray');
          app.transport.layoutTransportList();
        }
      });
      $('.schedule-transport li.schedule-transport-bus').bind('click', function() {
        app.transport.transportType = 'bus';
        $('.schedule-transport li').removeClass('active');
        $(this).addClass('active');
        $('.gray-input.schedule-from input').val(app.transport.startStation.firstBus);
        $('.gray-input.schedule-to input').val(app.transport.startStation.secondBus);
        app.transport.layoutTransportList();
      })
      $('.schedule-transport li.schedule-transport-train').bind('click', function() {
        app.transport.transportType = 'train';
        $('.schedule-transport li').removeClass('active');
        $(this).addClass('active');
        $('.gray-input.schedule-from input').val(app.transport.startStation.firstTrain);
        $('.gray-input.schedule-to input').val(app.transport.startStation.secondTrain);
        app.transport.layoutTransportList();
      })
      app.transport.layoutTransportList();

      app.transport.tranportRefresh = window.setInterval(function(){
        if(!$('.drop-list').length){
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
              function(){
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
      $.get(URL, function(data) {
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

    saveTransportCookie: function() {
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

    getStationFromCookie:function() {
      if (app.getCookie('firstBus'))  app.transport.startStation.firstBus = app.getCookie('firstBus');
      if (app.getCookie('secondBus')) app.transport.startStation.secondBus = app.getCookie('secondBus');
      if (app.getCookie('firstTrain')) app.transport.startStation.firstTrain = app.getCookie('firstTrain');
      if (app.getCookie('secondTrain')) app.transport.startStation.secondTrain = app.getCookie('secondTrain');
    }
  },


  page:{
    

    init:function () {
      app.transport.getStationFromCookie();
      app.transport.buildTransportForm();
      app.gmap.initMap();
      app.page.addCategoryMenuFunctionality();
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
  }
}
