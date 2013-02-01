TestCase("GetRequestTest", {
    setUp: function () {
        /*:DOC +=
          <html><body> 
             <div data-role="page" id="page">
                  <div data-role="header">
                      <h1>Memory Game</h1>
                      <a href="index.html" id="start-over" data-ajax="false">start over</a>
                      <a href="settings.html" data-icon="gear" data-transition="slide" data-ajax="false">settings</a>
                      <div id="tries"></div>
                      <div id="status"></div>
                  </div>
                  <div data-role="content">
                      <a id="start" href="/" data-icon="star" data-role="button"><span class="txt">Start!</span></a>
                  </div>
             </div>
             <div class="hide">Hidden...
                <img src="../images/item0.png" alt="preload"/>
                <img src="../images/item0_alt.png" alt="preload"/>
                <img src="../images/bkg0.jpg" alt="preload"/>
             </div>
          </body></html>
          */
        console.log($(document).val());$(document).trigger('pageinit');
        $.cookie('numletters','num'); console.log('test');
    },
    "test should obtain an XMLHttpRequest object": function () {
        assertEquals(2009, Levels.createSequence());
    }
});
