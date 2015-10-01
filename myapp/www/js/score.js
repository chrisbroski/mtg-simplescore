/*jslint browser: true, sloppy: true */
var activePlayer, activeFactor, activePoison;

function Q$(name) {
    var reQs, val;
    reQs = new RegExp("[\\?&]" + name + "=([^&#]*)", "i");
    val = reQs.exec(window.parent.location.search);
    if (val) {
        return decodeURIComponent(val[1]);
    }
    return "";
}

function getEventTarget(e) {
    var targ;
    targ = e.target || e.srcElement;
    if (targ.nodeType === 3) { // defeat Safari bug
        targ = targ.parentNode;
    }
    return targ;
}

function touchEvent() {
    if ('ontouchstart' in window || 'onmsgesturechange' in window) {
        return 'touchstart';
    }
    return 'click';
}

function log(player, currentScore, scoreChange, isPoison) {
    var recordTally, logEntry, scoreChangePrefix = '', changeType = '<span>';
    if (scoreChange) {
        recordTally = document.getElementById(player + '_log');
        logEntry = document.createElement('p');

        if (scoreChange > 0) {
            scoreChangePrefix = '+';
            changeType = '<span class="gain">';
        }
        logEntry.innerHTML = changeType + '(' + scoreChangePrefix + scoreChange + ')</span>' + currentScore;
        if (isPoison) {
            logEntry.className = 'poison';
        }

        recordTally.appendChild(logEntry);
    }
}

function showScore(player, scoreChange, isPoison) {
    var currentScore, scores = document.querySelectorAll('#' + player + ' p'), iType = Number(isPoison);

    currentScore = +scores[iType].innerHTML + scoreChange;
    scores[iType].innerHTML = currentScore;
    log(player, currentScore, scoreChange, isPoison);
}

function pickNumber(factor, player, isPoison) {
    var picker = document.getElementById('numberPicker');
    activeFactor = factor;
    activePlayer = player;
    activePoison = !!isPoison;
    picker.style.display = 'block';
}

function closeNumberPicker() {
    document.getElementById('numberPicker').style.display = 'none';
}

function init() {
    var startingLife = Q$('start') || 20, buttons, numberButtons, links, ii;
    startingLife = +startingLife;
    console.log('init');

    function pickScore(e) {
        var el = getEventTarget(e);
        showScore(activePlayer, el.innerHTML * activeFactor, activePoison);
        closeNumberPicker();
    }
    document.getElementById('numberPicker').addEventListener(touchEvent(), closeNumberPicker);
    numberButtons = document.querySelectorAll('#numberPicker > div > div > p');
    for (ii = 0; ii < numberButtons.length; ii = ii + 1) {
        numberButtons[ii].addEventListener(touchEvent(), pickScore);
    }
    buttons = document.querySelectorAll('h4');
    buttons[0].addEventListener(touchEvent(), function () {pickNumber(-1, 'me'); });
    buttons[1].addEventListener(touchEvent(), function () {pickNumber(1, 'me'); });
    buttons[2].addEventListener(touchEvent(), function () {pickNumber(-1, 'you'); });
    buttons[3].addEventListener(touchEvent(), function () {pickNumber(1, 'you'); });
    
    buttons = document.querySelectorAll('h5');
    buttons[0].addEventListener(touchEvent(), function () {pickNumber(-1, 'me', true); });
    buttons[1].addEventListener(touchEvent(), function () {pickNumber(1, 'me', true); });
    buttons[2].addEventListener(touchEvent(), function () {pickNumber(-1, 'you', true); });
    buttons[3].addEventListener(touchEvent(), function () {pickNumber(1, 'you', true); });

    document.querySelector('#me p').innerHTML = startingLife;
    document.querySelector('#you p').innerHTML = startingLife;
    document.querySelector('#me_log p').innerHTML = startingLife;
    document.querySelector('#you_log p').innerHTML = startingLife;

    // To make reset links open in mobile Safari app
    links = document.getElementsByTagName('a');
    function appLink(e) {
        e.preventDefault();
        window.location = this.href;
    }
    for (ii = 0; ii < links.length; ii = ii + 1) {
        links[ii].onclick = appLink;
    }
}
