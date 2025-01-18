// Store all shows and episodes globally to avoid multiple fetches
let allShows = [];
let allEpisodes = [];

// Utility function to pad numbers with leading zeros
function padNumber(number) {
  return number.toString().padStart(2, '0');
}

// Generate HTML structure for an individual show card
function generateShowHTML(show) {
  return `
    <article class="show-card" data-show-id="${show.id}">
      <img src="${show.image?.medium || 'https://via.placeholder.com/210x295'}" alt="${show.name}">
      <div class="show-content">
        <h2>${show.name}</h2>
        <p>${show.summary || 'No description available.'}</p>
        <p>Genres: ${show.genres.join(', ')}</p>
        <p>Status: ${show.status}</p>
        <p>Rating: ${show.rating?.average || 'N/A'}</p>
        <p>Runtime: ${show.runtime || 'N/A'} mins</p>
      </div>
    </article>`;
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

// Populate the show selector dropdown
function populateShowSelector() {
  const showSelector = document.getElementById('show-selector');
  showSelector.innerHTML = '<option value="">Select a Show</option>';
  allShows.forEach(show => {
    const option = document.createElement('option');
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
  showSelector.addEventListener('change', handleShowSelection);
}

// Handle show selection from the dropdown
function handleShowSelection(event) {
  const selectedShowId = event.target.value;
  if (selectedShowId) {
    fetchEpisodesForShow(selectedShowId);
  }
}

// Render the list of shows on the page
function renderShows(showsToDisplay) {
  const showsContainer = document.getElementById('shows');
  showsContainer.innerHTML = showsToDisplay.map(generateShowHTML).join('');
  showsContainer.style.display = 'grid';
  document.getElementById('episodes-grid').style.display = 'none';

  const backButton = document.getElementById('back-to-shows');
  const resultSpan = document.getElementById('search-result');
  const episodeSelector = document.getElementById('episode-selector');

  if (backButton) backButton.style.display = 'none';
  if (resultSpan) {
    resultSpan.style.display = 'none';
    resultSpan.textContent = '';
  }
  if (episodeSelector) episodeSelector.style.display = 'none';

  showsContainer.addEventListener('click', handleShowClick);
}

// Handle click on a show card to fetch and display episodes
function handleShowClick(event) {
  const showCard = event.target.closest('.show-card');
  if (showCard) {
    const showId = showCard.dataset.showId;
    fetchEpisodesForShow(showId);
  }
}

// Fetch episodes for a specific show
function fetchEpisodesForShow(showId) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = '<p>Loading episodes...</p>';
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch episodes');
      }
      return response.json();
    })
    .then(data => {
      allEpisodes = data;
      renderEpisodes(allEpisodes);
    })
    .catch(error => {
      episodesGrid.innerHTML = `<p class="error">Error loading episodes: ${error.message}</p>`;
    });
}

// Render the list of episodes
function renderEpisodes(episodesToDisplay) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');
  episodesGrid.style.display = 'grid';
  document.getElementById('shows').style.display = 'none';

  const episodeSelector = document.getElementById('episode-selector');
  episodeSelector.style.display = 'block';
  episodeSelector.innerHTML = '<option value="">Select an Episode</option>';
  episodesToDisplay.forEach(episode => {
    const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
    const option = document.createElement('option');
    option.value = episode.id;
    option.textContent = `${episodeNumber} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  const resultSpan = document.getElementById('search-result');
  resultSpan.style.display = 'inline';
  resultSpan.textContent = `Displaying ${episodesToDisplay.length}  episodes`;

  let backButton = document.getElementById('back-to-shows');
  if (!backButton) {
    backButton = document.createElement('button');
    backButton.id = 'back-to-shows';
    backButton.classList.add("back-show");

    backButton.textContent = 'Back to Shows';
    backButton.addEventListener('click', () => {
      document.getElementById('shows').style.display = 'grid';
      document.getElementById('episodes-grid').style.display = 'none';
      episodeSelector.style.display = 'none';
      resultSpan.style.display = 'none';
      backButton.style.display = 'none';
    });
    episodeSelector.after(backButton);
  } else {
    backButton.style.display = 'inline-block';
  }

  episodeSelector.addEventListener('change', event => {
    const selectedEpisodeId = event.target.value;
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find(episode => episode.id === Number(selectedEpisodeId));
      episodesGrid.innerHTML = generateEpisodeHTML(selectedEpisode);
    } else {
      renderEpisodes(allEpisodes);
    }
  });
}

// Fetch all shows
function fetchShows() {
  const showsContainer = document.getElementById('shows');
  showsContainer.innerHTML = '<p>Loading shows...</p>';
  fetch('https://api.tvmaze.com/shows')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      return response.json();
    })
    .then(data => {
      allShows = data;
      renderShows(allShows);
      populateShowSelector();
    })
    .catch(error => {
      showsContainer.innerHTML = `<p class="error">Error loading shows: ${error.message}</p>`;
    });
}

// Search through shows
function filterShows(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredShows = allShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm) ||
    show.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
    (show.summary && show.summary.toLowerCase().includes(searchTerm))
  );
  renderShows(filteredShows);
}

// Set up the page once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchShows();
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', filterShows);

  const resultSpan = document.createElement('span');
  resultSpan.id = 'search-result';
  resultSpan.style.display = 'none';
  document.getElementById('episode-selector').after(resultSpan);
});
