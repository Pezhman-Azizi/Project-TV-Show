function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function createEpisodeCard(episode) {
    const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;

    return `
        <article class="episode-card">
            <div class="episode-badge">${episodeNumber}</div>
            <img src="${episode.image.medium}" alt="${episode.name}">
            <div class="episode-content">
                <h2>${episode.name}</h2>
                <p>${episode.summary}</p>
            </div>
        </article>
    `;
}

function displayEpisodes() {
    const episodes = getAllEpisodes();
    const episodesGrid = document.getElementById('episodes-grid');

    const episodesHTML = episodes.map(episode => createEpisodeCard(episode)).join('');
    episodesGrid.innerHTML = episodesHTML;
}

document.addEventListener('DOMContentLoaded', displayEpisodes);

function populateDropdown(episodes) {
    const episodeSelector = document.getElementById('episode-selector');
    episodeSelector.innerHTML = `<option value="">Select an Episode</option>` +
        episodes.map(episode => {
            const episodeNumber = `S${padNumber(episode.season)}E${padNumber(episode.number)}`;
            return `<option value="${episode.id}">${episodeNumber} - ${episode.name}</option>`;
        }).join('');
}
function handleEpisodeSelection(episodes) {
    const episodeSelector = document.getElementById('episode-selector');
    episodeSelector.addEventListener('change', (event) => {
        const selectedEpisodeId = event.target.value;
        if (selectedEpisodeId) {
            const selectedEpisode = episodes.find(ep => ep.id.toString() === selectedEpisodeId);
            displayFilteredEpisodes([selectedEpisode]);
        } else {
            displayFilteredEpisodes(episodes);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const episodes = getAllEpisodes();
    displayEpisodes(episodes);
    populateDropdown(episodes);
    handleSearch(episodes);
    handleEpisodeSelection(episodes);
});