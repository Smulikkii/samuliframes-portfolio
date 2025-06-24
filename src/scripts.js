// Global variables for mobile menu
var MOBILE_BREAKPOINT = 768;

// Mobile menu functions
function openNav() {
    if (isMobileView()) {
        // Make sure the nav is visible before setting width
        document.getElementById('nav').style.top = "0";
        document.getElementById('nav').style.width = '250px';
    }
}

function closeNav() {
    if (isMobileView()) {
        document.getElementById('nav').style.width = '0';
    }
}

// Helper function to check if we're in mobile view
function isMobileView() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}



var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
    if (!isMobileView()) {
        var currentScrollPos = window.pageYOffset;
        
        if (prevScrollpos > currentScrollPos) {
            document.getElementById("nav").style.top = "0";
        } else {
            document.getElementById("nav").style.top = "-100px";
        }
        
        prevScrollpos = currentScrollPos;
    }
};

// Document ready function for other functionality
$(document).ready(function() {
   
    // Smooth scrolling for anchor links
    $('.js-anchor-link').click(function(e) {
        var href = $(this).attr('href');

        // Check if it's a link to another page with an anchor
        if (href.indexOf('index.html#') === 0) {
             // ... (rest of the external link check code) ...
            return true;
        }

        // We're on the same page, handle smooth scrolling
        e.preventDefault();
        var target = $(href);
        if (target.length) {
            // Adjust for navbar height - CONDITIONALLY
            var navHeight = 0; // Default to 0 offset
            if (isMobileView()) {
                 // Use the height of the hamburger button container as the offset on mobile
                 navHeight = $('#hamburger').outerHeight(true) || 0; // outerHeight(true) includes margin
            } else {
                 // Use the desktop nav height
                 navHeight = $('#nav').outerHeight() || 0;
            }
            // --- END of changed block ---

            var scrollTo = target.offset().top - navHeight;
            $('body, html').animate({ scrollTop: scrollTo }, 800);

            // Close the navigation menu if it's open (for small screens)
            // This should happen AFTER calculation but can run concurrently with animation
            if (isMobileView()) {
                closeNav();
            }
        }
    });
    // Click event for the hamburger icon
    $('#hamburger').click(function() {
        openNav();
    });

    // Click event for the close button
    $('#close-nav').click(function() {
        closeNav();
    });
    
    // Handle resize
    $(window).resize(function() {
        if (!isMobileView()) {
            document.getElementById('nav').style.width = '100%';
        } else {
            closeNav();
        }
    });
});