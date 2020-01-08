// !function () {
//     'use strict';
//     var gWindow = $(window);
//
//     //Formstyler
//     function initFormstyler() {
//         var elementForm = $('.formstyler');
//         if (elementForm.length && $.fn.styler()) {
//             elementForm.addClass('visible').styler();
//         }
//     }
//
//     //function initValidDefaultSettings() {
//         //http://jqueryvalidation.org/documentation/
//         //if ($.fn.validate) {
//             //$.validator.setDefaults({
//                 //errorPlacement: function (error, element) {
//                     //error.appendTo(element.closest('.control-group').find('.controls'));
//                 //},
//                 //showErrors: function(errorMap, errorList) {
//                 // Do nothing here
//                 //},
//                 //highlight: function (element) {
//                     //$(element).closest('.control-group').removeClass('has-success').addClass('has-error');
//                 //},
//                 //success: function (element) {// For valid OFF
//                     //element.closest('.control-group').removeClass('has-error');
//                     //element.remove();
//                 //}
//                 //success: function(element) {// For valid ON
//                 //    element.addClass('valid').closest('.control-group').removeClass('has-error').addClass('has-success');
//                 //}
//             //});
//         //}
//     //}
//
//     function displayFiles(files, imgList) {
//         $.each(files, function(i, file) {
//             // Создаем элемент li и помещаем в него название, миниатюру,
//             // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
//             var li = $('<li/>').appendTo(imgList);
//             var divfile = $('<div/>').appendTo(li);
//             divfile.text(file.name);
//             var delfile = $('<div class="file-multiple_del">d<div/>').appendTo(li);
//             li.get(0).file = file;
//
//             // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
//             // инфу обо всех файлах
//             var reader = new FileReader();
//             reader.onload = (function(divFile) {
//                 return function(e) {
//                     divFile.attr('data-src', e.target.result);
//                     /* ... обновляем инфу о выбранных файлах ... */
//                 };
//             })(divfile);
//
//             reader.readAsDataURL(file);
//
//             $(".file-multiple_del").on("click", function(){
//
//                 $(this).parent().remove();
//
//             });
//         });
//     }
//     // второй вариант
//     // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
//     function initFileMultiple() {
//         var $file = $('.file-multiple');
//         if (!$file.length) {return false;}
//         $file.each(function () {
//             var self = $(this);
//             var $fileInput = self.find('input[type="file"]');
//             var $fileList = self.find('.file-multiple_list');
//             $fileInput.on('change', function () {
//                displayFiles(this.files, $fileList)
//             });
//         });
//     }
//
//     //Ширина скроллбара
//     // function _scrollWidth() {
//     //     return window.innerWidth - document.body.clientWidth;
//     // }
//
//     //Зарезание текста
//     // function dotDot() {
//     //     var dotBlock = $('.dot');
//     //     if (dotBlock.length && $.fn.dotdotdot) {
//     //         dotBlock.each(function () {
//     //             $(this).dotdotdot();
//     //         });
//     //     }
//     // }
//
//     //-----МОБИЛЬНОЕ МЕНЮ-----
//     function menuMobileCollapse() {
//         var menu = $('.menu-mobile');
//         if (!menu) {return false;}
//         var level = menu.find('.collapse');
//         level.each(function () {
//             var self = $(this);
//             self.on('show.bs.collapse', function () {
//                 $(this).parents('li').addClass('open');
//             });
//             self.on('hide.bs.collapse', function () {
//                 $(this).parents('li').removeClass('open');
//             });
//         });
//     }
//     //закрыть
//     function _closeMMenu($block, $bg) {
//         $block
//             .removeClass('m-open');
//         $bg.fadeOut(500);
//     }
//     //открыть
//     function _openMMenu($block, $bg, $menu) {
//         $menu.addClass('m-open-menu');
//         $block
//             .addClass('m-open')
//             .css({
//                 'overflow': 'hidden'
//             });
//         $bg.fadeIn(500);
//     }
//     function myMobileMenu() {
//         var $menu = $('.m-menu');
//         if (!$menu) { return false; }
//         var winWidth = window.innerWidth;
//         var $body = $('body');
//         var $bg = $('.blackout');
//         if (winWidth < 1280) {
//             var $btn = $('.humb');
//             var $btnClose = $('.m-menu-close');
//             $btn.off('click.slideout');
//             $bg.off('click.slideout');
//             //клик на humb
//             $btn.on('click.slideout', function () {
//                 _openMMenu($body, $bg, $menu)
//             });
//             //клик на close
//             $btnClose.on('click.slideout', function () {
//                 _closeMMenu($body, $bg);
//                 setTimeout(function() {
//                     $menu.removeClass('m-open-menu');
//                     $body.css({
//                         'overflow': ''
//                     });
//                 }, 500);
//             });
//             //клик на bg (закрыть)
//             $bg.on('click.slideout', function () {
//                 _closeMMenu($body, $(this));
//                 setTimeout(function() {
//                     $menu.removeClass('m-open-menu');
//                     $body.css({
//                         'overflow': ''
//                     });
//                 }, 500);
//             });
//             if ($.fn.mCustomScrollbar) {
//                 $menu.mCustomScrollbar({
//                     theme: "dark-3"
//                 });
//             }
//         } else {
//             _closeMMenu($body, $bg);
//             setTimeout(function() {
//                 $menu.removeClass('m-open-menu');
//                 $body.css({
//                     'overflow': ''
//                 });
//             }, 500);
//         }
//     }
//     //-----END--МОБИЛЬНОЕ МЕНЮ-----
//
//     //-----Tabs-----
//     function tabs() {
//         var $block = $('.tabs');
//         if (!$block.length) {
//             return false;
//         }
//         $block.each(function () {
//             var selfTabs = $(this);
//             var $item = selfTabs.find('.tab');
//             var $panel = selfTabs.find('.tab__panel');
//             var wWidth = window.innerWidth;
//             var heightList = '';
//
//             $item.each(function () {
//                 var self = $(this);
//                 var selfP = self.find('.tab__panel');
//                 var heightItem = '';
//
//                 if (wWidth > 767) {
//                     if (self.hasClass('active')) {
//                         heightList = selfP.innerHeight();
//                     }
//                 } else {
//                     if (self.hasClass('active')) {
//                         heightItem = selfP.find('.tab__panel-wrap').innerHeight();
//                     } else {
//                         heightItem = '';
//                     }
//                 }
//
//                 selfP.css({'height': heightItem});
//
//                 self.off('click').on('click', function () {
//                     $item.each(function () {
//                         $(this).removeClass('active');
//                     });
//                     $panel.each(function () {
//                         $(this)
//                           .removeClass('active')
//                           .css({'height': ''});
//                     });
//
//                     if (wWidth > 767) {
//                         var thPadding = self.find('.tab__panel-wrap').innerHeight();
//                         selfTabs.css({'padding-bottom': thPadding});
//                     }
//                     else {
//                         selfTabs.css({'padding-bottom': ''});
//                         selfP.css({'height': selfP.find('.tab__panel-wrap').innerHeight()});
//
//                         // $('body, html').animate({
//                         //     scrollTop: self.offset().top
//                         // }, 500);
//                     }
//                     self.addClass('active');
//                     selfP.addClass('active');
//                 });
//             });
//
//             selfTabs
//               .addClass('tabsActive')
//               .css({'padding-bottom': heightList});
//         });
//     }
//
//     $(function () {
//         initFormstyler();
//     });
//     gWindow.on('load', function () {
//         menuMobileCollapse();
//         myMobileMenu();
//         initFormstyler();
//         initFileMultiple();
//         tabs();
//     });
//     gWindow.on('resize', function () {
//         myMobileMenu();
//         tabs();
//     });
// }();
//
// $(function () {
//     svg4everybody();
// });

'use strict';

$(function () {
    svg4everybody();
});