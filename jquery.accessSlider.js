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
      count: false,
      transition: 'from-top',
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

      // Désactiver le slide actif
      plugin.settings.$titles
        .removeClass('accessslider-active-title');

      plugin.settings.$slides
        .removeClass('accessslider-prev-slide');

      plugin.settings.$slides.filter('.accessslider-active-slide')
        .addClass('accessslider-prev-slide');

      plugin.settings.$slides
        .removeAttr('data-accessslider-active-slide')
        .removeClass('accessslider-active-slide')
        .removeClass('accessslider-next');

      orderSlides( plugin.settings.activeSlideIndex );

      // Activer le slide

      // Activer le titre
      plugin.settings.$titles.eq(slideIndex)
        .addClass('accessslider-active-title');

      // Activer le slide
      plugin.settings.$slides.eq(slideIndex)
        .attr('data-accessslider-active-slide', true)
        .css('zIndex', plugin.settings.slidesCount)
        .addClass('accessslider-active-slide');

      plugin.settings.activeSlideIndex = parseInt(slideIndex);


      // Décaler la slide suivante
      var nextSlideIndex = plugin.settings.activeSlideIndex + 1;
      if( nextSlideIndex >= plugin.settings.slidesCount )
        nextSlideIndex = 0;

      plugin.settings.$slides.eq(nextSlideIndex)
        .addClass('accessslider-next');

      updateSlideNum(slideIndex);
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
      $element
        .addClass('accessslider-count-' + plugin.settings.slidesCount)
        .addClass('accessslider-transition-' + plugin.settings.transition);


      // Appliquer la profondeur aux slides
      plugin.settings.$slides.each(function(index) {
        $(this)
          .css('zIndex', plugin.settings.slidesCount - index)
          .attr('data-accessslider-index', index);
      });


      // Générer le bouton "pause"
      if (plugin.settings.pauseButton) {
        $element.prepend('<button type="button" class="accessslider-play-state">' + plugin.settings.pauseButtonLabel + '</button>');
      }


      // Initialiser le marqueur de survol
      setPlayState(false);


      // Initialiser le bouton
      setAuto(plugin.settings.auto);


      // Générer l'affichage du nombre
      if (plugin.settings.count) {
        $element.prepend('<div class="accessslider-slide-count"><span class="accessslider-slide-num"></span>/<span class="accessslider-slide-total">' + plugin.settings.slidesCount + '</span></div>');
      }


      // Afficher le slide actif (active-slide), par défaut, le premier
      var activeSlideIndex = plugin.settings.$slides.filter('div[data-accessslider-active-slide="true"]').attr('data-accessslider-index');
      if (activeSlideIndex)
        plugin.settings.activeSlideIndex = activeSlideIndex;

      plugin.activeSlide( plugin.settings.activeSlideIndex );

    };


    // Mettre à jour le numéro de slide
    var updateSlideNum = function(slideIndex) {
      $element.find('.accessslider-slide-num').text( parseInt(slideIndex) + 1 );
    };


    // Réordonner les slides
    var orderSlides = function( activeSlideIndex ) {

      plugin.settings.$slides.each(function(i) {

        var zIndex = plugin.settings.slidesCount - activeSlideIndex + i - 1;

        if( i > activeSlideIndex )
          var zIndex = plugin.settings.slidesCount - activeSlideIndex - i + 1;

        $(this).css('zIndex', zIndex);

      });

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
      plugin.settings.$slides = $element.find('div[data-accessslider="slide"]');
      plugin.settings.slidesCount = plugin.settings.$slides.length;
      plugin.settings.activeSlideIndex = 0;
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