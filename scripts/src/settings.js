$(document).bind('pageinit', function () {
    "use strict";
    var Settings;
    /**
     * @class Settings 
     * Creates default settings for the game. Stores settings in cookies,
     * and also updates the UI form fields with cookie values.
     */

    Settings = (function () {
        var config;
        /**
         * @cfg settings Game defaults
         * @cfg settings.randstart Random sequence start on/off
         * @cfg settings.pauselvl Pause between levels on/off
         * @cfg settings.numletters Sequence is num or letters
         * @cfg settings.timeratio How long it takes to hide subsequent levels:
         * timeratio * ( level^1.1 ) + gen_time
         * @cfg settings.gen_time Base time added to the level
         * @cfg settings.level The starting level
         * @cfg settings.fixed Wether the level repeats or advances
         */
        config = {
            randstart: 'off',
            pauselvl: 'off',
            numletters: 'letters',
            timeratio: 'ratio_2',
            gen_time: 'time_0',
            level: 1,
            fixed: 'off'
        };

        // Initiallize cookies for game if they're empty
        (function () {
            var key;
            for (key in config) {
                if (config.hasOwnProperty(key) && $.cookie(key) === null) {
                    $.cookie(key, config[key]);
                }
            }
        }());
        /**
         * when form fields change, update cookie values
         * @event form-field-change
         */
        $('form select').change(function () {
            var id = $(this).attr('id'), value = $(this).val();
            $.cookie(id, value);
        });

        $('form input').change(function () {
            var name = $(this).attr('name'), value = $(this).val();
            $.cookie(name, value);
        });

        // Update form fields with cookies
        $('form select').each(function () {
            var id = $(this).attr('id');
            $(this).val($.cookie(id));
            $(this).slider('refresh');
        });

        $('form .slider input').each(function () {
            var id = $(this).attr('id');
            $(this).val($.cookie(id));
            $(this).slider('refresh');
        });

        $('form .input input').each(function () {
            var id = $(this).attr('name');
            $('#' + $.cookie(id)).attr('checked', true);
            $(this).checkboxradio('refresh');
        });
    }());
});
