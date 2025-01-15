let allEpisodes = []; // Store all episodes globally for reuse throughout the script

// Utility function to pad numbers with leading zeros (e.g., 1 becomes 01)
function padNumber(number) {
  return number.toString().padStart(2, '0');
}

// Generate HTML structure for an individual episode card
function generateEpisodeHTML(episode) {
  const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
  return `
    <article class="episode-card">
        <div class="episode-badge">${episodeNumber}</div>
        <img src="${episode.image?.medium || 'https://via.placeholder.com/210x295'}" alt="${episode.name}">
        <div class="episode-content">
            <h2>${episode.name}</h2>
            <p>${episode.summary || 'No description available.'}</p>
        </div>
    </article>`;
}

// Render the list of episodes on the page
function renderEpisodes(episodesToDisplay) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');
  const searchResult = document.getElementById('search-result');
  searchResult.textContent = `Showing ${episodesToDisplay.length} out of ${allEpisodes.length} episodes`;
}

// Filter episodes based on the search input
function filterEpisodes(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(episode =>
    episode.name.toLowerCase().includes(searchTerm) ||
    (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );
  renderEpisodes(filteredEpisodes);
}

// Populate the episode selector dropdown with all episodes
function populateEpisodeSelector() {
  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.innerHTML = '<option value="">Select an Episode</option>';
  allEpisodes.forEach(episode => {
    const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
    const option = document.createElement('option');
    option.value = episode.id;
    option.textContent = `${episodeNumber} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

// Handle the selection of an episode from the dropdown
function handleEpisodeSelection(event) {
  const selectedEpisodeId = event.target.value;
  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(episode => episode.id === Number(selectedEpisodeId));
    renderEpisodes([selectedEpisode]);
  } else {
    renderEpisodes(allEpisodes);
  }
}

// Fetch episodes from the TVMaze API
function fetchEpisodes() {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = '<p>Loading episodes...</p>';
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch episodes');
      }
      return response.json();
    })
    .then(data => {
      allEpisodes = data; // Store fetched episodes globally
      renderEpisodes(allEpisodes); // Display episodes
      populateEpisodeSelector(); // Populate dropdown
    })
    .catch(error => {
      episodesGrid.innerHTML = `<p class="error">Error loading episodes: ${error.message}</p>`;
    });
}

// Set up the page once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchEpisodes(); // Fetch episodes from the API
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', filterEpisodes);
  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.addEventListener('change', handleEpisodeSelection);
});
