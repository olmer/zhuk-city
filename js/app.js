app = {
    CONST: {
        app_url: 'http://test.zhukcity.ru/',
        worktime_min: 0, //values to display active/unactive object
        worktime_max: 0
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
            var URL = app.CONST.app_url + 'transport?act=get_schedule&type=' + app.transport.transportType + '&dep_from=' + fromVal + '&arr_to=' + toVal + '&when=today&limit=' + app.transport.transportLimit;
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
                'Категория: <a>Банки</a> <br>' +
                'Адрес: <a>' + object.address + '</a> <br>' +
                'Телефон: ' + object.phone +
                '</div>' +
                '<div class="object-onmap-time">' +
                object.worktime +
                '</div>' +
                '<div class="object-onmap-footer">' +
                '<span class="object-onmap-rating">Рейтинг: <b>' + object.rating + '</b></span>' +
                '<a class="object-onmap-comment">Оставить отзыв</a>' +
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
//                console.log(app.objects[i].mapItem.marker);
                app.objects[i].mapItem.marker.setMap(null);
            }
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
            if (app.getCookie('SESS_ID')) {
                app.login.loadProfileData($loginFormUnauthorized, $loginFormAuthorized);
            }

            //Bind forgot password actions
            app.login.forgotPasswordInit();

            // Login click
            $loginBtn.on('click', function () {
                $.post(app.CONST.app_url + 'profile/?act=login', {
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
                $.get(app.CONST.app_url + 'profile/?act=logout', function (data) {
                    if (data.success === true) {
                        $loginFormUnauthorized.css('display', 'block');
                        $loginFormAuthorized.css('display', 'none');
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
                    $field.val(def || '');
                });
                $.post(app.CONST.app_url + 'profile/?act=captcha', function (data) {
                    captchaId = data.code_id;
                    $('div.register-modal-register form label img').attr('src',
                        app.CONST.app_url + 'images/code.png?id=' + data.code_id);
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
                $.post(app.CONST.app_url + 'profile/?act=captcha', function (data) {
                    captchaId = data.code_id;
                    $('div.forgot-modal form label img').attr('src',
                        app.CONST.app_url + 'images/code.png?id=' + data.code_id);
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

                $.post(app.CONST.app_url + 'profile/password', data, function (data) {
                    if (data.success === false) {
                        app.login.displayErrorByField(formSelector, data.field, data.error);
                    } else {
                        app.login.clearErrors(formSelector);
                        $.jGrowl('На Ваш E-mail отправлено письмо со ссылкой для смены пароля');
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
            form = 'div.register-modal-' + actionType + ' form ';
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
            $.post(app.CONST.app_url + 'profile/' + (actionType === 'register' ? 'register' : 'edit' ) + '/', data,
                function (data) {
                    if (data.success === false) {
                        app.login.displayErrorByField(form, data.field, data.error);
                    } else {
                        app.login.clearErrors(form);
                        $.jGrowl(actionType === 'register'
                            ? 'Вы были успешно зарегистрированы!'
                                + 'Введите имя пользователя и пароль для авторизации на сайте'
                            : 'Изменения сохранены');
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
            $.post(app.CONST.app_url + 'profile/edit?act=get_profile', function (data) {
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
            var $subcategories = $('#category-list div.subcategory a').on('click', function () {
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
            var URL = app.CONST.app_url + 'map?act=get_objects&cat_ids=' + id + '&sort_by=' + (sortBy || 0);
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

        buildTabs:function (activeTab, categoryId, activeFilter) {//too much arguments. todo: think
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
                    .addClass(item.data.operating_minutes > app.CONST.worktime_max ? 'online' : 'offline')
                    .html(item.data.operating_minutes > app.CONST.worktime_max ? 'работает' : 'не работает')))
                    .append($('<a class="list-item-name">')
                    .html(item.data.name))
                    .append($('<p class="list-item-info">').html(
                        'Адрес: <a class="wo-underscore">' + item.data.address + '</a> <br>' +
                        (item.data.phone ? 'Телефон: ' + item.data.phone.replace('\n', '<br/>') + '  <br>' : '') +
                        (item.data.website ? 'Сайт: <a href="' + item.data.website + '" target="_blank" class="website-link wo-underscore">'
                            + item.data.website.split('/')[2] + '</a> <br>' : '')
                    ))
                    .append($('<div class="object-list-time">')
                    .append($('<ul class="object-list-time-details">')
                    .append($('<li>' + item.data.worktime.replace('\n', '<br/>') + '</li>'))
                    .append(item.data.worktime_breaks === '' ? '' : $('<li>') //do not show link and items if empty
                        .html(
                            '<a class="open-lunch-info">перерывы</a>' +
                            '<div class="lunch-info">' +
                            '<table>' +
                            '<tr>' +
                            '<th>' + item.data.worktime_breaks.replace('\n', '<br/>') + '</th>' +
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

        openObjectDetails:function (id) {//item details
            $.getJSON(app.CONST.app_url + 'map/?act=get_object&obj_id=' + id, function (data) {
                $('.list-item.object-item').remove();
//                console.log(data);

                var details = $('<div class="list-item object-details">')
                    .append(!data.operating_minutes ? '' : ($('<span class="status-work">')
                    .addClass(data.operating_minutes > app.CONST.worktime_max ? 'online' : 'offline')
                    .html(data.operating_minutes > app.CONST.worktime_max ? 'работает' : 'неработает')))
                    .append('<a class="list-item-name">' + (data.full_name ? data.full_name : data.name) + '</a>')
                    .append('<p class="list-item-info">' + (data.address ?
                    'Адрес: <a class="wo-underscore">' + data.address.replace('\n', '<br/>') + '</a> <br>' : '') +
                    (data.phone ? 'Телефон: ' + data.phone.replace('\n', '<br/>') + '  <br>' : '') +
                    (data.website ? 'Сайт: <a href="' + data.website + '" target="_blank" class="website-link wo-underscore">'
                    + data.website.split('/')[2] + '</a> <br>' : '') + // parse domain from link
                    '</p>')
                    .append('<div class="object-list-time">'+
                    '<ul class="object-list-time-details">'+
                    '<li>' + data.worktime.replace('\n', '<br/>') + '</li>'+ (data.worktime_breaks ?
                    '<li>'+
                    '<table>'+
                    '<tbody><tr>'+
                    '<td>' + data.worktime_breaks.replace('\n', '<br/>') + '</td>'+
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
                    '<a class="gray-btn">В закладки</a>'+
                    '</div>'+
                    '</div>');

                var gallery = $('<ul>'), links = '';
                $.each(data.attachments, function (k, v) {
                    if (v.type !== 'image' || v.has_thumb !== true) {
                        links += '<a' +
                            ' href="' + app.CONST.app_url +'map/attachments/' + v.id + '"' +
                            ' alt="' + v.descr + '">' + (v.title ? v.title : v.filename) + '</a>';
                    } else {
                        gallery.append('<li><a class="lightbox-open"' +
                            ' data-title="' + v.title + '"'+
                            ' data-descr="' + v.descr + '"'+
                                ' href="' + app.CONST.app_url +'map/attachments/' + v.id + '">' +
                            '<img' +
                                ' src="' + app.CONST.app_url + 'map/attachments/thumb/' + v.id + '"' +
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
                    '<a class="gray-btn add-comment-object open-modal">Оставить отзыв</a>'+
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
                    '<div class="rating-stars"></div>'+
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
                    //'<a class="show-all-comments-object">Показать все</a>'+
                    '<div class="clear-r"></div>'+
                    '<section class="comments-list">'+
                    '</section>'+
                    '</div>'+
                    '</div>')
                    .appendTo('.items-list.object-list');

                app.bind.ratings($('div.rating-stars'), data.rating, true).lunchInfo();

                if (data.reviews.length) {
                    for (var i = 0; i < data.reviews.length; i++) {
                        var item = data.reviews[i];
                        $('<div class="comment-object-item">' +
                            ' <div class="comment-object-info">'+
                            '<a class="comment-object-name ' + (item.user_gender === 'M' ? 'male' : 'female') + '">'
                                + item.user_name + '</a>'+
                            '<span class="comment-object-date">' + item.date_time + '</span>'+
                            '<div class="comment-object-mark-new">Оценка: <br/>'+
                            '<span>' + item.rating + '</span>'+
                            '</div>'+
                            '</div>'+
                            '<div class="comment-object-content">' +
                            '<p class="comment-object-text">' + item.msg_text + '</p>'+
                            '<div class="comment-object-marker">'+
                            'Отзыв полезен?'+
                                '<span class="comment-object-marker-ins">'+
                                    '<a class="comment-object-marker-yes green">Да</a> 10 / '+
                                    '<a class="comment-object-marker-no red">Нет</a> 15'+
                                '</span>'+
                            '</div>'+
                            '</div>' +
                            '<div class="clear"></div>' +
                            '</div>').appendTo('.comments-list')
                    }
                }

                $('.gray-btn.back-object-list').bind('click', function () {
                    $('.items-list').empty();
                    app.categories.printSubcategoryItems();
                });

                $("a.lightbox-open").lightBox({
                    imageBtnClose: 'images/lightbox-btn-close.gif',
                    imageBtnPrev: 'images/lightbox-btn-prev.gif',
                    imageBtnNext: 'images/lightbox-btn-next.gif'
                });

                app.gmap.showObject(id);
            })
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
        get : null,
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
        }
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
        }
    },

    user: {
        isAuthorized: function () {
            return false;
        }
    }
};
