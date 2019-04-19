<<<<<<< HEAD
const videoApiKey =
'AIzaSyBM4OnGVBii8BA51unrlgRMHOT5yeMdUGo'; 
const searchVideoURL = 'https://www.googleapis.com/youtube/v3/search';

const lyricsApiKey = '0020098da67bd5dc1b21c2522b2edf4f';
const searchLyricsURL = 'https://api.vagalume.com.br/search.php';
=======
const apiKey = ??; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';
>>>>>>> c237b26afa2532771a4e91d83c3de99c19b1d12d

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function embedVideo(responseJson) {
  console.log(responseJson);
  $('.video').empty();
  const url = `https://www.youtube.com/embed/${responseJson.items[0].id.videoId}`;
  console.log(url);
  
  $('.video').append(`<iframe width="640" height="360" src="https://www.youtube.com/embed/${responseJson.items[0].id.videoId}?playsinline=1"></iframe>`);
  $('.songArtistInfo').removeClass('hidden');
}

function displayLyrics(responseJson) {
  console.log(responseJson)
  $('.lyrics').empty();
  $('.lyrics').append(`<p>${responseJson.mus[0].text}</p>`);
  $('.songArtistInfo').removeClass('hidden');
}

function getLyrics(query) {
  const params = {
    key: lyricsApiKey,
    art: $('#userSelectedArtist').val(),
    mus: $('#userSelectedSong').val()
  }
  const queryString = formatQueryParams(params);
  const url = searchLyricsURL + '?' + queryString;
  console.log(url);

   fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayLyrics(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getVideo(query, videoEmbeddable=true) {
   const params = {
    key: videoApiKey,
    q: query,
    videoEmbeddable,
    part: 'snippet',
    type: 'video'
  };
  const queryString = formatQueryParams(params);
  const url = searchVideoURL + '?' + queryString;

  console.log(url);
  

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => embedVideo(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}



function songArtistInfo () {
  console.log('songArtistInfo ran');
  $('form').on('click', '.submitButton', event => {
    event.preventDefault();
  const search = $('#userSelectedArtist').val() + $('#userSelectedSong').val();
  const maxResults = 10;
  getVideo(search);
  getLyrics(search);
});
}


//var url = "https://www.youtube.com/embed/" + videoID;
 //$('#myIframe').attr('src', url)

$(songArtistInfo);
