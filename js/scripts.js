// Wait until DOM is loaded...
$(document).ready(function(){
	// All API calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this links
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;
	// console.log(nowPlayingUrl);

	var buttonsHTML = '';
	buttonsHTML += '<button id="all-genres" class="btn btn-default">All</button>';
	for (let i = 0; i < genreArray.length; i++){
		buttonsHTML += `<button class="btn btn-default genre-button">${genreArray[i].name}</button>`
	}
	$('#genre-buttons').html(buttonsHTML);

	// Make AJAX request to nowPlayingUrl
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);

		clickPoster();
		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-card'
		});
		$grid.imagesLoaded().progress( function() {
			$grid.isotope('layout');
		}); // To fix the image loading issue with isotope

		$('#all-genres').click(function(){
			$grid.isotope( {filter: ''} );
		})

		$('.genre-button').click(function(){
			// console.log(this);
			// console.dir(this.innerText);
			$grid.isotope( {filter: '.'+this.innerText} ); // This is looking for CSS rules so needs to be .this.
		})

	});

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
			$('.movie-type').html("Movies based on search: <span id='user-search'>" + userInput + "</span>");
			clickPoster();
		});
	});

	function getHTML(data){
		var newHTML = '';
		
		for (let i = 0; i < data.results.length; i++){
			var movieGenreClassList = ' ';
			// Set up a var for the genre ids for THIS movie
			var thisMovieGenres = data.results[i].genre_ids; //genre_ids is an array
			// Loop through all known genres
			for (let j = 0; j < genreArray.length; j++){
				// The genre that we are on(genreAray[j]), check to see if it is in THIS movie's genre id list.
				if (thisMovieGenres.indexOf(genreArray[j].id) > -1){ // JS returns -1 if the index is not in the array
					// HIT! This genre_id is in THIS movie's genre_id list
					// So we need to add the name to the genre list
					movieGenreClassList += genreArray[j].name + " "
				}
				// console.log(genreArray[j].id);
			}
			// console.log(movieGenreClassList);

			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			// Need to add 'w300' as part of the url; this stands for width 300
			// console.log(data.results[i]);
			
			newHTML += '<div class="col-xs-6 movie-card '+movieGenreClassList+'" movie-id=' + data.results[i].id + '>'; // This gets info of poster's ID
				newHTML += '<div class="col-xs-12 text-center card-title"><h3>'+data.results[i].title+'</h3></div>';
				newHTML += `<img src="${posterUrl}">`;
				newHTML += '<div class="col-xs-6 col-xs-offset-6 movie-text">'
					newHTML += data.results[i].overview;
				newHTML += '</div>';
				// newHTML += ${movierating}
			newHTML += '</div>';
		}
		return newHTML;
	}

	function clickPoster(){
		$('.movie-card').click(function(){
			// Change the HTML insite the modal
			var thisMovieId = $(this).attr('movie-id'); // get movie-id attribute and set it to thisMovieId
			// console.log(thisMovieId);
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				// console.log(thisMovieData);
				$('#myModalLabel').html('<div class="text-center">'+thisMovieData.title+'</div>');
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

