$(document).bind('pageinit', function () {
    "use strict";
    function Gamer() {}
    var gameObject, Levels, BoardUtilities, start;

    switch ($.cookie('gen_time')) {
    case 'time_0':
        $.cookie('genTime', 500);
        break;
    case 'time_1':
        $.cookie('genTime', 2000);
        break;
    case 'time_2':
        $.cookie('genTime', 20000);
        break;
    default:
        $.cookie('genTime', 1500);
        break;
    }

    switch ($.cookie('timeratio')) {
    case 'ratio_0':
        $.cookie('hideRatio', 0);
        break;
    case 'ratio_1':
        $.cookie('hideRatio', 200);
        break;
    case 'ratio_2':
        $.cookie('hideRatio', 600);
        break;
    case 'ratio_3':
        $.cookie('hideRatio', 1400);
        break;
    case 'ratio_4':
        $.cookie('hideRatio', 3200);
        break;
    default:
        $.cookie('genTime', 500);
        break;
    }


    /**
     * @class Levels 
     * Creates number or letter sequences based on state of the game.
     */
    Levels = (function () {
        var letters, numbers, currLvl = parseInt($.cookie('level'), 10), setCurrLvl,
            last = 'num', createSequence, createSequenceNumbers, createSequenceLetters;
        /**
         * Returns an array of letters
         * @param  {Number} start The starting point in the alphabet
         * @param  {Number} end The ending point in the alphabet
         * @return {Array}  An array of letters between two points
         * @private
         */
        letters = function (start, end) {
            var alpha = 'abcdefghijklmnopqrstuvwxyz';
            return alpha.slice(start, end).split('');
        };
        /**
         * Returns an array of numbers
         * @param  {Number} start The starting point in the sequence
         * @param  {Number} end The ending point in the sequence
         * @return {Array}  An array of numbers between two points
         * @private
         */
        numbers = function (start, end) {
            var seq = [], i = 0, j;
            for (j = start; j <= end; ++j) {
                seq[i] = j;
                ++i;
            }
            return seq;
        };
        /**
         * Sets the sequence, based on the 'numletters' cookie. Either
         * alt, rand, numbers, letters
         *
         * The cookie 'fixed' determines if the level in incremented
         */
        createSequence = function () {
            var sequence, numletters, test = Math.floor(Math.random() * 2);
            switch ($.cookie('numletters')) {
            case 'num':
                numletters = 'num';
                break;
            case 'letters':
                numletters = 'letters';
                break;
            case 'rand':
                numletters = (test === 0) ? 'num' : 'letters';
                break;
            case 'alt':
                numletters = (last === 'num') ? 'letters' : 'num';
                break;
            }
            last = numletters;
            if (numletters === 'num') {
                sequence = createSequenceNumbers();
            } else {
                sequence = createSequenceLetters();
            }
            if ($.cookie('fixed') === 'off') {
                currLvl++;
            }
            return sequence;
        };
        /**
         * Determines a start and end point for numbers(start, end)
         * uses the 'randstart' cookie or currLvl to determine the start point
         * @return {Array} of sequenced numbers
         * @private
         */
        createSequenceNumbers = function () {
            var sequence, rand;
            if ($.cookie('randstart') === 'off') {
                sequence = numbers(1, currLvl + 1);
            } else {
                rand = Math.floor(Math.random() * 101);
                sequence = numbers(rand, currLvl + rand);
            }
            return sequence;
        };
        /**
         * Determines a start and end point for letters(start, end)
         * uses the 'randstart' cookie or currLvl to determine the start point
         * @return {Array} of sequenced letters
         * @private
         */
        createSequenceLetters = function () {
            var sequence, rand;
            if ($.cookie('randstart') === 'off') {
                sequence = letters(0, currLvl + 1);
            } else {
                rand = Math.floor(Math.random() * (25 - Levels.currLvl));
                sequence = letters(rand, currLvl + rand + 1);
            }
            return sequence;
        };
        /** 
        * sets the current level.
        * @param {Number} level Decrements the level by the value if neg. Sets
        * the level if positive.
        */
        setCurrLvl = function (level) {
            currLvl = level < 0 ? currLvl + level : level;
        };
        // Levels public interface
        return {
            currLvl: currLvl,
            createSequence: createSequence,
            setCurrLvl: setCurrLvl
        };
    }());
    /**
     * @class Gamer
     * Creates individual grids and sequences for a gamer and tracks progress
     * thru game.
     */
    Gamer.prototype = {
        /**
         * Default gamer values
         * @cfg Gamer
         * @cfg {Number} Gamer.current The current level
         * @cfg {Array} Gamer.sequence The current sequence
         * @cfg {Number} Gamer.errors The current number of errors
         * @cfg {Number} Gamer.limit The limit of errors
         * @cfg {Array} Gamer.grid The current game grid size
         */
        current: 0,
        sequence: ['a', 'b'],
        errors: 0,
        limit: 5,
        grid: [4, 7],

        /** Checks the window size, and divides it up according to the grid */
        createGrid: function () {
            var i, j, pad = $("div[data-role='content']").css("padding").replace("px", ""),
                box = [$("div[data-role='content']").width() - pad,
                    $('body').height() - $("div[data-role='header']").height() - pad * 2 - 1];
            for (i = 0; i < this.grid[1]; i++) {
                for (j = 0; j < this.grid[0]; j++) {
                    $("div[data-role='content']").append('<div id="box_' + i + '_' + j + '" class="item"></div>');
                }
            }
            $('.item').css({
                width: (box[0] / this.grid[0]) + 'px',
                height: (box[1] / this.grid[1]) + 'px'
            });
        },
        /**
         * Populates the grid with figures. Initially unclickable, until the
         * sequence is hidden
         */
        populateGrid: function () {
            var randCol, randRow, tmp, time, i, numArray = [];
            for (i = this.sequence.length - 1; i >= 0; i--) {
                randCol = Math.floor(Math.random() * (this.grid[0]));
                randRow = Math.floor(Math.random() * (this.grid[1]));
                tmp = randRow + '_' + randCol;
                while ($.inArray(tmp, numArray) >= 0) {
                    randCol = Math.floor(Math.random() * (this.grid[0]));
                    randRow = Math.floor(Math.random() * (this.grid[1]));
                    tmp = randRow + '_' + randCol;
                }
                $('#box_' + tmp).append('<em data-sequence="' + this.sequence[i] + '" class="noclick"><span>' + this.sequence[i] + '</span></em>');
                numArray[i] = tmp;
            }
            time = parseInt($.cookie('hideRatio'), 10) * Math.pow(this.sequence.length, 1.1) + parseInt($.cookie('genTime'), 10);
            $('.item em span').delay(time).fadeOut(100);
            setTimeout(function () { $('.item em').removeClass('noclick'); }, time + 110);
            $('.item em').css('background-size', 'contain');
        },
        /** Puts a visual counter of chances left on the board */
        createTries: function () {
            var i, tries = '';
            for (i = this.limit; i > 0; i--) {
                tries += '<div class="chance"></div>';
            }
            $('#tries').html(tries);
        }
    };
    /**
     * @class BoardUtilities
     * Clears the board, checks gamers clicks, declares a win or loss
     */
    BoardUtilities = (function () {
        var clearBoard, winner, checkClicks;
        /** 
         * clears all board elements
         * @private
         */
        clearBoard = function () {
            $('.item').remove();
            $('#status').removeClass('win lose');
        };
        /**
         * Moves gamer to the next level on a win, or allows a retry on a loss
         * @param {Boolean} won true if gamer won, false otherwise
         * @private
         */
        winner = function (won) {
            clearBoard();
            if (won) {
                $('#status').addClass('lose').html('Game Over!');
                $('#start .txt').html('Try again?');
                $('#start').addClass('pause').fadeIn(500);
                if ($.cookie('fixed') === 'off') {
                    Levels.setCurrLvl(-1);
                }
            } else {
                $('#status').addClass('win').html('Winner!');
                start();
            }
            $('#status').fadeIn(200).delay(1000).fadeOut(200);
        };
        /**
         * Checks a gamers click. Increases error count if wrong, goes to
         * next item in the sequence if correct. Alerts a win/loss if
         * sequence/error reaches the end respectively
         * @event game-icon-vclick
         */
        checkClicks = function () {
            $('.item em').on("vclick", function () {
                if ($(this).hasClass('noclick')) { return false; }
                if ($(this).hasClass('correct')) { return false; }
                if ($(this).attr('data-sequence') === gameObject.sequence[gameObject.current].toString()) {
                    $(this).addClass('correct');
                    gameObject.current++;
                } else {
                    gameObject.errors++;
                    $('.chance').first().addClass('lost').removeClass('chance');
                    if (gameObject.errors >= gameObject.limit) {
                        winner(true);
                    }
                }
                if ($('.correct').length >= gameObject.sequence.length) {
                    winner(false);
                }
                return false;
            });
        };
        // BoardUtilities public interface
        return {
            checkClicks: checkClicks
        };
    }());

    /**
     * setup and start the game
     * @param {Boolean} pause Pause between levels?
     */
    start = function (pause) {
        if (pause !== false && $.cookie('pauselvl') === "on") {
            $('#start .txt').html('Ready?');
            $('#start').addClass('pause').fadeIn(500);
            return false;
        }
        gameObject = new Gamer();
        gameObject.sequence = Levels.createSequence();
        gameObject.createGrid();
        gameObject.createTries();
        gameObject.populateGrid();
        BoardUtilities.checkClicks();
    };
    /**
     * Fire the start function, and fade out start button
     * @event start-button-vclick
     */
    $('#start').on("vclick", function () {
        $(this).fadeOut(500);
        setTimeout(function () {start($(this).hasClass('pause')); }, 1000);
        return false;
    });
});
