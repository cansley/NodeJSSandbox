/**
 * Created by cxa70 on 11/18/2014.
 */
$(document).ready(function () {
    $('#topNav').load('topNav.html', function(){
        var topNav = $('#topNav');
        var pageName = location.pathname;
        var navItem = $('li a[href$="' + pageName + '"]').parent();
        var brand = $('.navbar-brand');
        brand[0].innerHTML = 'Something-Something ' + document.title;
        navItem.addClass("active");
    }, 'html');
});