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
function createEpisodeCard (episode){
    const NewCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.innerHTML = `<div class = "title-card">${episode.name} - S${addZero(
    episode.season
  )}E${addZero(episode.number)}</div>;
    <img src="${episode.image.medium}" alt="${episode.name}" />
    <p>${episode.summary}</p>`;
  return newCard;
}
function displayMatchingEpisodes() {
  const liveSearchInput = document.querySelector("#live-search");
  const episodeListItems = document.querySelectorAll(".card");
  liveSearchInput.addEventListener("input", () => {
    filterEpisodeBySearch(episodeListItems, liveSearchInput);
  });
}