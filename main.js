// Inserting HTML 

let template = `
    <div class="memory-card" data-card="wdragon">
        <img class= "front-face" src="../assets/blueeyes.jpg" alt="">
        <img class="back-face" src="../assets/card-back.jpg" alt="">
    </div>
`
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
// Variables
let hasFlippedCard = false
let lockBoard = false
let firstCard, secondCard
let score = 0
let lives = 10
$('.lives').html(`You have ${lives} attempts left.`)

// Function that flips cards and does check
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

// Checking if cards match
function checkForMatch() {
    // Check if cards match
    let isMatch = firstCard.dataset.card === secondCard.dataset.card

    isMatch ? disableCards() : unflipCards()
} 

// Makes it so you can't click on cards after they're out of play
function disableCards() {
     // Match
     firstCard.removeEventListener('click', flipCard)
     secondCard.removeEventListener('click', flipCard)
    score++ 
    console.log(score)
    setTimeout(() => {
        gameOver()
    },1000)
     resetBoard()
}

// Puts cards back down
function unflipCards() {
    lockBoard = true

     // Not a match
     setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')
        lives--
        console.log(lives)
        $('.lives').html(`You have ${lives} attempts left`)
        setTimeout(() => {
            gameOver()
        },1000)
        resetBoard()
    }, 1000)
}

// Shows win or loss
function gameOver() {
    if (lives === 0) {
        $('.lives').html(`No more attempts. YOU LOSE!`)
        $('.reset').html(`<a href="./newgame.html"><button class="glow-on-hover" type="button">PLAY AGAIN?</button></a>`)
    } else if (score === 10) {
        $('.lives').html(`You've matched them all. YOU WIN!`)
        $('.reset').html(`<a href="./newgame.html"><button class="glow-on-hover" type="button">PLAY AGAIN?</button></a>`)
    }
}

// Resets board
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

// Shuffles deck using CSS order on flexbox
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 20)
        card.style.order = randomPos
    })
})()

// Add event listeners to cards
cards.forEach(card => card.addEventListener('click', flipCard))

