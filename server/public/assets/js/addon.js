'use strict';
window.ref = '';

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    ref = searchParams.get('ref');

});

// OTHER CALLS
let lastScrollTop = 0;
$(window).scroll(function (event) {

});



window.topScroll = () => {
    $(document).ready(function () {
        $('html,body').animate({
                scrollTop: 200
            },
            'slow'
        );
    });
};