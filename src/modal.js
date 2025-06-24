window.addEventListener('load', async function() {
  // 1. Find which gallery to display from the URL
  const params = new URLSearchParams(window.location.search);
  const collectionName = params.get('collection');

  if (!collectionName) {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '<p class="text-white text-center">No gallery specified.</p>';
    return;
  }
  
  try {
    // 2. Call our new serverless function!
    // The '/api/get-images' URL will depend on your deployment setup.
    const response = await fetch(`/.netlify/functions/get-images?collection=${collectionName}`);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    const images = await response.json();
    
    // 3. Populate the page with the data we fetched
    // For now, we'll hardcode the title, but this could also come from the API.
    const galleryData = {
        title: `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} Gallery`,
        description: 'My collection of photos.',
        images: images
    };

    populatePage(galleryData);

  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '<p class="text-white text-center">Could not load gallery.</p>';
  }
});

function populatePage(galleryData) {
  const galleryContainer = document.getElementById('gallery-container');
  const titleElement = document.getElementById('gallery-title');
  const descriptionElement = document.getElementById('gallery-description');

  // Set the page title and description
  titleElement.textContent = galleryData.title;
  descriptionElement.textContent = galleryData.description;
  document.title = `${galleryData.title} - Samuliframes`; // Update browser tab title

  // Clear the "Loading..." indicator
  galleryContainer.innerHTML = '';

  // 3. Loop through the image data and create an element for each one
  galleryData.images.forEach(image => {
    const item = document.createElement('div');
    item.className = 'drift-photo cursor-pointer'; // Using a class from your input.css
    item.innerHTML = `<img src="${image.url}" alt="${image.name}" class="w-full h-64 object-cover">`;

    // Add a click handler to each image to open the modal
    item.onclick = function() {
      showModal(image.url, image.name);
    };

    galleryContainer.appendChild(item);
  });
}

/**
 * Shows the modal with the clicked image.
 * (This function remains the same as before)
 * @param {string} url - The URL of the image to show
 * @param {string} alt - The alt text for the image
 */
function showModal(url, alt) {
  // Create modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  // Create modal content
  modal.innerHTML = `
    <div style="position: relative; max-width: 90%; max-height: 90%;">
      <button style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 24px; cursor: pointer;">&times;</button>
      <img src="${url}" alt="${alt}" style="max-height: 85vh; max-width: 100%; object-fit: contain;">
    </div>
  `;

  // Add to document
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Add close button handler
  const closeBtn = modal.querySelector('button');
  if (closeBtn) {
    closeBtn.onclick = function(e) {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
      e.stopPropagation();
    };
  }

  // Close on click outside
  modal.onclick = function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }
  };

  // Close on ESC key
  const escHandler = function(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}