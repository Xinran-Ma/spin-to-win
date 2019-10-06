/***************
 *
 * Project Spin 2 Win
 * Default screen size: 2736px * 1824px
 * 
 **************/


let placeBackground = {};
let placeTwentyCards = {};
let placeFlipCard = {};

fetch('./assets/spin_to_win_background.json').then(response => {
    response.json().then(
        data => {
			placeBackground = data;	
		}
	).then(() => {
		let lottieBg = document.getElementById('spin-2-win-main-bg');
		lottieBg.innerHTML = '';
		lottie.loadAnimation({
			container: lottieBg,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData: placeBackground
		});
	})
})
fetch('./assets/spin_to_win_card_opener.json').then(response => {response.json().then(data => {placeTwentyCards = data})})
fetch('./assets/spin_to_win_card_anim.json').then(response => {response.json().then(data => {placeFlipCard = data})})

window.addEventListener('DOMContentLoaded', 
	(event) => {
		document.addEventListener('touchstart', finishOpeningVideo)
	}
);

function finishOpeningVideo() {
	let openingVideo = document.getElementById('opening-video');
	let closingVideo = document.getElementById('closing-video');
	
	closingVideo.play();
	closingVideo.style.display = 'block';
	openingVideo.style.display = 'none';
	openingVideo.pause();
	
	closingVideo.onended = () => {
		closingVideo.style.display = 'none';
		document.querySelector('#spin-2-win-main-bg svg defs linearGradient stop:nth-child(1)').setAttribute('stop-color', '#020B11');
		document.querySelector('#spin-2-win-main-bg svg defs linearGradient stop:nth-child(2)').setAttribute('stop-color', '#040f12');
		document.querySelector('#spin-2-win-main-bg svg defs linearGradient stop:nth-child(3)').setAttribute('stop-color', '#051414');
		document.querySelector('#spin-2-win-main-bg svg defs linearGradient stop:nth-child(4)').setAttribute('stop-color', '#040f12');
		document.querySelector('#spin-2-win-main-bg svg defs linearGradient stop:nth-child(5)').setAttribute('stop-color', '#020B11');
		document.getElementById('spin-2-win-main').style.display = 'block';
		showTwentyCards();
	}	
};

function showTwentyCards() {
	// clear previous display properties
	document.getElementById('spin-2-win-twenty-cards').style.opacity = '1';
	document.getElementById('spin-2-win-flip-card').style.opacity = '0';

	document.removeEventListener('touchstart', finishOpeningVideo);
	let lottieBg = document.getElementById('spin-2-win-twenty-cards');
	lottieBg.innerHTML = '';
	lottie.loadAnimation({
		container: lottieBg,
		renderer: 'svg',
		loop: false,
		autoplay: true,
		animationData: placeTwentyCards
	});

	let backButton = document.querySelector('#back-button');
	backButton.addEventListener('touchend', backToBegin);

	let twentyCards = document.querySelectorAll('#spin-2-win-twenty-cards svg > g > g');
	Array.from(twentyCards).map((singleCard) => {
		singleCard.addEventListener("touchend", flipCard);
	})
}

function flipCard() {
	let flipCardSVG = document.getElementById('spin-2-win-flip-card');
	let flipNumber = document.querySelector('#spin-2-win-flip-number');
	let twentyCards = document.querySelectorAll('#spin-2-win-twenty-cards svg > g > g');
	let currentIndex = Array.from(twentyCards).indexOf(this);
	let flipCardPosition = calculatingCardPosition(currentIndex);
	let flipNumberPosition = calculatingNumberPosition(currentIndex);
	let randomNumber = Math.ceil(Math.random() * Math.ceil(20)); // generate a random number between 1 and 20

	flipNumber.innerHTML = randomNumber;

	// Load flip card animation
	this.style.display = 'none';
	flipCardSVG.innerHTML = '';
	let flipCardAnimation = lottie.loadAnimation({
		container: flipCardSVG,
		renderer: 'svg',
		loop: false,
		autoplay: false,
		animationData: placeFlipCard
	})
	
	flipCardAnimation.playSegments([1, 40], true);// play the animation from frame 1 to frame 40
	flipCardAnimation.addEventListener('complete', () => {
		document.addEventListener("touchend", backToBegin);
	}); 

	// Calculate flip card position and transform property
	flipCardSVG.style.opacity = '1';
	flipCardSVG.style.transform = 'translate(calc(50vw - 50% - ' + flipCardPosition.leftPosition + 'px), ' + 'calc(50vh - 50% - ' + flipCardPosition.topPosition + 'px))';
	flipCardSVG.style.top = flipCardPosition.topPosition + 'px';
	flipCardSVG.style.left = flipCardPosition.leftPosition + 'px';
	document.querySelector('#spin-2-win-flip-card svg > g > g > g:nth-child(1) path').setAttribute('fill', flipCardPosition.cardBackgroundColor);
	flipCardSVG.classList.add('flip-card-animation');
	
	// Calculate flip number position and transform property
	flipNumber.style.transform = 'translate(calc(50vw - 50% - ' + flipNumberPosition.leftPosition + 'px), ' + 'calc(50vh - 50% - ' + flipNumberPosition.topPosition + 'px))';
	flipNumber.style.top = flipNumberPosition.topPosition + 'px';
	flipNumber.style.left = flipNumberPosition.leftPosition + 'px';
	flipNumber.style.fontSize = '15rem';
	flipNumber.classList.add('flip-number-animation');

	document.getElementById('spin-2-win-twenty-cards').style.opacity = '0';
	twentyCards.forEach(singleCard => {
		singleCard.removeEventListener("touchend", flipCard);
	});	
}

