let slides = [];
let currentSlide = 0;

const inputContainer = document.getElementById('input-container');
const slideshowContainer = document.getElementById('slideshow-container');
const slideElement = document.getElementById('slide');
const slideNumberElement = document.getElementById('slide-number');
const generateButton = document.getElementById('generate');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const fullscreenButton = document.getElementById('fullscreen');
const returnButton = document.getElementById('return');
const textArea = document.getElementById('sentences');
const lineNumbers = document.getElementById('line-numbers');

function addEventListeners() {
    generateButton.addEventListener('click', generateSlideshow);
    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    returnButton.addEventListener('click', returnToInput);
    textArea.addEventListener('input', updateLineNumbers);
    textArea.addEventListener('scroll', syncScroll);
}

addEventListeners();

function updateLineNumbers() {
    const lines = textArea.value.split('\n');
    lineNumbers.innerHTML = lines.map((_, index) => index + 1).join('<br>');
}

function syncScroll() {
    lineNumbers.scrollTop = textArea.scrollTop;
}

function generateSlideshow() {
    const text = textArea.value;
    slides = text.split('\n').filter(sentence => sentence.trim() !== '');
    
    if (slides.length > 0) {
        currentSlide = 0;
        inputContainer.style.display = 'none';
        slideshowContainer.style.display = 'block';
        showSlide();
    } else {
        alert('Please enter at least one sentence.');
    }
}

function showSlide() {
    slideElement.textContent = slides[currentSlide];
    slideNumberElement.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
    updateButtons();
}

function showPreviousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide();
    }
}

function showNextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide();
    }
}

function updateButtons() {
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function returnToInput() {
    slideshowContainer.style.display = 'none';
    inputContainer.style.display = 'block';
    generateButton.disabled = false;
    textArea.focus();
    updateLineNumbers();
}

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        document.body.classList.add('fullscreen');
    } else {
        document.body.classList.remove('fullscreen');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (slideshowContainer.style.display !== 'none') {
        switch(e.key) {
            case 'ArrowLeft':
                showPreviousSlide();
                break;
            case 'ArrowRight':
                showNextSlide();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    returnToInput();
                }
                break;
        }
    }
});

// Ensure proper state on page load
window.addEventListener('load', () => {
    inputContainer.style.display = 'block';
    slideshowContainer.style.display = 'none';
    updateLineNumbers();
});