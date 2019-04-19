const apiKey = ??; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

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
  
 $('.video').append(`<iframe width="640" height="360"
  src="https://www.youtube.com/embed/${responseJson.items[0].id.videoId}?playsinline=1"></iframe>`);
  $('.songArtistInfo').removeClass('hidden');
}

function getVideo(query) {
   const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

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
    //$('.songArtistInfo').removeClass('hidden'); 
    //});
  const search = $('#userSelectedArtist').val() + $('#userSelectedSong').val();
  const maxResults = 10;
  getVideo(search);
});
}


//var url = "https://www.youtube.com/embed/" + videoID;
 //$('#myIframe').attr('src', url)

$(songArtistInfo);
