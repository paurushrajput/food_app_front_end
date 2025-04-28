$(document).ready(function () {
    $("#Screen").owlCarousel({
        margin: 15,
        center:true,
        smartSpeed: 1000,
        autoplay: 5000,
        dots: false,
        nav: true,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        loop: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2, 
            },
            1000: {
                items: 5,
            },
        },
    });
});

// Onclick Scroll

$(document).ready(function () {
    $("a").on("click", function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $("html, body").animate(
                { scrollTop: $(hash).offset().top, },
                800,
                function () { 
                    window.location.hash = hash;
                }
            );
        }
    });
});

// On Scroll Header Fixed

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $("header").addClass("Fixed");
    } else {
        $("header").removeClass("Fixed");
    }
});

// Navbar Active

$(document).ready(function () {
    $('.nav-item').bind('click', function() { 
        $('.active').removeClass('active') 
        $(this).addClass('active');
    });
});