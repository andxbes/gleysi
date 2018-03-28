/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


jQuery(document).ready(function ($) {
    var $slider = $(".slider");
    var $body = $('body');
    $slider.slick({
        autoplay:true,
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
        $body.css('background-color',backgroundColor);
    });
});