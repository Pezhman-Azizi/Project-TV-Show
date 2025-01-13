function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  displayMatchingEpisodes();
  makeListOfEpisodeToSelect(allEpisodes);
}

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodeCards = episodeList.map(createEpisodeCards);
  rootElem.append(...episodeCards);
}

function createEpisodeCards(episode) {
  const newCard = document.createElement("div");
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

function filterEpisodeBySearch(episodeListItems, liveSearchInput) {
  const liveSearchInputValue = liveSearchInput.value.toLowerCase();
  let countMatch = 0;
  episodeListItems.forEach((episode) => {
    const episodeContent = episode.textContent.toLowerCase();
    if (episodeContent.includes(liveSearchInputValue)) {
      countMatch++;
      const episodeMatch = document.querySelector("#episode-match-number");
      const matchMsg = `Displaying: ${countMatch}/${episodeListItems.length} episode (s)`;
      episodeMatch.textContent = matchMsg;
      episode.classList.remove("hidden-card");
    } else {
      episode.classList.add("hidden-card");
    }
  });
}

//===============Episode Selector creation Feature============================
const episodeSelectorTemplate = document.querySelector(
  "#episode-selector-temp"
);
const episodeSelectorTemplateClone =
  episodeSelectorTemplate.content.cloneNode(true);
//insert selector template before live search
document.body.insertBefore(
  episodeSelectorTemplateClone,
  document.querySelector("#live-search")
);

const episodeSelector = document.querySelector("#episode-selector");

function makeListOfEpisodeToSelect(allEpisodes) {
  const episodeOptionList = allEpisodes.map(createEpisodeToSelect);
  episodeSelector.append(...episodeOptionList);
}

function createEpisodeToSelect(episode) {
  const episodeOption = document.createElement("option");
  episodeOption.value = episode.name;
  const formattedSeason = `S${addZero(episode.season)}`;
  const formattedEpisode = `E${addZero(episode.number)}`;
  const episodeName = episode.name;
  episodeOption.textContent = `${formattedSeason}${formattedEpisode} - ${episodeName}`;

  return episodeOption;
}

//====================Filter by Drop Down Select Feature=========================
function filterEpisodeUsingDropDown(event) {
  const selectedEpisodeName = event.target.value.toLowerCase();
  const episodeListItems = document.querySelectorAll(".card");
  episodeListItems.forEach((episode) => {
    const episodeText = episode.textContent.toLocaleLowerCase();
    if (episodeText.includes(selectedEpisodeName)) {
      episode.style.display = "block";
    } else {
      episode.style.display = "none";
    }
  });
}
//event lister for drop down option selection
episodeSelector.addEventListener("change", (event) => {
  filterEpisodeUsingDropDown(event);
});
//=========================================================

window.onload = setup;