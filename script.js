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

function setup(){
    const getAllEpisodes = getAllEpisodes();
    makePageForEpisodes(getAllEpisodes);

    displayMatchingEpisodes();
    makeListOfEpisodeToSelect(getAllEpisodes);

    function addZero(num){
        return num < 10 ? `0${num}` : num;
    }
}