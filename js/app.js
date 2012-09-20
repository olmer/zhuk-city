app = {
  page: {
    subcategorys: {},
    transportList: {},

    transpotrec: {
	    "items":	[{
			  "title":	"ПЛ.47 КМ",
			  "dep_time":	"13:04",
			  "arr_time":	"13:36"
		  }, {
			  "title":	"ШИФЕРНАЯ",
			  "dep_time":	"13:09",
			  "arr_time":	"13:41"
		  }, {
			  "title":	"ПЛ.47 КМ",
			  "dep_time":	"13:25",
			  "arr_time":	"13:57"
		  }, {
			  "title":	"ПЛ.47 КМ",
			  "dep_time":	"13:40",
			  "arr_time":	"14:12"
		  }, {
			  "title":	"ПЛ.47 КМ",
			  "dep_time":	"13:55",
			  "arr_time":	"14:27"
		  }],
	    "success":	true
    },

    init: function() {
      app.page.buildTransportForm();
      app.gmap.initMap();
      app.page.addCategoryMenuFunctionality();
      console.log(Math.random());
    },

    getData: function() {

    },

    addCategoryMenuFunctionality: function(){
        $('.category-list li .subcategory a').click(function(e){
            $('.main-icon, .subcategory').removeClass('active');
            $(this).closest('.subcategory').addClass('active');
            $(this).closest('li').find('.main-icon').addClass('active');
            app.page.showObjectListBySubCategory($(this).attr('data-subcategory'));
        })
    },

    showObjectListBySubCategory: function(id){
        $('.category-list').removeClass('show-subcategore').addClass('active-for-hover');
        $('.items-list').empty();
        app.page.buildTabs(1);
        app.page.getObjects(id)
    },

    buildTabs: function(activeTab){
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

    getObjects: function(id){
      var URL = 'http://test.zhukcity.ru/map?act=get_objects&cat_ids=' + id + '&sort_by=0';
      $.get(URL, function(data){
        if(data.success){
          if(data.objects.length>0){
            $('list-item').remove();
            for(var i = 0; i<data.objects.length; i++){
              app.page.layoutObject(data.objects[i]);
            }
          }
        }
      })
    },

    layoutObject: function(data){
      var item = $('<div class="list-item object-item">')
        .append($('<span class="status-work">')
          .addClass(data.operating_minutes >= 0 ? 'online' : '')
          .html(data.operating_minutes >= 0 ? 'работает' : 'неработает'))
        .append($('<a href="#" class="list-item-name">')
          .html(data.name))
        .append($('<p class="list-item-info">').html(
          'Адрес: <a href="#">' + data.address + '</a> <br>'+
                    'Телефон: ' + data.phone + '  <br>'+
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

    buildTransportForm: function() {
      $('.gray-input.schedule-from input').keyup(function(e){
        app.page.showHelper('from');
      });
      $('.gray-input.schedule-to input').keyup(function(e){
        app.page.showHelper('to');
      });
    },

    showHelper: function(direction) {
      var selector = '.gray-input.schedule-' + direction;
      if(!$(selector + ' div')[0]){
        $('<div class="drop-list"></div>').appendTo(selector)
          .css('border','1px solid #ccc')
          .css('background-color','#fff')
      }
      if($(selector + ' input').val().length > 1){
        var query = $(selector + ' input').val();
        var type = $('.schedule-transport-bus').hasClass('active') ? 'bus' : 'train';
        $(selector + ' div').empty();
        for (var i = 0; i < app.transport_stations.length; i++){
          var item = app.transport_stations[i]
          if (item.type == type){
            if(item.title.toLowerCase().indexOf(query.toLowerCase()) + 1){
              $(selector + ' .drop-list').append($('<div></div>').text(item.title).click(
                function(e){
                  $(selector + ' input').val($(this).text());
                  $(selector + ' .drop-list').remove();
                  app.page.layoutTransportList();
                }
              ))
            }
          }
        }
        if($(selector + ' .drop-list:empty')[0]){
          $(selector + ' .drop-list').remove();
        }
      }
    },

    getTransportData: function(){
      var data = app.page.transpotrec;
      if (data.success){
        return data.items;
      }
    },

    layoutTransportList: function(){
      var data = app.page.getTransportData();
      if (data){
        console.log($('.schedule-table .list-row'));
        $('.schedule-table .list-row').remove();
        for (var i = 0; i < data.length; i++){
          $('<tr class="list-row"></tr>')
            .append($('<td>' + data[i].title + '</tr>'))
            .append($('<td>' + data[i].dep_time + '</tr>'))
            .append($('<td>' + data[i].arr_time + '</tr>'))
            .appendTo('.schedule-table table')
        }
      }
    }

  },
  gmap: {
    markers: {},
    initMap: function() {
      $('<div id="mapContainer"></div>').css('width', '100%').css('height', '100%').css('z-index', '1')
        .appendTo('.map');
      var startOptions = {
        zoom: 15,
        center: new google.maps.LatLng(53.849343, 27.457076),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(window.document.getElementById('mapContainer'), startOptions);
    }
  }
}
