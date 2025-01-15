let allShows = [];
let allEpisodes = [];
let showEpisodesCache = {};

function padNumber(number) {
  return number.toString().padStart(2, '0');
}

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

function renderEpisodes(episodesToDisplay) {
  const episodesGrid = document.getElementById('episodes-grid');
  episodesGrid.innerHTML = episodesToDisplay.map(generateEpisodeHTML).join('');
  const searchResult = document.getElementById('search-result');
  searchResult.textContent = `Showing ${episodesToDisplay.length} out of ${allEpisodes.length} episodes`;
}

function filterEpisodes(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(episode =>
    episode.name.toLowerCase().includes(searchTerm) ||
    (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );
  renderEpisodes(filteredEpisodes);
}

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

function handleEpisodeSelection(event) {
  const selectedEpisodeId = event.target.value;
  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(episode => episode.id === Number(selectedEpisodeId));
    renderEpisodes([selectedEpisode]);
  } else {
    renderEpisodes(allEpisodes);
  }
}

async function fetchShows() {
  if (allShows.length === 0) {
    const response = await fetch('https://api.tvmaze.com/shows');
    if (!response.ok) {
      throw new Error('Failed to fetch shows');
    }
    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }
  return allShows;
}

async function fetchEpisodes(showId) {
  if (!showEpisodesCache[showId]) {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error('Failed to fetch episodes');
    }
    showEpisodesCache[showId] = await response.json();
  }
  return showEpisodesCache[showId];
}

function populateShowSelector(shows) {
  const showSelector = document.getElementById('show-selector');
  showSelector.innerHTML = '<option value="">Select a Show</option>';
  shows.forEach(show => {
    const option = document.createElement('option');
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

async function handleShowSelection(event) {
  const selectedShowId = event.target.value;
  if (selectedShowId) {
    try {
      allEpisodes = await fetchEpisodes(selectedShowId);
      renderEpisodes(allEpisodes);
      populateEpisodeSelector();
    } catch (error) {
      const episodesGrid = document.getElementById('episodes-grid');
      episodesGrid.innerHTML = `<p class="error">Error loading episodes: ${error.message}</p>`;
    }
  } else {
    allEpisodes = [];
    renderEpisodes([]);
    populateEpisodeSelector();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const shows = await fetchShows();
    populateShowSelector(shows);
    
    const showSelector = document.getElementById('show-selector');
    showSelector.addEventListener('change', handleShowSelection);
    
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', filterEpisodes);
    
    const episodeSelector = document.getElementById('episode-selector');
    episodeSelector.addEventListener('change', handleEpisodeSelection);
  } catch (error) {
    const episodesGrid = document.getElementById('episodes-grid');
    episodesGrid.innerHTML = `<p class="error">Error loading shows: ${error.message}</p>`;
  }
});
