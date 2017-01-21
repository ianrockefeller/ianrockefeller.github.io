/*
	Vars
*/
var cDeg = 0;
var lastSlideOut = 0;
var nSlides = 5;
var currSlide = 0;
var numberOfPanels = 9;
var panelSize = 275;
var tz = translateZ(panelSize, numberOfPanels);
var ry = 360 / numberOfPanels;
var nMountainCaps = 6;
var capBase = 100 / nMountainCaps
var nRepos = 6;

/*
	Functions
*/

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getElementTopPosition(elem){
    return elem && typeof elem.getBoundingClientRect === 'function' ? elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top : 0;
}

function removeSelectedClass() {
	var links = $('.nav-links .click')
	for(var i = 0; i < links.length; i++) {
		if($(links[i]).hasClass('selected')) {
			$(links[i]).removeClass('selected');
			break;
		}
	}	
}

function translateZ() {
	return Math.round( ( panelSize / 2 ) / 
  		Math.tan( Math.PI / numberOfPanels ) );	
}

function setCarouselPanels() {
	var deg = 0;

	$('#carousel').css({
		'transform': 'translateZ(-' + tz + 'px)'
	})

	for(var i = 1; i < numberOfPanels + 1; i++) {
		var style = 'rotateY(' + deg + 'deg) translateZ(' + tz + 'px)';

		$('#carousel div:nth-child(' + i + ')').css({'transform' : style});
		
		deg += ry;
	}
}

/*
	Document on-ready
*/
$(function() {
	var segSize = Math.floor($(document).height() / nSlides);

	setCarouselPanels(); // set Carousel CSS for animation

	// scroll to top of page
	$('html, body').animate({
		scrollTop: 0
	}, 500);

	$('.nav-links .click').click(function(e) {
		// e.preventDefault();
		var id = e.target.id;

		console.log('id = ' + id)

		if(!$(e.target).hasClass('selected')) {
			removeSelectedClass();

			if(id == 'contact') {
				$('html, body').animate({
					scrollTop: document.body.scrollHeight
				}, 500);	

				$('#slide6').css({'display': 'block'}).animate({height: '400'});				
			} else {
				$('html, body').animate({
					scrollTop: $(document).scrollTop() + $('#' + id + '-anchor').offset().top
				}, 500);	
				$(e.target).addClass('selected');
			}
			
		}

	});

	$('#contact').click(function(e) {
		window.scrollTo(0,document.body.scrollHeight);

	});

	$(window).scroll(function() {
		var percent = ($(window).scrollTop() / ($(document).height() - $(window).height()));
		$('#complete-bar').width((percent * 100)+'%');
		var newCurrSlide = Math.floor(percent * nSlides);

		if(newCurrSlide != currSlide && newCurrSlide < nSlides) {
			removeSelectedClass();
			console.log('new current slide' + newCurrSlide)
			$($('#nav-links').children()[newCurrSlide]).addClass('selected');
			currSlide = newCurrSlide;
		} 
	});

	setInterval(function() {
		if(document.hasFocus()) {
			cDeg -= ry;
			$('#carousel').css({
				'transform': 'translateZ(-' + tz + 'px) rotateY(' + cDeg + 'deg)',
				'transition': ''
			});		
		}
	}, 1000);

	$.get("https://api.github.com/users/ianrockefeller/repos", function(data) {
		var repos = [];

		for(var i = 0; i < data.length; i++) {
			var d = data[i];

			if(!d.private && d.name && d.description) {
				var repo = {
					'id': d.id,
					'name': d.name,
					'url': d.html_url,
					'description': d.description
				};

				repos.push(repo);
			}
		}

		repos = shuffle(repos);

		// repos = repos.slice(0,nRepos);

		repos.sort(function(a,b) {
			return b.id - a.id;
		});

		console.log(repos)

		i = 0
		while(i < nRepos) {
			var repo = repos[i];

			if(repo.name && repo.description) {
				//var html = '<a href="' + repo.url + '" target="_blank">';
				var	html = '<p><b>' + repo.name + '</b></p>';
					html += '<p>' + repo.description + '</p>';
					//html += '</a>';

				$('#repo-' + (i+1)).html(html);
				$('#repo-' + (i+1)).click(function() {
					window.open(repo.url, '_blank');
				});
				$('#repo-' + (i+1)).css({'cursor': 'pointer'});
			}
			i++;
		}
	});

}); // end on ready

