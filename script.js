const videoApiKey =
'AIzaSyC5lDkPtn4c2jFduPfWy2Jd961RasV4Rfw'; 
const searchVideoURL = 'https://www.googleapis.com/youtube/v3/search';

const lyricsApiKey = '0020098da67bd5dc1b21c2522b2edf4f';
const searchLyricsURL = 'https://api.vagalume.com.br/search.php';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//When the user searches the artist and song a list of videos. The user will choose one and it will be embedded. The user can search multiple times in the same page.
function embedVideo(responseJson) {
  $('.video').empty();
  $(`#results-list`).empty();
  $(`#player`).replaceWith($(`<div class="results">
              <h3>Please choose a video!</h3>
              <ul id="results-list">
              </ul>
            </div>`));
  $('#js-video-error-message').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    $('#results-list').append(
      `<li><a  src="https://youtu.be/${responseJson.items[i].id.videoId}"><h3>${responseJson.items[i].snippet.title}</h3></a>
      <img src="${responseJson.items[i].snippet.thumbnails.default.url}">
      </li>`
      )
    $(`h3`).on(`click`, event => { 
      $(`#results-list`).remove();
      $('.results').replaceWith(`<div id="player" class="video"><iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}?enablejsapi=1"></iframe></div>`);
      });
    }
  }

function displayLyrics(responseJson) {
  $('.lyrics').empty();
  $('#js-lyrics-error-message').empty();
  $('.lyrics').append(`<pre>${responseJson.mus[0].text}</pre>`);
  $('.songArtistInfo').removeClass('hidden');
  $(`.lyrics`).removeClass(`hidden`);
}

function getLyrics(query) {
  const params = {
    key: lyricsApiKey,
    art: $('#userSelectedArtist').val(),
    mus: $('#userSelectedSong').val()
  }
  const queryString = formatQueryParams(params);
  const url = searchLyricsURL + '?' + queryString;

   fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayLyrics(responseJson))
    .catch(err => {
      $('#js-lyrics-error-message').text(`Sorry, there are no lyrics for this song. Please check your spelling or try a different song.`);
    });
}

function getVideo(query, videoEmbeddable=true, maxResults=3) {
   const params = {
    key: videoApiKey,
    q: query,
    videoEmbeddable,
    maxResults,
    part: 'snippet',
    type: 'video'
  };
  const queryString = formatQueryParams(params);
  const url = searchVideoURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => embedVideo(responseJson))
    .catch(error => {
      $('#js-video-error-message').text(`Something went wrong, please try again later.`);
    });
}

function songArtistInfo () {
  $('form').submit(event => {
    event.preventDefault();
  const search = $('#userSelectedArtist').val() + $('#userSelectedSong').val();
  $(`#results-list`).removeClass(`hidden`);
  getVideo(search);
  getLyrics(search);
});
}

$(songArtistInfo);
