$(document).ready(function() {
    // Add transition class to body for initial fade-in effect
    $('body').addClass('page-transition');

    // Handle page load animation (make body visible after a short delay)
    setTimeout(function() {
        $('body').addClass('page-visible');
        // NOTE: Hash scrolling logic is now handled in window.onload
    }, 100);

     // Handle clicks on all links for smooth page transitions
    $('a').each(function() {
        const $link = $(this);
        const href = $link.attr('href');

        // Skip if no href, javascript link, internal # link, or already handled js-anchor-link class
        if (!href || href.indexOf('javascript:') === 0 || href === '#' || $link.hasClass('js-anchor-link')) {
            return; // Do nothing for these types of links
        }
        
        // Skip if link opens in a new tab or is an absolute external URL
        if ($link.attr('target') === '_blank' || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) {
           return; // Let the browser handle these normally
       }

        // Handle links that navigate away from the current page (potentially with a hash)
        $link.click(function(e) {
            e.preventDefault(); // Prevent immediate navigation

            // Check if there's a hash part in the link
            if (href.includes('#')) {
                const [urlPart, hashPart] = href.split('#');
                // Store the hash part for use on the next page
                sessionStorage.setItem('targetHash', '#' + hashPart);
            } else {
                // Ensure no hash is stored if the link doesn't have one
                 sessionStorage.removeItem('targetHash');
            }

            // Start fade-out transition
            $('body').removeClass('page-visible');
            // Close mobile nav if open (check using isMobileView from scripts.js)
            if (typeof isMobileView === 'function' && isMobileView()) {
                if(typeof closeNav === 'function') closeNav(); // Ensure closeNav exists before calling
            }

            // Navigate to the new page after the fade-out transition duration
            setTimeout(function() {
                window.location.href = href.split('#')[0]; // Navigate to URL part only
            }, 500); // Corresponds to the CSS transition duration
        });
    });

}); // End of document.ready

// --- Executes after the entire page (including images) is fully loaded ---
$(window).on('load', function() {
    // Check sessionStorage for a hash target from a previous page
    const targetHash = sessionStorage.getItem('targetHash');
    if (targetHash) {
        // Clear the stored hash immediately
        sessionStorage.removeItem('targetHash');

        // Find the target element on the newly loaded page
        const targetElement = $(targetHash); // jQuery object
        if (targetElement.length) {
            // Adjust for navbar height - CONDITIONALLY
            var navHeight = 0; // Default to 0 offset
            // Ensure isMobileView function (from scripts.js) is accessible
            if (typeof isMobileView === 'function' && isMobileView()) {
                 // Use the height of the hamburger button container on mobile
                 navHeight = $('#hamburger').outerHeight(true) || 0;
            } else if (typeof isMobileView === 'function') { // If function exists, assume desktop
                 // Use the desktop nav height
                 navHeight = $('#nav').outerHeight() || 0;
            }

            // Calculate the final scroll position
            // Use a minimal delay to allow final layout rendering after 'load' event
            setTimeout(function() {
                try {
                     const finalScrollTop = targetElement.offset().top - navHeight;

                    // Use native smooth scrolling
                    window.scrollTo({
                        top: finalScrollTop,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    console.error("Error calculating offset or scrolling:", error);
                    // Fallback: scroll without offset if calculation fails
                     window.scrollTo({
                        top: $(targetHash).offset().top,
                        behavior: 'smooth'
                    });
                }
            }, 50); // Short delay after window.load

        } else {
            console.warn("Target element for hash not found:", targetHash);
        }
    }
}); // End of window.onload