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

function scrollToBottom() {
    //console.log(document.getElementById('log').getBoundingClientRect());
    //document.getElementById('divider').style.height = '100%';
    //window.scrollTo(0, document.body.scrollHeight);
    //window.scrollTo(0, 999999999999);
    document.querySelector('#log > div:last-child').scrollIntoView();
}

function log(player, currentScore, scoreChange, isPoison) {
    var recordTally, logEntry, scoreChangePrefix = '', changeType = '<span>';
    if (scoreChange) {
        recordTally = document.querySelector('#log > div:last-child .' + player + '_log');
        logEntry = document.createElement('p');

        if (scoreChange > 0) {
            scoreChangePrefix = '+';
            if (!isPoison) {
                changeType = '<span class="gain">';
            }
        }
        logEntry.innerHTML = changeType + '(' + scoreChangePrefix + scoreChange + ')</span>' + currentScore;
        if (isPoison) {
            logEntry.className = 'poison';
        }

        recordTally.appendChild(logEntry);
        scrollToBottom();
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

function newTurn() {
    var turn = document.createElement('div'),
        me_log = document.createElement('div'),
        you_log = document.createElement('div');
    
    me_log.className = 'me_log';
    you_log.className = 'you_log';
    turn.appendChild(me_log);
    turn.appendChild(you_log);
    document.getElementById('log').appendChild(turn);
    scrollToBottom();
}

function nextTurn(e) {
    //console.log('next turn');
    newTurn();
}

function unDo() {
    if (document.getElementById('numberPicker').style.display === 'block') {
        console.log('close picker');
        closeNumberPicker();
    } else {
        console.log('undo turn or score');
    }
}

function init() {
    var startingLife = Q$('start') || 20, buttons, numberButtons, links, ii;
    startingLife = +startingLife;

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
    document.querySelector('.me_log p').innerHTML = startingLife;
    document.querySelector('.you_log p').innerHTML = startingLife;
    
    document.getElementById('nextTurn').addEventListener(touchEvent(), nextTurn);

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
