// Wait until DOM is loaded...
$(document).ready(function(){
	// All API calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this links
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;
	// console.log(nowPlayingUrl);

	// Make AJAX request to nowPlayingUrl
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
		clickPoster();

	})

	$('#movie-form').submit((event)=>{
		event.preventDefault(); // Stop browser from submitting because we will handle submission
		var userInput = $('#search-input').val();
		$('#search-input').val(''); // Clears out the box after you search
		var safeUserInput = encodeURI(userInput); // encodeURI takes care of spaces in search/link
		var searchUrl = apiBaseUrl + '/search/movie?query=' + safeUserInput + '&api_key=' + apiKey;
		// console.log(searchUrl);
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovieHTML = getHTML(searchMovieData);
			$('#movie-grid').html(searchMovieHTML);
			$('.movie-type').html("Movies based on search: " + userInput);
			clickPoster();
		});
	});

	function getHTML(data){
		var newHTML = '';
		for (let i = 0; i < data.results.length; i++){
			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			// Need to add 'w300' as part of the url; this stands for width 300
			newHTML += '<div class="col-sm-6 col-md-3 movie-poster" movie-id=' + data.results[i].id + '>'; // This gets info of poster's ID
				newHTML += `<img src="${posterUrl}">`;
			newHTML += '</div>';
		}
		return newHTML;
	}

	function clickPoster(){
		$('.movie-poster').click(function(){
			// Change the HTML insite the modal
			var thisMovieId = $(this).attr('movie-id'); // get movie-id attribute and set it to thisMovieId
			// console.log(thisMovieId);
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				// console.log(thisMovieData);
				$('#myModalLabel').html(thisMovieData.title);
				var newHTML = '';
				newHTML += '<div class="modal-details">';
					newHTML += "Overview:<br />" + thisMovieData.overview;
				newHTML += '</div>';
				newHTML += '<div class="modal-details">';
					newHTML += "Tagline:<br />" + thisMovieData.tagline;
				newHTML += '</div>';
				newHTML += '<div class="modal-details">';
					newHTML += "Release Date:<br />" + thisMovieData.release_date;
				newHTML += '</div>';
				newHTML += '<div class="modal-details">';
					newHTML += "Runtime:<br />" + thisMovieData.runtime;
				newHTML += '</div>';
				newHTML += '<div class="modal-details">';
					newHTML += "Homepage:<br />" + "<a href='" + thisMovieData.homepage + "' target='_blank'>" + thisMovieData.homepage + "</a>";
				newHTML += '</div>';
				$('.modal-body').html(newHTML);
				// Open the modal
				$('#myModal').modal();
			})
		})
	}

});

