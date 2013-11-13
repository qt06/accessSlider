(function ($) {

  /**
  * Plugin jQuery accessSlider v1.0.0 (11/2013)
  *
  */

  $.accessSlider = function (element, options) {

    // Options par défaut
    var defaults = {
      delay: 5000,
      auto: false,
      pauseButton: false,
      pauseButtonLabel: 'Arrêter',
      playButtonLabel: 'Relancer',
      onShow: function () {},
      onPlay: function () {},
      onPause: function () {}
    };

    var plugin = this,
      $element = $(element);

    plugin.settings = {};



    // Définir l'état de lecture
    var setPlayState = function (playstate) {
      $element.data('playstate', playstate);

      if (playstate) { plugin.settings.onPlay(); } else {
        plugin.settings.onPause();
      }
    };



    // Définir le défilement automatique
    var setAuto = function (auto) {
      $element.data('auto', auto);
      $element.find('> button').html(auto === true ? plugin.settings.pauseButtonLabel : plugin.settings.playButtonLabel);
    };



    // Fonction publique
    // Appel : $('.x').data('newsSlider').activeSlide( item )
    plugin.activeSlide = function (slideIndex) {

      // Désactiver l'élément précédent
      plugin.settings.$titles
        .removeClass('accessslider-active-title');

      plugin.settings.$slides
        .removeAttr('data-accessslider-active-slide')
        .removeClass('accessslider-active-slide');

      // Activer le titre
      plugin.settings.$titles.eq(slideIndex)
        .addClass('accessslider-active-title');

      // Activer le slide
      plugin.settings.$slides.eq(slideIndex)
        .attr('data-accessslider-active-slide', true)
        .addClass('accessslider-active-slide');

      plugin.settings.activeSlideIndex = slideIndex;
      plugin.settings.onShow(slideIndex);

    };



    // Fonction publique
    // Appel : $('#slider').data('accessSlider').play()
    plugin.play = function () {

      if( ! $element.data('playstate') && $element.data('auto') )
      {
        // Afficher le slide suivant
        var nextSlideIndex = plugin.settings.activeSlideIndex + 1;
        if( nextSlideIndex >= plugin.settings.slidesCount )
          nextSlideIndex = 0;

        plugin.activeSlide( nextSlideIndex );
      }
      window.setTimeout('$("#' + $element.attr('id') + '").data("accessSlider").play()', plugin.settings.delay);

    };





    // Initialiser le widget
    var initWidget = function () {

      // Ajouter une classe indiquant le nombre de slides
      $element.addClass('accessslider-count-' + plugin.settings.slidesCount);


      // Générer le bouton "pause"
      if (plugin.settings.pauseButton) {
        $element.prepend('<button type="button" class="accessslider-play-state">' + plugin.settings.pauseButtonLabel + '</button>');
      }


      // Initialiser le marqueur de survol
      setPlayState(false);


      // Initialiser le bouton
      setAuto(plugin.settings.auto);


      // Afficher le slide actif (active-slide), par défaut, le premier
      var $activeSlide = plugin.settings.$slides.filter('div[data-accessslider-active-slide="true"]');
      if (!$activeSlide.length) { $activeSlide = plugin.settings.$slides.first(); }

      $activeSlide
        .addClass('accessslider-active-slide')
        .attr('data-accessslider-active-slide', 'true');


      // Activer le titre actif
      var activeSlideIndex = $activeSlide.prevAll('div').length;
      var $activeTitle = plugin.settings.$titles.eq($activeSlide.prevAll('div').length);
      plugin.settings.activeSlideIndex = activeSlideIndex;

      $activeTitle
        .attr('aria-selected', 'true')
        .addClass('accessslider-active-title')
        .attr('tabindex', '0');

    };




    // Gestion du clavier
    var manageKeyboard = function () {

      var key;

      // Gestion du clavier
      plugin.settings.keyboard.KEY_NAMES_BY_CODE = {
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        27: 'esc',
        32: 'space',
        33: 'page_up',
        34: 'page_down',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      plugin.settings.keyboard.KEY_CODES_BY_NAME = {};

      for (key in plugin.settings.keyboard.KEY_NAMES_BY_CODE) {
        if (Object.prototype.hasOwnProperty.call(plugin.settings.keyboard.KEY_NAMES_BY_CODE, key)) {
          plugin.settings.keyboard.KEY_CODES_BY_NAME[plugin.settings.keyboard.KEY_NAMES_BY_CODE[key]] = +key;
        }
      }

    };



    // Placer les rôles ARIA
    var setARIA = function () {


      plugin.settings.$slides.attr({
        'role':     'tabpanel'
      });


      plugin.settings.$titlesList.attr({
        'role' : 'tablist'
      });


      plugin.settings.$titles.each(function () {

        var $this = $(this);

        $this.attr({
          'role': 'tab',
          'aria-selected': 'false',
          'aria-controls': $this.find('a').attr('href').replace('#', '')
        })
          .find('a').attr('tabindex', '-1');

      });


    };


    // Déplacer le focus
    var applyFocusTo = function ($focusedElmt, direction) {

      var $focusTarget = (direction === 'next') ? $focusedElmt.next() : $focusedElmt.prev();

      $focusTarget
        .attr('tabindex', '0')
        .focus();

      $focusedElmt
        .attr('tabindex', '-1');

    };


    var setEvents = function () {

      // Mettre en pause le défilement au survol
      $element.hover(function () {
        setPlayState(true);
      }, function () {
        setPlayState(false);
      });


      // Lancer/relancer le défilement automatique
      $element.find('> button').click(function () {
        setAuto($element.data('auto') ? false : true);
      });


      // Activer un slide
      plugin.settings.$titles.bind('click', function (event) {
        event.preventDefault();
        plugin.activeSlide($(this).index());
        setAuto(false);
      });


      // Utilisation des flèches pour déplacer le focus
      plugin.settings.$titles.keydown(function (event) {

        switch (plugin.settings.keyboard.KEY_NAMES_BY_CODE[event.keyCode]) {

        case 'right':
          applyFocusTo($(this), 'next');
        case 'down':
          applyFocusTo($(this), 'next');
          return false;
          break;


        case 'up':
          applyFocusTo($(this), 'prev');
        case 'left':
          applyFocusTo($(this), 'prev');
          return false;
          break;


        case 'enter':
          $(this).find('a').trigger('click');
          return false;
          break;

        }

      });


    };


    plugin.init = function () {

      // Ecrasement avec les options utilisateur
      plugin.settings = $.extend({}, defaults, options);

      plugin.settings.$titlesList = $element.find('> ul[data-accessslider="titles"]');
      plugin.settings.$titles = plugin.settings.$titlesList.find('> li');
      plugin.settings.$slides = $element.find('> div[data-accessslider="slide"]');
      plugin.settings.slidesCount = plugin.settings.$slides.length;
      plugin.settings.keyboard = {};

      setARIA();

      manageKeyboard();

      initWidget();

      setEvents();

      // Activer le défilement automatique
      window.setTimeout('$("#' + $element.attr('id') + '").data("accessSlider").play()', plugin.settings.delay);

    };



    plugin.init();

  }



  $.fn.accessSlider = function(options) {

    return this.each(function () {

      if (undefined == $(this).data('accessSlider')) {

        var plugin = new $.accessSlider(this, options);
        $(this).data('accessSlider', plugin);

      }

    });

  };


})( jQuery );