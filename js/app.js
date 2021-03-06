'use strict';
window.app = {
    CONST: {
        URL: 'http://test.zhukcity.ru/',
        WORKTIME_MIN: 0, //values to display active/unactive object
        WORKTIME_MAX: 0,
        REVIEWS_LOAD_QTY: 10,
        POSTER_DEFAULT_CATEGORY: 'cinema',
        NEWS_DEFAULT_CATEGORY: 'culture',
        NEWS_IMAGE_PLACEHOLDER: 'images/news-img.png',
        POSTER_LOAD_LIMIT: 5,
        POSTERS_EVENT_TIMES_LIMIT: 4
    },

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
                var item = app.transport_stations[i];
                if (item.type == type) {
                    if ((item.title.toLowerCase().indexOf(query.toLowerCase()) + 1) || (!query.length) || full) {
                        $(selector + ' .drop-list').append($('<div></div>').text(item.title).click(
                            function () {
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
                    .appendTo('.schedule-table table');
                return;
            }
            var fromVal = $('.gray-input.schedule-from input').val();
            var toVal = $('.gray-input.schedule-to input').val();
            var URL = app.CONST.URL + 'transport?act=get_schedule&type=' + app.transport.transportType
                + '&dep_from=' + fromVal + '&arr_to=' + toVal + '&when=today&limit=' + app.transport.transportLimit;
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
    gmap:{
        markers:{},
        startPosition:{
            lat:55.598135,
            lng:38.113778,
            zoom:12
        },
        initMap:function () {
            $('<div id="mapContainer"></div>').css('z-index', '1').appendTo('.map');

            app.gmap.resizeMap();
            $(window).on('resize', app.gmap.resizeMap);

            var startOptions = {
                mapTypeControl:true,
                zoom:12,
                center:new google.maps.LatLng(app.gmap.startPosition.lat, app.gmap.startPosition.lng),
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            app.gmap.map = new google.maps.Map(window.document.getElementById('mapContainer'), startOptions);
        },
        resizeMap: function () {
            var width = parseInt($(window).width()) - parseInt($('aside.left-block').width()),
                height = parseInt($(window).height()) - parseInt($('header').height()) - parseInt($('footer').height());
            $('#mapContainer').css('width', width + 'px').css('height', height + 'px')
        },
        addMarker:function (object) {
            var marker = new google.maps.Marker({
                position:new google.maps.LatLng(object.latitude, object.longitude),
                icon:'images/marker.1.png',
                map:app.gmap.map,
                title: object.name
            });

            var infoString = '<div class="object-onmap-wrap">' +
                '<div class="onmap-arrow"></div>' +
                '<div class="object-onmap-header">' +
                '<h4 class="object-onmap-name">' + object.name + '</h4>' +
                '<div class="onmap-comment-count">' + object.n_reviews + '</div>' +
                '</div>' +
                '<div class="object-onmap-content">' +
                'Адрес: <a>' + object.address.replace(/\n/g, '<br/>') + '</a> <br>' +
                'Телефон: ' + object.phone.replace(/\n/g, '<br/>') +
                '</div>' +
                '<div class="object-onmap-time">' +
                object.worktime.replace(/\n/g, '<br/>') +
                '</div>' +
                '<div class="object-onmap-footer">' +
                '<span class="object-onmap-rating">Рейтинг: <b>' + object.rating + '</b></span>' +
                '<a class="object-onmap-comment" id="object-onmap-comment-' + object.id + '">Оставить отзыв</a>' +
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
                closeBoxMargin:"-12px -13px 0 0",
                closeBoxURL:"http://www.google.com/intl/en_us/mapfiles/close.gif",
                infoBoxClearance:new google.maps.Size(1, 1),
                isHidden:false,
                pane:"floatPane",
                enableEventPropagation:false
            };

            var infoBox = new InfoBox(infoBoxOptions);

            google.maps.event.addListener(infoBox, 'domready', function () {
                $('#object-onmap-comment-' + object.id).off('click');
                $('#object-onmap-comment-' + object.id).on('click', function () {
                    if (app.user.isAuthorized()) {
                        $('.comment-modal-onmap').remove();
                        var $form = $(app.getHtml.reviewForm({}, 'add-comment-modal comment-modal-onmap'));

                        $form.insertAfter($('.object-list')).show();

                        app.bind.objectSubmitReview($form, object.id);
                        app.bind.ratings($form.find('div.rating-stars'));
                        app.bind.closeAllModals();
                    } else {
                        $.jGrowl(
                            'Чтобы оставить отзыв необходимо зарегистрироваться на сайте. Если Вы уже ' +
                            'зарегистрированы, введите имя пользователя и пароль в верхней правой части окна',
                            {add_class: 'fail', 'position': 'top-left'}
                        );
                    }
                });
            });

            google.maps.event.addListener(marker, 'click', function () {
                app.gmap.closeAllInfoWindows();
                infoBox.open(app.gmap.map, marker);
            });

            return {
                marker:marker,
                infoBox:infoBox
            };
        },

        showObject:function (id) {
            for (var i = 0; i < app.objects.length; i++) {
                if (app.objects[i].data.id == id) {
                    app.gmap.closeAllInfoWindows();
                    app.objects[i].mapItem.infoBox.open(app.gmap.map, app.objects[i].mapItem.marker);
                    app.gmap.map.setCenter(new google.maps.LatLng(app.objects[i].data.latitude, app.objects[i].data.longitude));
                    app.gmap.map.setZoom(app.gmap.startPosition.zoom);
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
                app.objects[i].mapItem.marker.setMap(null);
            }
        },

        geocoderInit: function (customPos) {
            app.gmap.geocoderObj = new google.maps.Geocoder();

            var geocodePosition = function (pos) {
                app.gmap.geocoderObj.geocode({
                    latLng: pos
                }, function(responses) {
                    if (responses && responses.length > 0) {
                        updateMarkerAddress(responses[0].formatted_address);
                    } else {
                        updateMarkerAddress('Cannot determine address at this location.');
                    }
                });
                },

            /*updateMarkerStatus = function (str) {
                document.getElementById('markerStatus').innerHTML = str;
            },

            updateMarkerPosition = function (latLng) {
                document.getElementById('info').innerHTML = [
                    latLng.lat(),
                    latLng.lng()
                ].join(', ');
            },*/

            updateMarkerAddress = function (str) {
                $('#add-object-form-address').val(str);
            },

            initialize = function () {
                var latLng;
                if (customPos) {
                    latLng = new google.maps.LatLng(customPos.lat, customPos.lng);
                } else {
                    latLng = new google.maps.LatLng(app.gmap.startPosition.lat, app.gmap.startPosition.lng);
                }
                var map = app.gmap.map,
                markerImage = new google.maps.MarkerImage(
                    "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|04a207"
                ),
                markerShadow = new google.maps.MarkerImage(
                    "http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                    new google.maps.Size(40, 37),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(12, 36)
                );
                var marker = new google.maps.Marker({
                    position: latLng,
                    title: 'Point A',
                    map: map,
                    icon: markerImage,
                    shadow: markerShadow,
                    draggable: true
                });
                app.gmap.newObjectMarker = marker;

                // Update current position info.
//                updateMarkerPosition(latLng);
                geocodePosition(latLng);

                // Add dragging event listeners.
                google.maps.event.addListener(marker, 'dragstart', function() {
                    updateMarkerAddress('Dragging...');
                });

                /*google.maps.event.addListener(marker, 'drag', function() {
                    updateMarkerStatus('Dragging...');
                    updateMarkerPosition(marker.getPosition());
                });*/

                google.maps.event.addListener(marker, 'dragend', function() {
//                    updateMarkerStatus('Drag ended');
                    geocodePosition(marker.getPosition());
                });

                map.setCenter(latLng);
            };

            initialize();
        }
    },

    /**
     * Object with all functionality related to login, profile, forgotten password etc
     */
    login: {
        /**
         * Init function
         */
        init: function () {
            $('div.register-modal input[name!=gender]').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $('div.register-modal input[name!=gender], div.login-form input').on('change keyup', function() {
                app.login.clearErrors($(this).parent().parent());
            });

            //Bind profile information load on click
            $('a.name-open-profile').on('click', function () {
                app.login.loadProfileData($loginFormUnauthorized, $loginFormAuthorized);
            });

            //Forms and inputs
            var $loginBtn = $('button.login-btn'),
                loginInputs = {
                    login: $('div.login-input input[type=text]'),
                    passw: $('div.login-input input[type=password]')
                },
                loginInputsValues = {login: '', passw: ''},
                $loginFormUnauthorized = $('div.login-form.unauthorized'),
                $loginFormAuthorized = $('div.login-form.authorized');


            // Bind inputs default value switcher
            $.each(loginInputs, function (k, v) {
                loginInputsValues[k] = v.val();
            });
            $.each(loginInputs, function (k, v) {
                v.on('click', {default: loginInputsValues}, app.inputsSwitcherClick);
                v.on('blur', {default: loginInputsValues}, app.inputsSwitcherBlur);
            });

            //Bind profile save action
            $('div.register-modal-login form button.modal-submit').on('click', function () {
                app.login.processSaveData('login', null);
                return false;
            });

            //Display profile data
            if (app.user.isAuthorized()) {
                app.login.loadProfileData($loginFormUnauthorized, $loginFormAuthorized);
            }

            //Bind forgot password actions
            app.login.forgotPasswordInit();

            // Login click
            $loginBtn.on('click', function () {
                $.post(app.CONST.URL + 'profile/?act=login', {
                    login: loginInputs.login.val(),
                    passw: loginInputs.passw.val()
                }, function (data) {
                    if (data.success === true) {
                        $loginFormUnauthorized.css('display', 'none');
                        $loginFormAuthorized.css('display', 'block')
                            .find('a.username-link').html(data.username);
                        loginInputs.login.siblings('div.error-container').css('display', 'none')
                            .parent().removeClass('input-error');
                    } else if (data.success === false) {
                        app.login.displayErrorByField('div.login-form form ', 'login', data.error);
                    }
                });
                return false;
            });

            $('#auth-user-exit').on('click', function () {
                $.get(app.CONST.URL + 'profile/?act=logout', function (data) {
                    if (data.success === true) {
                        $loginFormUnauthorized.css('display', 'block');
                        $loginFormAuthorized.css('display', 'none');
                        app.user.justLoggedOut = true;
                    }
                });
                return false;
            });

            $('div.register-modal form input[name=birthdate]').datepicker(
                {
                    dateFormat: 'dd.mm.yy',
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '1900:2013'
                },
                $.datepicker.regional['ru']
            );

            app.login.registrationInit();
        },

        /**
         * Registration initialize
         */
        registrationInit: function() {
            var captchaId = 1;//default value

            // Open register, get captcha
            $('a.reg-link').on('click', function () {
                //Inputs' default values
                $('div.register-modal-register form input').each(function (k, v) {
                    var $field = $(v),
                        def = $field.attr('data-defaultvalue');
                    $field.val(def || ($field.attr('name') === 'gender' ? $field.val() : ''));
                });
                $.post(app.CONST.URL + 'profile/?act=captcha', function (data) {
                    captchaId = data.code_id;
                    $('div.register-modal-register form label img').attr('src',
                        app.CONST.URL + 'images/code.png?id=' + data.code_id);
                });
            });

            // Submit register
            $('div.register-modal-register form button.modal-submit').on('click', function () {
                app.login.processSaveData('register', captchaId);
                return false;
            });
        },

        /**
         * Forgot password init
         */
        forgotPasswordInit: function() {
            var captchaId = 1; //default value

            var submitObj = new app.login.ForgotPasswordSubmit();
            // Open register, get captcha
            $('a.forgot-link').on('click', function () {
                $.post(app.CONST.URL + 'profile/?act=captcha', function (data) {
                    captchaId = data.code_id;
                    $('div.forgot-modal form label img').attr('src',
                        app.CONST.URL + 'images/code.png?id=' + data.code_id);
                    submitObj.captchaId = captchaId;
                });
            });
            $('form.forgot-password-form button.modal-submit').on('click', submitObj, submitObj.submit);
        },

        /**
         * Object, collecting forgot password information
         *
         * @constructor
         */
        ForgotPasswordSubmit: function () {
            /**
             * Gather form information, validation, submitting
             *
             * @param e event
             * @return {Boolean}
             */
            this.submit = function (e) {
                var $this = e.data;
                var formSelector = 'div.forgot-modal .forgot-password-form ';
                var fields = {
                    nickname: $(formSelector + 'input[name=nickname]'),
                    email: $(formSelector + 'input[name=email]'),
                    code: $(formSelector + 'input[name=code]')
                };
                var data = {};
                $.each(fields, function(k, v) {
                    data[k] = v.val();
                });
                data['code_id'] = $this.captchaId;

                $.post(app.CONST.URL + 'profile/password', data, function (data) {
                    if (data.success === false) {
                        app.login.displayErrorByField(formSelector, data.field, data.error);
                    } else {
                        app.login.clearErrors(formSelector);
                        $.jGrowl(
                            'На Ваш E-mail отправлено письмо со ссылкой для смены пароля',
                            {'add_class': 'success'}
                        );
                        $('div.forgot-modal').hide();
                    }
                });
                return false;
            }
        },

        /**
         * Gather inputs' values, validation, saving
         *
         * @param actionType
         * @param captchaId
         * @return {Boolean}
         */
        processSaveData: function (actionType, captchaId) {
            var form = 'div.register-modal-' + actionType + ' form ';
            var fields = {
                nickname: $(form + 'input[name=nickname]'),
                gender: $(form + 'input[name=gender]:checked').length !== 0
                    ? $(form + 'input[name=gender]:checked')
                    : $('<input>').attr({value: 0}),
                birthdate: $(form + 'input[name=birthdate]'),
                email: $(form + 'input[name=email]'),
                passw: $(form + 'input[name=passw]'),
                passw_again: $(form + 'input[name=passw-again]'),
                old_passw: $(form + 'input[name=old_passw]'),
                code : $(form + 'input[name=code]')
            };
            var data = {};
            $.each(fields, function(k, v) {
                data[k] = v.val();
            });
            data['code_id'] = captchaId;
            if (!app.login.comparePasswords(fields.passw, fields.passw_again)) {
                app.login.displayErrorByField(form, 'passw', 'Пароли не совпадают');
                return false;
            }
            $.post(app.CONST.URL + 'profile/' + (actionType === 'register' ? 'register' : 'edit' ) + '/', data,
                function (data) {
                    if (data.success === false) {
                        app.login.displayErrorByField(form, data.field, data.error);
                    } else {
                        app.login.clearErrors(form);
                        $.jGrowl(actionType === 'register'
                            ? 'Вы были успешно зарегистрированы!'
                                + 'Введите имя пользователя и пароль для авторизации на сайте'
                            : 'Изменения сохранены',  {'add_class': 'success'});
                        $('div.register-modal').hide();
                    }
                }
            );
            return true;
        },

        /**
         * Compare passwords during register or profile save
         *
         * @param $password jQuery object
         * @param $repeatedPassword jQuery object
         * @return {Boolean}
         */
        comparePasswords: function($password, $repeatedPassword) {
            return $password.val() === 'Введите пароль'
                || $password.val() === 'Новый пароль'
//                check all the variants about password comparison
//                || $repeatedPassword.val() === 'Пароль еще раз'
                || $password.val() === $repeatedPassword.val();
        },

        /**
         * Display an error near the field
         *
         * @param formSelector string
         * @param fieldName string
         * @param error string
         */
        displayErrorByField: function (formSelector, fieldName, error) {
            app.login.clearErrors(formSelector);
            var $errField = $(formSelector + 'input[name=' + fieldName + ']');
            $(formSelector).find('div.error-container').remove();
            $errField.parent().addClass('input-error')
                .append(app.errors.getInputError(error));
            $('div.error-container').on('click', function () {
                app.login.clearErrors(formSelector);
            });
        },

        /**
         * Clear all the errors in form
         *
         * @param formSelector string
         */
        clearErrors: function (formSelector) {
            var $obj = typeof formSelector === 'string' ? $(formSelector) : formSelector;
            $obj.find('div.error-container').remove();
            $obj.find('.input-error').removeClass('input-error');
        },

        /**
         * Fill in profile data
         *
         * @param $loginFormUnauthorized jQuery object
         * @param $loginFormAuthorized jQuery object
         */
        loadProfileData: function ($loginFormUnauthorized, $loginFormAuthorized) {
            $.post(app.CONST.URL + 'profile/edit?act=get_profile', function (data) {
                if (data.success === true) {
                    var $personalProfile = $('div.register-modal-login');
                    $personalProfile.find('input[name="old_passw"],input[name="passw"],input[name="passw-again"]')
                        .val('');
                    $loginFormUnauthorized.css('display', 'none');
                    $loginFormAuthorized.css('display', 'block').find('a.username-link').html(data.nickname);
                    $.each(data, function (k, v) {
                        if (k !== 'gender') {
                            $($personalProfile.find('input[name="' + k +'"]')).val(v);
                        } else {
                            $($personalProfile.find('input[name="gender"][value="' + v + '"]'))
                                .attr('checked', 'checked');
                        }
                    });
                }
            });
        }
    },

    /**
     * Errors object
     */
    errors: {

        /**
         * Get error with message
         *
         * @param message string
         * @return {String}
         */
        getInputError: function (message) {
            return '<div class="error-container">'
                + '<span class="error-container-arrow"></span>'
                + '<span class="error-message">' + message + '</span>'
                + '</div>';
        }
    },

    categories: {
        init: function () {
            app.categories.fillSubcategories();
            $('#category-list div.subcategory a').on('click', function () {
                var $this = $(this);
                app.categories.fillObjectsData($this.attr('data-cat-id'));
            });
        },

        fillSubcategories: function () {
            var $categories = $('#category-list li'),
                categoriesList = app.map_categories,
                html = '';
            $.each($categories, function (itemKeys, item) {
                var $item = $(item);
                $.each(categoriesList[$item.attr('data-cat-id')].subcategories, function (subitemKeys, subitem) {
                    html += '<a data-cat-id="' + subitem.id + '">' + subitem.title + '</a> / ';
                });
                $item.find('div.subcategory').html(html);
                html = '';
            });
        },

        fillObjectsData: function (id, sortBy) {
            var URL = app.CONST.URL + 'map?act=get_objects&cat_ids=' + id + '&sort_by=' + (sortBy || 0);
            $.get(URL, function (data) {
                $('section.items-list.object-list').html('');
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
                        app.categories.printSubcategoryItems(id, sortBy || 0);
                    }
                }
            })
        },

        buildTabs:function (activeTab, categoryId, activeFilter) {
            var tabsControll = '<ul class="tabs">' +
                '<li class="posters"><a>Афиши</a></li>' +
                '<li class="categorys"><a>Категории</a></li>' +
                '<li class="news"><a>Новости</a></li>' +
                '</ul>' +
                '<div class="list-filter">' +
                '<ul class="object-list-filter">' +
                '<li><a id="sort-by-name"'
                    + (activeFilter === 1 ? ' class="active"' : '')
                    + ' data-cat-id="' + categoryId +'">По названию</a></li>' +
                '<li><a id="sort-by-rating"'
                    + (activeFilter === 0 ? ' class="active"' : '')
                    + 'data-cat-id="' + categoryId +'">По рейтингу</a></li>' +
                '<li><a id="sort-by-date"'
                    + (activeFilter === 2 ? ' class="active"' : '')
                    + 'data-cat-id="' + categoryId +'">По дате</a></li>' +
                '</ul>' +
                '<div class="work-filter">' +
                'Работает' +
                '<div class="ui-work-bg">' +
                '<span class="ui-work-item off"></span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>';
            $('div.filter-wrap').remove();
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

        printSubcategoryItems:function (categoryId, activeFilter) {//items list
            $('.category-list').addClass('hide-subcategory');
            app.categories.buildTabs(1, categoryId, activeFilter);
            var wrapper = $('.filter-wrap');
            for (var i = 0; i < app.objects.length; i++) {
                var item = app.objects[i];

                var listItem = $('<div class="list-item object-item" data-status-online="'
                    + !!item.data.operating_minutes +'" data-obj-id=' + item.data.id + '>')
                    .append(!item.data.operating_minutes ? '' : ($('<span class="status-work">')
                    .addClass(item.data.operating_minutes > app.CONST.WORKTIME_MAX ? 'online' : 'offline')
                    .html(item.data.operating_minutes > app.CONST.WORKTIME_MAX ? 'работает' : 'не работает')))
                    .append($('<a class="list-item-name">')
                    .html(item.data.name))
                    .append($('<p class="list-item-info">').html(
                        'Адрес: <a class="wo-underscore">' + item.data.address + '</a> <br>' +
                        (item.data.phone ? 'Телефон: ' + item.data.phone.replace(/\n/g, '<br/>') + '  <br>' : '') +
                        (item.data.website ? 'Сайт: <a href="' + item.data.website
                            + '" target="_blank" class="website-link wo-underscore">'
                            + item.data.website.split('/')[2].split('?')[0] + '</a> <br>' : '')
                    ))
                    .append($('<div class="object-list-time">')
                    .append($('<ul class="object-list-time-details">')
                    .append($('<li>' + item.data.worktime.replace(/\n/g, '<br/>') + '</li>'))
                    .append(item.data.worktime_breaks === '' ? '' : $('<li>') //do not show link and items if empty
                        .html(
                            '<a class="open-lunch-info">перерывы</a>' +
                            '<div class="lunch-info">' +
                            '<table>' +
                            '<tr>' +
                            '<th>' + item.data.worktime_breaks.replace(/\n/g, '<br/>') + '</th>' +
                            '</tr>' +
                            '</table>' +
                            '</div>'
                        )
                    )))
                    .append($('<div class="object-item-footer">')
                    .append(!item.data.n_reviews && !item.data.rating ? '' : $('<div class="object-item-rating">')
                    .html(
                    '<span class="object-item-comments">' + item.data.n_reviews + '</span>' +
                        '<div class="rating-stars"></div>' +
                        'Рейтинг: <b>' + item.data.rating + '</b>'
                    ))
                    .append($('<div class="object-item-controls">')
                    .append('<a class="gray-btn">В закладки</a>')
                    .append($('<a class="gray-btn location" data-obj-id="' + item.data.id + '" ></a>').append(
                    $('<span class="object-item-show-map"></span>')
                ))
                ));

                wrapper.append(listItem);
                app.bind.ratings(listItem.find('.rating-stars'), item.data.rating, true);

            }
            $('.gray-btn.location').click(function () {
                e.preventDefault();
                e.stopPropagation();
                app.gmap.showObject($(this).attr('data-obj-id'));
            });
            $('.list-item.object-item').click(function () {
                app.categories.openObjectDetails($(this).attr('data-obj-id'));
                return false;
            });
            $('.list-item.object-item .website-link').on('click', function (e) {
                e.stopPropagation();
            });
            $('div.work-filter').on('click', {items: wrapper.find('div.list-item')}, app.categories.workingFilter);
            app.bind.lunchInfo().objectsFilter();
        },

        workingFilter: function (e) {
            var switcher = $(this).find('span.ui-work-item');
            if (switcher.hasClass('off')) {
                switcher.removeClass('off').addClass('on');
                $.each(e.data.items, function (k, v) {
                    var $v = $(v);
                    if ($v.attr('data-status-online') === 'false') {
                        $v.slideUp(300);
                    }
                });
            } else {
                switcher.removeClass('on').addClass('off');
                $.each(e.data.items, function (k, v) {
                    $(v).slideDown(300);
                });
            }
        },

        openObjectDetails:function (objId) {//item details
            $('div.list-filter').css('height', '3px').find('ul,.work-filter').hide();
            $.getJSON(app.CONST.URL + 'map/?act=get_object&limit='
                + app.CONST.REVIEWS_LOAD_QTY + '&obj_id=' + objId, function (data) {
                $('.list-item.object-item').remove();

                var details = $('<div class="list-item object-details">')
                    .append(!data.operating_minutes ? '' : ($('<span class="status-work">')
                    .addClass(data.operating_minutes > app.CONST.WORKTIME_MAX ? 'online' : 'offline')
                    .html(data.operating_minutes > app.CONST.WORKTIME_MAX ? 'работает' : 'неработает')))
                    .append('<a class="list-item-name">' + (data.full_name ? data.full_name : data.name) + '</a>')
                    .append('<p class="list-item-info">' + (data.address ?
                    'Адрес: <a class="wo-underscore">' + data.address.replace(/\n/g, '<br/>') + '</a> <br>' : '') +
                    (data.phone ? 'Телефон: ' + data.phone.replace(/\n/g, '<br/>') + '  <br>' : '') +
                    (data.website ? 'Сайт: <a href="' + data.website
                        + '" target="_blank" class="website-link wo-underscore">'
                    + data.website.split('/')[2].split('?')[0] + '</a> <br>' : '') + // parse domain from link
                    '</p>')
                    .append('<div class="object-list-time">'+
                    '<ul class="object-list-time-details">'+
                    '<li>' + data.worktime.replace(/\n/g, '<br/>') + '</li>'+ (data.worktime_breaks ?
                    '<li>'+
                    '<table>'+
                    '<tbody><tr>'+
                    '<td>' + data.worktime_breaks.replace(/\n/g, '<br/>') + '</td>'+
                    '</tr>'+
                    '</tbody></table>'+
                    '</li>' : '' ) +
                    '</ul>' +
                    '</div>')
                    .append('<div class="object-item-footer">'+
                    '<div class="object-item-rating">'+
                    '<div class="rating-stars"></div>'+
                    'Рейтинг: <b>' + data.rating + '</b>'+
                    '</div>'+
                    '<div class="object-item-controls">'+
                    '<a class="gray-btn object-item-addto-bookmarks">В закладки</a>'+
                    '</div>'+
                    '</div>');

                var gallery = $('<ul>'), links = '';
                $.each(data.attachments, function (k, v) {
                    if (v.type !== 'image' || v.has_thumb !== true) {
                        links += '<a' +
                            ' href="' + app.CONST.URL +'map/attachments/' + v.id + '"' +
                            ' alt="' + v.descr + '">' + (v.title ? v.title : v.filename) + '</a>';
                    } else {
                        gallery.append('<li><a class="lightbox-open"' +
                            ' data-title="' + v.title + '"'+
                            ' data-descr="' + v.descr + '"'+
                                ' href="' + app.CONST.URL +'map/attachments/' + v.id + '">' +
                            '<img' +
                                ' src="' + app.CONST.URL + 'map/attachments/thumb/' + v.id + '"' +
                                ' width="' + v.thumb_width +'"/>' +
                            '</a></li>');
                    }
                });
                while (gallery.find('li').length % 4 !== 0) { //Markup fix while it cannot display correct float clear
                    gallery.append('<li style="visibility: hidden;height:46px;"/>');
                }
                links = (data.descr_full ? data.descr_full : data.descr_brief) + '<br/>' + links;

                details.append($('<div class="object-details-gallery">').append(gallery))
                    .append($('<p class="object-details-info"/>').append(links))
                    .append($('<div class="mistake-add">'
                    +'<a class="open-add-file">Добавить файл</a>'
                        +'<div class="add-file-wrap">'
                            +'<a class="close">Закрыть</a>'
                            +'<form>'
                                +'<input type="file">'
                                    +'<button class="blue-btn add-file-btn">Добавить</button>'
                                +'</form>'
                            +'</div>'
                            +'<a class="show-error">Сообщить об ошибке</a>'
                        +'</div>'))
                .append('<a class="gray-btn back-object-list"><span class="arrow-left"></span>К списку обьектов</a>' +
                    '<a class="gray-btn add-comment-object open-modal">Оставить отзыв</a>' +
                    app.getHtml.reviewForm({}, 'add-comment-modal') +
                    '<div class="clear-r"></div>'+
                    '<div class="comment-object-wrap">'+
                    '<span class="comments-object-count">Всего отзывов: <b>' + data.totalReviewsCount + '</b></span>'+
                    //'<a class="show-all-comments-object">Показать все</a>'+
                    '<div class="clear-r"></div>'+
                    '<section class="comments-list">'+
                    '</section>'+
                    '</div>'+
                    '</div>');

                details.appendTo('.items-list.object-list');

                app.bind.ratings($('div.object-item-footer .rating-stars'), data.rating, true);
                app.bind.ratings($('div.object-details .add-comment-modal .rating-stars'));

                app.bind.lunchInfo();

                app.bind.buttonClickCheckIsAuthorized($('a.object-item-addto-bookmarks'), 'добавить в закладки ');
                app.bind.buttonClickCheckIsAuthorized($('div.object-details .open-add-file'), 'добавить файл ');
                app.bind.buttonClickCheckIsAuthorized($('div.object-details .show-error'), 'сообщить об ошибке ', data);

                app.bind.objectItemSendReview($('div.object-details .add-comment-object'));
                app.bind.objectSubmitReview($('#object-details-send-review-form'), data.id);
                app.bind.closeAllModals();

                if (data.reviews.length) {
                    for (var i = 0; i < data.reviews.length; i++) {
                        app.categories.appendNewReview($('.comments-list'), data.reviews[i]);
                    }
                }

                $('a.comment-object-marker-yes, a.comment-object-marker-no').on('click', app.bind.voteForComment);

                $('.gray-btn.back-object-list').on('click', function () {
                    $('.items-list').empty();
                    app.categories.printSubcategoryItems();
                });

                $("a.lightbox-open").lightBox({
                    imageBtnClose: 'images/lightbox-btn-close.gif',
                    imageBtnPrev: 'images/lightbox-btn-prev.gif',
                    imageBtnNext: 'images/lightbox-btn-next.gif'
                });

                app.gmap.showObject(objId);
                app.categories.infiniteScrollReviews($('.comments-list'), objId);
            });
        },

        appendNewReview: function ($commentsContainer, item, action, cssClass) {
            //TODO: keep in mind .link method
            if (!$commentsContainer) {
                return false;
            }
            var $author = $('<div class="author-info">'),
                $review = $('<div class="comments-row' + (item.awaits_premoderation ? ' on-moderation' : '') + '">' +
                '<div class="comment-object-item' + (cssClass ? ' ' + cssClass : '') + '">' +
                ' <div class="comment-object-info">'
                + '<input type="hidden" name="object-data" value="' + encodeURI(JSON.stringify(item)) + '"/>'
                + '<a class="comment-object-name ' + (item.user_gender === 'M' ? 'male' : 'female') + '" ' +
                'data-author-id="' + item.id + '">'
                + item.user_name + '</a>'+
                '<span class="comment-object-date">' + item.date_time + '</span>'+
                (item.rating ? '<div class="comment-object-mark-new">Оценка: <br/>'+
                '<span>' + item.rating + '</span>'+
                '</div>' : '')+
                '</div>'+
                '<div class="comment-object-content">' +
                '<p class="comment-object-text">' +
                    (item.subject ? '<strong>' + item.subject + '</strong>: ' : '') + item.msg_text + '</p>' +
                '<span class="on-moderation-text">Отзыв на модерации</span>'+
                '<div class="comment-object-marker">' +
                (item.editable && item.editable === true ? '<span class="comment-edit">Редактировать</span>' : '') +
                'Отзыв полезен?'+
                '<span class="comment-object-marker-ins'
                + (item.already_voted ? ' already-voted' : '')
                + '" data-id="' + item.id + '">'+
                '<a class="comment-object-marker-yes green" data-val="1">Да</a> <span>'
                + item.votes_plus + '</span> / '+
                '<a class="comment-object-marker-no red" data-val="-1">Нет</a> <span>'
                + item.votes_minus +
                '</span></span>'+
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div></div>')[action || 'appendTo']($commentsContainer);
            app.bind.renderReviewEditForm($review.find('.comment-edit'));
            app.categories.loadAuthorData(item.user_id, $author, $review);
            return true;
        },

        loadAuthorData: function (id, $container, $review) {
            if (app.user.isAuthorized()) {
                $.get(app.CONST.URL + 'profile/?act=get_user_details&id=' + id, function (data) {
                    $container.append('Дата регистрации: ' + data.date_reg +
                    (data.date_birth ? '<br/>День рождения: ' + data.date_birth : ''));
                    $review.find('.comment-object-name').append($container);
                });
            }
        },


        infiniteScrollReviews: function ($reviewsContainer, objId) {
            var loading = false,
                currentOffset = 10,
                limit = app.CONST.REVIEWS_LOAD_QTY,
                isNearBottomOfPage = function () {
                    return $(window).scrollTop() > $(document).height() - $(window).height() - 300;
            };

            $(window).scroll(function () {
                if (loading) {
                    return;
                }

                if (isNearBottomOfPage()) {
                    loading = true;
                    var url = app.CONST.URL + 'map/?act=get_object_reviews&obj_id=' + objId + '&limit=' + limit
                        + '&offset=' + currentOffset;
                    $.getJSON(url, function (data) {
                        $.each(data.reviews, function (k, v) {
                            app.categories.appendNewReview($reviewsContainer, v)
                        });
                        var voteButtons = $('a.comment-object-marker-yes, a.comment-object-marker-no');
                        voteButtons.off('click').on('click', app.bind.voteForComment);
                        currentOffset += limit;
                        loading = false;
                    });
                }
            });
        }
    },
    /**
     * Switch between default input value and empty value
     *
     * @param e event
     */
    inputsSwitcherClick: function(e) {
        var $this = $(this);
        var def = e.data.default[$this.attr('name')],
            current = $this.val();
        if (current === def) {
            $this.val('');
        }
    },

    /**
     * Switch between default input value and empty value
     *
     * @param e event
     */
    inputsSwitcherBlur: function(e) {
        var $this = $(this);
        var def = e.data.default[$this.attr('name')],
            current = $this.val();
        if (current === '') {
            $this.val(def);
        }
    },

    /**
     * Main app init function
     */
    init:function () {
        app.transport.getStationFromCookie();
        app.transport.buildTransportForm();
        app.gmap.initMap();
        app.login.init();
        app.categories.init();
        app.newObject.initAdd();
        app.poster.init();
        app.news.init();
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
    },

    request: {
        get : null/*,
        getGet: function (key) {
            if (app.request.get === null) {
                var get = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    get[decode(arguments[1])] = decode(arguments[2]);
                });
                app.request.get = get;
            }
            return key ? app.request.get[key] : app.request.get;
        }*/
    },

    bind: {
        ratings: function ($obj, initialRating, disabled) {
            $obj.ratings(5, initialRating || 0, disabled || false).bind('ratingchanged', function(event, data) {
                $(this).next('b').html(data.rating);
            });
            return app.bind;
        },

        lunchInfo: function () {
            $('.open-lunch-info').hover(
                function() {$(this).next('.lunch-info').show();},
                function() {$(this).next('.lunch-info').hide();}
            );
            return app.bind;
        },

        postersModal: function () {
            $('.open-popup-poster').on({'mouseenter': function () {}, 'mouseleave': function () {}});
            $('.open-popup-poster').hover(function() {
                $('.popup-poster').hide();
                $(this).find('.popup-poster').show();
            }, function() {
                $(this).find('.popup-poster').hide();
            });
        },

        postersTimeOfEventsLimit: function () {
            $.each($('div.poster-popup-wrap'), function () {
                $(this).find('a.open-popup-poster').slice(app.CONST.POSTERS_EVENT_TIMES_LIMIT).hide();
            });
            $('.open-full-poster-info').on('click', function () {
                var $this = $(this);
                $this.prev().find('.open-popup-poster').show();
                $this.remove();
            });
        },

        objectsFilter: function () {
            var filter = function (e) {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    return false;
                }
                $.each(filters, function (k, v) {
                    $(v).removeClass('active');
                });
                filters[e.data.field].addClass('active');
                app.categories.fillObjectsData($this.attr('data-cat-id'), e.data.field);
                return true;
            };
            var filters = {1: $('#sort-by-name'), 0: $('#sort-by-rating'), 2: $('#sort-by-date')};

            filters[1].on('click', {field: 1}, filter);
            filters[0].on('click', {field: 0}, filter);
            filters[2].on('click', {field: 2}, filter);
            return app.bind;
        },

        voteForComment: function () {
            var $this = $(this);
            if ($this.parent().hasClass('already-voted')) {
                return false;
            }
            $.get(app.CONST.URL + 'map/?act=vote_object_review&id='
                + $(this).parent().attr('data-id') + '&vote=' + $(this).attr('data-val'),
            function (data) {
                if (data.success !== true) {
                    $.jGrowl(data.error, {'add_class': 'fail'});
                } else {
                    $this.next('span').html(parseInt($this.next('span').html()) + 1);
                    $this.parent().addClass('already-voted');
                }
            });
            return true;
        },

        buttonClickCheckIsAuthorized: function (object, subj, objectData) {
            objectData = objectData || {};
            object.on('click', function () {
                if (!app.user.isAuthorized()) {
                    $.jGrowl(
                        'Чтобы ' + subj + 'необходимо зарегистрироваться на сайте.' +
                        ' Если Вы уже зарегистрированы, введите имя пользователя и пароль в верхней правой части окна',
                        {add_class: 'fail'}
                    );
                } else {
                    app.newObject.hideBlocksDuringAdd();
                    app.newObject.renderEditForm(objectData);
                    app.bind.submitNewObject(objectData);
                }
                return false;
            });
        },

        objectItemSendReview: function ($object) {
            $object.on('click', function () {
                if (app.user.isAuthorized()) {
                    $(this).next('.modal').show();
                } else {
                    $.jGrowl(
                        'Чтобы оставить отзыв необходимо зарегистрироваться на сайте.' +
                        ' Если Вы уже зарегистрированы, введите имя пользователя и пароль в верхней правой части окна',
                        {add_class: 'fail', 'position': 'top-left'}
                    );
                }
                return false;
            });
        },

        closeAllModals: function () {
            $('.close-modal').off('click');
            $('.close-modal').on('click', function() {
                $(this).parent('.modal').hide();
            });
        },

        objectSubmitReview: function ($object, detailsObjectId) {
            $object.find('button[name=submit]').on('click', function () {
                var $this = $(this),
                    fields = {
                        'subject': $object.find('input[name=subject]').val(),
                        'msg_text': $object.find('textarea').val()
                    };
                if (detailsObjectId) {
                    fields.obj_id = detailsObjectId;
                    fields.rating = $object.find('div.jquery-ratings-full').length;
                    fields.get_new_data = true;
                }
                $.post(app.CONST.URL + 'map/?act=add_object_review', fields, function (data) {
                    if (data.success === true) {
                        $this.closest('.modal').hide();
                        data.already_voted = true;
                        data.editable = true;
                        var newReview = app.categories.appendNewReview(
                            $('div.comment-object-wrap .comments-list'), data, 'prependTo', 'display-none'
                        );
                        if (newReview) {
                            app.bind.renderReviewEditForm(newReview.find('.comment-edit'));
                        }
                        $('div.comment-object-item.display-none').slideDown();
                    } else {
                        $.jGrowl(data.error, {add_class:'fail'});
                    }
                });
                return false;
            });
        },

        objectSubmitReviewEdit: function (object, reviewId, $reviewContainer) {
            object.find('button[name=submit]').on('click', function () {
                var $this = $(this),
                    fields = {
                        'subject': object.find('input[name=subject]').val(),
                        'msg_text': object.find('textarea').val()
                    };
                $.post(app.CONST.URL + 'map/?act=edit_object_review&review_id=' + reviewId, fields,
                function (data) {
                    if (data.success === true) {
                        $this.closest('.modal').hide();
                        data.already_voted = true;
                        data.editable = true;
                        $reviewContainer.find('.comment-object-text').html(data.msg_text);
                    } else {
                        $.jGrowl(data.error, {add_class:'fail'});
                    }
                });
                return false;
            });
        },

        renderReviewEditForm: function (linkToBind) {
            linkToBind.on('click', function () {
                $('.edit-comment-modal').remove();
                var $this = $(this),
                    item = $.parseJSON(
                        decodeURI($this.closest('div.comment-object-item').find('input[name=object-data]').val())
                    ),
                    $form = $(app.getHtml.reviewForm(item));
                $form.insertAfter(linkToBind).show();
                app.bind.ratings($form.find('.rating-stars'), item.rating, true);
                app.bind.objectSubmitReviewEdit(
                    $form, item.id, linkToBind.closest('div.comment-object-item')
                );
                app.bind.closeAllModals();
            });
        },

        addObjectToMap: function () {
            $('#add-object-to-map').on('click', function () {
                app.newObject.hideBlocksDuringAdd();
                app.newObject.renderAddForm({});
                app.bind.addressAutocomplete();
                app.bind.submitNewObject(false);
            });
        },

        addSubcategorySelect: function () {
            $('div.add-object-form .more-categories').on('click', function () {
                var $selectWrap = $(this).siblings('.select-wrap');
                $selectWrap.append($selectWrap.find('select').last().clone());
            });
        },

        submitNewObject: function (objectData) {
            $('div.add-object-form .modal-submit').on('click', function () {
                var form = $(this).closest('form'), submitData = {}, ids = [];
                $.each(form.find('input,textarea'), function (k, v) {
                    submitData[$(v).attr('name')] = $(v).val();
                });
                $.each(form.find('select[name="cat_ids"]'), function (k, v) {
                    ids.push($(v).val());
                });
                submitData.cat_ids = ids.join();
                submitData.latitude = app.gmap.newObjectMarker.getPosition().lat();
                submitData.longitude = app.gmap.newObjectMarker.getPosition().lng();
                $.post(app.CONST.URL + 'map/modify' + (objectData ? '&obj_id=' + objectData.id : ''), submitData, function (data) {
                    if (data.success !== true) {
                        $.jGrowl(data.error, {add_class: 'fail', position: 'top-left'});
                    } else {
                        $('.add-object-form').remove();
                        app.newObject.showBlocksDuringAdd();
                        $.jGrowl('Благодарим за предоставленную информацию! Ваша заявка будет рассмотрена' +
                            ' администрацией сайта в ближайшее время.', {add_class: 'success', position: 'top-left'});
                    }
                });
                return false;
            });
        },

        addressAutocomplete: function () {
            $('#add-object-form-address').autocomplete({
                source: function (request, response) {
                    app.gmap.geocoderObj.geocode({'address': request.term}, function (result, status) {
                        response($.map(result, function (item) {
                            return {
                                label: item.formatted_address,
                                value: item.formatted_address,
                                latitude: item.geometry.location.lat(),
                                longitude: item.geometry.location.lng()
                            }
                        }));
                    });
                },

                select: function (event, ui) {
                    var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                    marker.setPosition(location);
                    app.gmap.map.setCenter(location);
                },

                open: function () {
                    $(this).autocomplete('widget').css({'z-index': 1000, position: 'absolute'});
                }
            });
        },

        posterCategoryChange: function () {
            var $posterContainer = $('ul.poster-category');
            $posterContainer.on('click', 'a', function () {
                var name = $(this).attr('data-name');
                $posterContainer.find('li').removeClass('active');
                $(this).parent().addClass('active');
                app.poster.loadEvents(name);
            });
        },

        postersEventHover: function ($posters) {
            $posters.find('dt').eq(0).addClass('active');
            $posters.find('dd').eq(0).addClass('active');
            $posters.find('dd').hover(function () {
                $posters.find('dt,dd').removeClass('active');
                $(this).addClass('active');
                $(this).prev().addClass('active');
            });
        },

        postersOpenDetails: function () {
            $('dl.poster-wrap,.posters-footer .see-all').on('click', function () {
                app.newObject.hideBlocksDuringAdd();
                app.categories.buildTabs(0);
                app.poster.buildPosterTab();
                return false;
            });
        },

        newsOpenDetails: function () {
            $('dl.news-wrap,.news-footer .see-all').on('click', function () {
                app.newObject.hideBlocksDuringAdd();
                app.categories.buildTabs(0);
                app.news.buildNewsTab();
                return false;
            });
        },

        newsCategoryChange: function () {
            var $posterContainer = $('ul.news-category');
            $posterContainer.on('click', 'a', function () {
                var name = $(this).attr('data-name');
                $posterContainer.find('li').removeClass('active');
                $(this).parent().addClass('active');
                app.news.loadNews(name);
            });
        },

        postersShowOnMap: function () {
            $('.news-item .show-news-list-map').off('click').on('click', function () {
                console.log($(this).data('id'));
                var URL = app.CONST.URL + 'map?act=get_objects';
                $.get(URL, function (data) {
                    $('section.items-list.object-list').html('');
                    console.log(data);
                    if (data.success) {
                        app.curentSubcategory = id;
                        app.gmap.closeAllInfoWindows();
                        app.gmap.removeAllMarkers();
                        app.objects = [];
                        if (data.objects.length > 0) {
                            for (var i = 0; i < data.objects.length; i++) {
                            }
                        }
                    }
                });
//                app.gmap.showObject($(this).data('id'));
                return false;
            });
        }
    },

    user: {
        justLoggedOut: false,
        isAuthorized: function () {
            return app.user.justLoggedOut ? false : !!app.getCookie('SESS_ID');
        }
    },

    getHtml: {
        reviewForm: function (data, cssClass) {
            cssClass = cssClass || 'edit-comment-modal';
            data = data || {};
            return '<div class="modal ' + cssClass + '">'+
                '<a class="close-modal"></a>'+
                '<div class="modal-header">'+
                '<h3 class="modal-name">Оставить отзыв</h3>'+
                '</div>'+
                '<form id="object-details-send-review-form">'+
                '<label>'+
                'Тема'+
                '<div class="modal-input theme-input">'+
                '<input type="text" name="subject" value="' + (data.subject || '') + '">'+
                '</div>'+
                '</label>'+
                '<label>'+
                'Моя оценка'+
                '<div class="rating-stars"></div>'+
                '</label>'+
                '<div class="clear"></div>'+
                '<div class="add-comment-textarea-wrap">'+
                'Текст отзыва<br>'+
                '<div class="add-comment-textarea">'+
                '<textarea name="text">' + (data.msg_text || '') + '</textarea>'+
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '<button class="blue-btn modal-submit" name="submit">Отправить</button>'+
                '</form>'+
                '</div>';
        },

        objectAdd: function (data) {
            data = data || {};
            data.website = data.website || 'http://example.com/';

            var tmpl = '<div class="add-object-form">' +
                '<h3 class="add-object-title">${form_title}</h3>' +
            '<form>' +
                '<label class="add-subcategory">' +
                'Категория <span class="oblige">*</span>'+
                    '<div class="select-wrap">' +
                        '<select name="cat_ids">{{html subcategories}}</select>' +
                    '</div>' +
                    '<a class="more-categories">Ещё категорию +</a>' +
                '</label>' +
                '<label>' +
                'Адрес <span class="oblige">*</span><br>' +
                '<div class="modal-input street-input">' +
                    '<input name="address" id="add-object-form-address" type="text" value="Улица, дом" onfocus="if (this.value==\'Улица, дом\') this.value=\'\';" onblur="if (this.value==\'\'){this.value=\'Улица, дом\'}">' +
                    '</div>' +
                    '<div class="clear-l"></div>' +
                '</label>' +
                '<a class="object-add-onmap">Отметить на карте</a>' +
                '<label>' +
                'Веб-сайт:' +
                '<div class="modal-input">' +
                    '<input name="website" type="text" onfocus="if (this.value==\'http://example.com/\') this.value=\'\';" onblur="if (this.value==\'\'){this.value=\'http://example.com/\'}" value="${website}">' +
                    '</div>' +
                '</label>' +
                '<label>' +
                'E-mail:' +
                '<div class="modal-input">' +
                    '<input name="email" type="text" value="example@mail.com" onfocus="if (this.value==\'example@mail.com\') this.value=\'\';" onblur="if (this.value==\'\'){this.value=\'example@mail.com\'}">' +
                    '</div>' +
                '</label>' +
                '<label class="object-add-area">' +
                'Телефоны:  <br>' +
                    '<textarea name="phone">${phone}</textarea>' +
                '</label>' +
                '<label>' +
                'Название <span class="oblige">*</span>' +
                '<div class="modal-input object-add-name">' +
                    '<input name="name" type="text" value="${name}">' +
                    '</div>' +
                '</label>' +
                '<label class="object-add-area">' +
                'График работы:  <br>' +
                    '<textarea name="worktime">${worktime}</textarea>' +
                '</label>' +
                '<label class="object-add-area">' +
                'Перерывы:  <br>' +
                    '<textarea name="worktime_breaks">${worktime_breaks}</textarea>' +
                '</label>' +
                '<label class="object-add-area">' +
                'Описание:  <br>' +
                    '<textarea name="descr_full">${descr_brief}</textarea>' +
                '</label>' +
                '<label class="object-add-area">' +
                'Ключевые слова:  <br>' +
                    '<textarea name="keywords">${keywords}</textarea>' +
                '</label>' +
                        '<button class="blue-btn modal-submit">Сохранить</button>' +
                    '</form>' +
                '</div>';
            return $.tmpl(tmpl, data);
        },

        posterDetails: function (data) {
            data = data || {};

            var tmpl = '<div class="list-item poster-item">'
                + '<div class="poster-list-img">'
                + '<img src="${img_src}">'
                + '</div>'
                + '<a href="" class="list-item-name">${title}</a>'
            + '<p class="list-item-info">'
            + 'Категория: <a href="">${genre}</a> <br>'

            + '</p><div class="poster-popup-wrap">'
            + 'Ближайшие сеансы:{{each schedule}}'
                + '<a href="" class="open-popup-poster">${$value.time}<div class="popup-poster"><table><tbody><tr><th>Кинотеатр:</th><td>${$value.obj_title}</td></tr><tr><th>Цена:</th><td>{{html $value.price}}</td></tr></tbody></table></div>, </a>'
            + '{{/each}}</div>'
                + '<a class="open-full-poster-info">Полное рассписание сеансов</a>'
                + '<p></p>'
                + '<p class="poster-list-content">{{html descr}}</p>'

                + '<div class="object-item-footer">'
                    + '<div class="rating-poster">'
                        + '<a href="">IMDB 9.7</a>'
                        + '<span>298</span>'
                    + '</div>'
                    + '<div class="rating-poster">'
                        + '<a href="">КиноПоиск 9.3</a>'
                        + '<span>646</span>'
                    + '</div>'
                + '</div>'
            + '</div>';
            return $.tmpl(tmpl, data);
        },

        newsDetails: function (data) {
            data = data || {};

            var tmpl = '<div class="list-item news-item">'
                + '{{if obj_id}}<a href="#" class="show-news-list-map gray-btn" data-id="${obj_id}">' +
                '<span class="object-item-show-map" data-id="${obj_id}"></span></a>{{/if}}'
            + '<a href="#" class="news-list-name">${obj_title}</a>'
            + '<a href="#"><h4 class="news-list-h4">${title}</h4></a>'
            + '<span class="news-list-date">${date_time_str}</span>'
            + '<p class="list-item-preview">${short_text}</p>'
            + '<div class="object-item-footer">'
                + '<span class="useful-news-list">Новость полезна?</span>'
                + '<div class="news-useful">'
                + '<a class="news-useful-yes">Да</a> <span class="news-useful-yes-wrap">2</span> / <a class="news-useful-no">Нет</a> <span class="news-useful-no-wrap">2</span>'
            + '</div>'
            + '</div>'
            + '</div>';
            return $.tmpl(tmpl, data);
        }
    },

    newObject: {
        initAdd: function () {
            app.bind.addObjectToMap();
        },

        renderAddForm: function (data) {
            data.form_title = 'Добавить объект';
            data.customPos = false;
            app.newObject.renderObjectForm(data);
        },

        renderEditForm: function (data) {
            data.form_title = 'Редактирование объекта';
            data.customPos = {lat: data.latitude, lng: data.longitude};
            app.newObject.renderObjectForm(data);
            $('select[name="cat_ids"]').val(data.cat_ids[0] || 65);
        },

        renderObjectForm: function (data) {
            $('.add-object-form').remove();
            data.subcategories = app.newObject.getSubcategoriesForForm();
            app.getHtml.objectAdd(data).appendTo('.object-list');
            app.bind.addSubcategorySelect();
            app.gmap.removeAllMarkers();
            app.gmap.closeAllInfoWindows();
            app.gmap.geocoderInit(data.customPos);
        },

        getSubcategoriesForForm: function () {
            var subcategories = '';
            $.each(app.map_categories, function (k, v) {
                $.each(v.subcategories, function (kk, subcategory) {
                    subcategories += ('<option value="' + subcategory.id + '" data-id="' + subcategory.id + '">'
                        + subcategory.title + '</option>');
                });
            });
            return subcategories;
        },

        hideBlocksDuringAdd: function () {
            $('.list-item.object-item').addClass('has-been-hidden').hide();
            $('div.object-details').addClass('has-been-hidden').hide();
            $('.add-object-form').addClass('has-been-hidden').hide();
            $('.category-list:not(.hide-subcategory)').addClass('hide-subcategory').addClass('has-been-hidden');
        },

        showBlocksDuringAdd: function () {
            $('.category-list.has-been-hidden').removeClass('hide-subcategory');
            $('div.object-details.has-been-hidden').show();
            $('.list-item.object-item.has-been-hidden').show();
            $('.add-object-form.has-been-hidden').show();
        }
    },

    poster: {
        init: function () {
            app.bind.posterCategoryChange();
            app.poster.loadEvents(app.CONST.POSTER_DEFAULT_CATEGORY);
            app.bind.postersOpenDetails();
        },

        loadEvents: function (category) {
            var url = app.CONST.URL + 'afisha/'
                + '?act=get_afisha'
                + '&when=today'
                + (category ? '&type=' + category : '');
            $.get(url, function (data) {
                if (data.success === true) {
                    var html = '',
                        posterWrap = $('.posters-footer .poster-wrap');
                    $.each(data.afisha, function (k, v) {
                        if (k > app.CONST.POSTER_LOAD_LIMIT - 1) {
                            return false;
                        }
                        html += '<dt><a><img' +
                            ' src="' + app.CONST.URL + 'afisha/?act=get_poster&id=' + v.id + '"/></a></dt>' +
                            '<dd><a>' + v.title + '</a></dd>';
                    });
                    posterWrap.html(html);
                    app.bind.postersEventHover(posterWrap);
                }
            });
        },

        buildPosterTab: function () {
            $('.list-item.poster-item').remove();
            var url = app.CONST.URL + 'afisha/'
                + '?act=get_afisha'
                + '&when=today';
            $.get(url, function (data) {
                if (data.success === true) {
                    $.each(data.afisha, function (k, v) {
                        data.afisha[k].img_src = app.CONST.URL + 'afisha/?act=get_poster&id=' + v.id;
                    });
                    $('.filter-wrap').after(app.getHtml.posterDetails(data.afisha));
                    app.bind.postersModal();
                    app.bind.postersTimeOfEventsLimit();
                }
            });
        }
    },

    news: {
        init: function () {
            app.bind.newsCategoryChange();
            app.news.loadNews();
            app.bind.newsOpenDetails();
        },

        loadNews: function (category) {
            var url = app.CONST.URL + 'news/'
                + '?act=get_news'
                + '&limit=5'
                + (category ? '&type=' + category : '');
            $.get(url, function (data) {
                if (data.success === true) {
                    var html = '',
                        newsWrap = $('.news-footer .news-wrap');
                    $.each(data.news, function (k, v) {
                        if (k > app.CONST.POSTER_LOAD_LIMIT - 1) {
                            return false;
                        }
                        var imgUrl = v.has_poster
                            ? app.CONST.URL + 'news/?act=get_poster&id=' + v.id
                            : app.CONST.NEWS_IMAGE_PLACEHOLDER;
                        html += '<dt><a><img' + ' src="' + imgUrl + '"/></a></dt>' +
                            '<dd><a>' + v.title + '</a></dd>';
                    });
                    newsWrap.html(html);
                    app.bind.postersEventHover(newsWrap);
                }
            });
        },

        buildNewsTab: function () {
            $('.list-item.news-item').remove();
            var url = app.CONST.URL + 'news/'
                + '?act=get_news';
            $.get(url, function (data) {
                if (data.success === true) {
                    $.each(data.news, function (k, v) {
                        data.news[k].img_src = v.has_poster
                            ? app.CONST.URL + 'news/?act=get_poster&id=' + v.id
                            : app.CONST.NEWS_IMAGE_PLACEHOLDER;
                    });
                    $('.filter-wrap').after(app.getHtml.newsDetails(data.news));
                    app.bind.postersModal();
                    app.bind.postersTimeOfEventsLimit();
                    app.bind.postersShowOnMap();
                }
            });
        }
    }
};
