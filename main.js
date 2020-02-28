// This is a familar memory game where you try to match all cards before your lives run out.
// The rules are as follows:
// There are 20 cards, 10 lives, no time limit, and you will select two cards at a time.
// If the cards match, you will gain a point.
// If they do not match, you will lose a life.
// If your score reaches 10 (all cards are matched), then you win.
// If your lives run out, you will lose. 
// In both outcomes, you are given the option to play again.

// This is a sample template that all card on the board will follow for reference.
let template = `
    <div class="memory-card" data-card="wdragon">
        <img class= "front-face" src="../assets/blueeyes.jpg" alt="">
        <img class="back-face" src="../assets/card-back.jpg" alt="">
    </div>
`

// First we set an empty variable here for the game cards.
// Then we follow the template to make a game card for all cards within deck.js using forEach.
// After we insert the gamecards into the HTML via the "memory-game" class.
var gamecards = ''
deck.forEach(l => {
    gamecards += `
    <div class="memory-card" data-card="${l.name}">
        <img class= "front-face" src="${l.front}" alt="">
        <img class="back-face" src="./assets/card-back.jpg" alt="">
    </div>
`
})
$('.memory-game').html(gamecards)
var cards = document.querySelectorAll('.memory-card')

// The variables that are necessary for the initial state of the game are first set here.
// The score and lives are set to their beginning numbers and all cards are faced down.
let hasFlippedCard = false
let lockBoard = false
let firstCard, secondCard
let score = 0
let lives = 10
$('.lives').html(`You have ${lives} attempts left.`)

// This function is where the cards are selected and flipped.
// The flip is done by adding a css class to the selected card and there is a flip animation that then displays the front image.
// Once the second card is selected, it runs the checkForMatch function to make the check.
function flipCard() {
    if (lockBoard) return
    if (this === firstCard) return

    this.classList.add('flip')
    if (!hasFlippedCard) {
        // First card selection
        hasFlippedCard = true
        firstCard = this
        return
    }
    // Second card selection
    secondCard = this
    checkForMatch()
}

// This function will compare the cards selected using the "data" attribute on each card, which corresponds to their name.
// There are two of each card, so when the name matches, it will be considered a dataset match as well
function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card

    // If it matches, leaves cards faced up (runs disableCards)
    // If it doesn't match, flips cards back down (runs unflipCards)
    isMatch ? disableCards() : unflipCards()
} 

// This function prevents you from being able to click on cards after they are matched.
// It will also then add 1 point to the total score.
// If the score ends up hitting 10, it will run the gameOver function (below).
// The resetBoard function is run when the score has not hit 10 and you need to make new card selections.
function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)
    score++ 
    setTimeout(() => {
        gameOver()
    },1000)
     resetBoard()
}

// The unflipCards function places cards back down and will deduct a life from your total when there is no match.
// If you run out of lives, the gameOver function will be ran.
// When you still have lives, resetBoard is ran so you can make a new selection. 
function unflipCards() {
    lockBoard = true

     setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')
        lives--
        $('.lives').html(`You have ${lives} attempts left`)
        setTimeout(() => {
            gameOver()
        },1000)
        resetBoard()
    }, 1000)
}

// This function is ran when you either run out of lives or matched all the cards.
// Either outcome, a button will appear that allows you to play again.
function gameOver() {
    if (lives === 0) {
        $('.lives').html(`No more attempts. YOU LOSE!`)
        $('.reset').html(`<a href="./newgame.html"><button class="glow-on-hover" type="button">PLAY AGAIN?</button></a>`)
    } else if (score === 10) {
        $('.lives').html(`You've matched them all. YOU WIN!`)
        $('.reset').html(`<a href="./newgame.html"><button class="glow-on-hover" type="button">PLAY AGAIN?</button></a>`)
    }
}

// Resets board by flipping down non-matched cards and allowing you to make new card selections.
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

// This function randomizes the order of the cards using css flexbox order.
// It will assign each card a order number via flexbox in css, then randomize it so it's different on each play.
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 20)
        card.style.order = randomPos
    })
})()

// Add event listeners to cards so you can click and interact.
cards.forEach(card => card.addEventListener('click', flipCard))