function calculatingNumberPosition(currentIndex) {
	const topBase = -5; // the 'Top' position of the first card
	const leftBase = 70; // the 'Left' position of the first card
	const topPerChange = 216; // the vertical distance between two cards
	const leftPerChange = 256; // the horizontal distance between two cards
	let topPosition;
	let leftPosition;

	// count left position
	const leftOne = [0, 5, 10, 15]
	const leftTwo = [1, 6, 11, 16]
	const leftThree = [2, 7, 12, 17]
	const leftFour = [3, 8, 13, 18]
	// count top position
	const topOne = [0, 1, 2, 3, 4]
	const topTwo = [5, 6, 7, 8, 9]
	const topThree = [10, 11, 12, 13, 14]

	if(leftOne.includes(currentIndex)) {
		leftPosition = leftBase;
	}else if(leftTwo.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange;
	}else if(leftThree.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange * 2;
	}else if(leftFour.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange * 3;
	}else{
		leftPosition = leftBase + leftPerChange * 4;
	}

	if(topOne.includes(currentIndex)) {
		topPosition = topBase;
	}else if(topTwo.includes(currentIndex)){
		topPosition = topBase + topPerChange;
	}else if(topThree.includes(currentIndex)){
		topPosition = topBase + topPerChange * 2;
	}else{
		topPosition = topBase + topPerChange * 3;
	}

	return {topPosition, leftPosition};
}

function calculatingCardPosition(currentIndex) {
	const topBase = -175; // the 'Top' position of the first card
	const leftBase = -60; // the 'Left' position of the first card
	const topPerChange = 216; // the vertical distance between two cards
	const leftPerChange = 256; // the horizontal distance between two cards
	let topPosition;
	let leftPosition;
	let cardBackgroundColor;

	// count left position
	const leftOne = [0, 5, 10, 15]
	const leftTwo = [1, 6, 11, 16]
	const leftThree = [2, 7, 12, 17]
	const leftFour = [3, 8, 13, 18]
	// count top position
	const topOne = [0, 1, 2, 3, 4]
	const topTwo = [5, 6, 7, 8, 9]
	const topThree = [10, 11, 12, 13, 14]

	if(leftOne.includes(currentIndex)) {
		leftPosition = leftBase;
		cardBackgroundColor = '#2E82D8';
	}else if(leftTwo.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange;
		cardBackgroundColor = '#2CD3D1';
	}else if(leftThree.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange * 2;
		cardBackgroundColor = '#F5554F';
	}else if(leftFour.includes(currentIndex)){
		leftPosition = leftBase + leftPerChange * 3;
		cardBackgroundColor = '#FEDC3D';
	}else{
		leftPosition = leftBase + leftPerChange * 4;
		cardBackgroundColor = '#7352B1';
	}

	console.log(leftPosition)

	if(topOne.includes(currentIndex)) {
		topPosition = topBase;
	}else if(topTwo.includes(currentIndex)){
		topPosition = topBase + topPerChange;
	}else if(topThree.includes(currentIndex)){
		topPosition = topBase + topPerChange * 2;
	}else{
		topPosition = topBase + topPerChange * 3;
	}

	return {topPosition, leftPosition, cardBackgroundColor};
}

function backToBegin() {
	let openingVideo = document.getElementById('opening-video');
	let flipNumber = document.querySelector('#spin-2-win-flip-number');

	document.getElementById('spin-2-win-main').style.display = 'none';
	openingVideo.style.display = 'block';
	openingVideo.play();

	document.getElementById('spin-2-win-flip-card').style.transform = 'unset';
	flipNumber.style.transform = 'unset';
	document.getElementById('spin-2-win-flip-card').style.top = '100%'; // Move flip card out of the screen so it won't keep occupying the position on the screen
	flipNumber.style.top = '100%'; // Move flip number out of the screen so it won't keep occupying the position on the screen
	flipNumber.style.fontSize = '10rem';
	flipNumber.style.transform = 'scaleX(-1)';
	// document.getElementById('spin-2-win-flip-number').innerHTML = '';
	flipNumber.classList.remove('flip-number-animation');
	document.getElementById('spin-2-win-flip-card').classList.remove('flip-card-animation');
	document.removeEventListener("touchend", backToBegin);

	document.addEventListener('touchstart', finishOpeningVideo)
}