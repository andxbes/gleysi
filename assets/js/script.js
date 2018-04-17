/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


jQuery(document).ready(function ($) {
    var $slider = $(".slider");
    if ($slider.length > 0) {
        var $body = $('body');
        $slider.slick({
            autoplay: true,
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true
        });
//    $slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
//        var backgroundColor = $(slick.$slides.get(currentSlide)).data('background');
//        $body.css('background-color',backgroundColor);
//    });

        $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            var backgroundColor = $(slick.$slides.get(nextSlide)).data('background');
            $body.css('background-color', backgroundColor);
        });
    }
});


(function ($) {
    $(document).ready(function () {
        function addMap() {
            $maps = $('.map__place');
            for (var i = 0; i < $maps.length; i++) {
                var $container = $($maps[i]);
                var positionData = $container.data('map-position');
                var mapCenter = $container.data('map-center');

                var hintContent = $container.data('hint-content') == undefined ? "" : $container.data('hint-content');

                var icon = {};
                icon.href = $container.data('icon') == undefined ? "/favicon.ico" : $container.data('icon');
                icon.height = $container.data('ico_h') == undefined ? 25 : parseInt($container.data('ico_h'));
                icon.width = $container.data('ico_w') == undefined ? 25 : parseInt($container.data('ico_w'));

                icon.offset_h = $container.data('ico_offset_h') == undefined ? (0 - icon.height) : parseInt($container.data('ico_offset_h'));
                icon.offset_w = $container.data('ico_offset_w') == undefined ? (0 - icon.width) / 2 : parseInt($container.data('ico_offset_w'));

                console.info(icon);
                var address = $container.data('address');
                if (positionData) {
                    var idconteiner = $container.attr('id');
                    var targetCoords = {};
                    targetCoords.pointer = positionData.split(",");
                    targetCoords.center = mapCenter ? mapCenter.split(",") : targetCoords.pointer;

                    addNextMap(idconteiner, targetCoords, address, hintContent, icon);
                }
            }
        }
        function addNextMap(idconteiner, targetCoords, address, hintContent, icon) {
            ymaps.ready(function () {
                var multiRoute = undefined;
                var geolocation = ymaps.geolocation;
                var $mapsNeighbor = $("#" + idconteiner).next(".mapsNeighbor");
                // Создаем кнопку.
                var showDetails = new ymaps.control.Button({
                    data: {content: "Схема проезда общественным транспортом"},
                    options: {selectOnClick: true}
                });
                // Объявляем обработчики для кнопки.
                showDetails.events.add('select', function () {
                    $mapsNeighbor.show();//показываем панораму
                    setCurentPosition();
                });
                showDetails.events.add('deselect', function () {
                    $mapsNeighbor.hide();//скрываем панораму
                    myMap.geoObjects.remove(multiRoute);//удаляем маршрут с карты 
                    multiRoute.options.unset("routeWalkMarkerIconContentLayout");
                });


                var myMap = new ymaps.Map(idconteiner, {
                    center: targetCoords.center,
                    zoom: 16
                }, {
                    buttonMaxWidth: 300,
                    searchControlProvider: 'yandex#search'
                }),
                        myPlacemark = new ymaps.Placemark(targetCoords.pointer, {
                            hintContent: hintContent,
                            balloonContent: address
                        }, {

                            // Опции.
                            // Необходимо указать данный тип макета.
                            iconLayout: 'default#image',
                            // Своё изображение иконки метки.
                            iconImageHref: icon.href,
                            // Размеры метки.
                            iconImageSize: [icon.width, icon.height],
                            // Смещение левого верхнего угла иконки относительно
                            // её "ножки" (точки привязки).
                            iconImageOffset: [icon.offset_w, icon.offset_h]
                        });
                myMap.geoObjects.add(myPlacemark);
                myMap.controls.add(showDetails);//кнопка отображающая,скрываеющая , панораму , путь . 
                //методы асинхронные, не известно кто быстрее обнаружит 
                function setCurentPosition() {
                    geolocation.get({
                        provider: 'yandex',
                        mapStateAutoApply: true
                    }).then(function (result) {
                        //console.info(result.geoObjects.position);
                        //Думаю от браузера точнее координаты 
                        if (multiRoute === undefined) //на случай если браузер не даст координат .
                            myMap.geoObjects.add(getmultiRoute(result.geoObjects.position));
                    });
                    geolocation.get({
                        provider: 'browser',
                        mapStateAutoApply: true
                    }).then(function (result) {
                        //console.info(result.geoObjects.position);
                        //тестовые координаты 
                        //result.geoObjects.position = [55.734876, 37.59308];
                        if (multiRoute !== undefined)
                            myMap.geoObjects.remove(multiRoute);
                        myMap.geoObjects.add(getmultiRoute(result.geoObjects.position));
                    });
                }
                function getmultiRoute($position) {
                    //маршрут
                    multiRoute = new ymaps.multiRouter.MultiRoute({
                        referencePoints: [
                            $position, //координаты клиента 
                            address
                        ],
                        params: {
                            routingMode: 'masstransit'
                        }
                    }, {
                        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                        boundsAutoApply: true
                    });
                    return multiRoute;
                }
            });
        }
        // качаем карты  
        $.getScript("//api-maps.yandex.ru/2.1/?lang=ru_RU", function () {
            console.info("api-maps downloaded");
            addMap();
        });
    });
}(jQuery));

jQuery(document).ready(function ($) {
    var costSlider = $('#cost__slider');
    var input_min_value = $("#cost__minimum-input");
    var input_max_value = $("#cost__maximum-input");
    
    var $displayMax = $('.cost__maximum');
    var $displayMin = $('.cost__minimum');

    if (costSlider.length > 0 && input_max_value.length > 0 && input_min_value.length > 0) {


        noUiSlider.create(costSlider[0], {
            start: [100, 500],
            step: 10,
            connect: true,
            range: {
                'min': 0,
                'max': 750
            }
        });

        costSlider[0].noUiSlider.on('update', function (values, handle) {

            var value = Math.round(values[handle]);

            if (handle) {
                input_max_value[0].value = value;
                $displayMax.text(value);
            } else {
                input_min_value[0].value = value;
                $displayMin.text(value);
            }
        });
    }


});

jQuery(document).ready(function ($) {
    $('.sort select').niceSelect();
});