accessSlider
============

Plugin jQuery - Slider accessible

* Accessible RGAA
* Slides affichées sans JavaScript
* ARIA
* Gestion du clavier
 * Flèche pour déplacer le focus
 * Entrée pour afficher
* Mise en pause au survol & au clic sur un titre


## Compatibilité

* IE7+
* Chrome
* Firefox


## Installation

### 1. Joindre le plugin

```html
<script src="assets/js/plugins/jquery.accessSlider.js"></script>
```

```html
<link rel="stylesheet" media="all" href="assets/css/plugins/accessSlider.css" />
```


### 2. HTML

```html

<div id="slider" class="accessslider">

	<!-- "accessslider-count-X" remplacer le X par le nombre d'éléments du carousel -->
	<ul data-accessslider="titles" class="accessslider-count-8">
		<li><a href="#panel-id-1"><span>Le groupe Jouve</span></a></li>
		<li><a href="#panel-id-2"><span>BPO/ITO</span></a></li>
		<li><a href="#panel-id-3"><span>Services Éditoriaux</span></a></li>
		<li><a href="#panel-id-4"><span>IT Solutions</span></a></li>
		<li><a href="#panel-id-5"><span>Impression et Services Associés</span></a></li>
		<li><a href="#panel-id-6"><span>Innovation</span></a></li>
		<li><a href="#panel-id-7"><span>Lorem Ipsum</span></a></li>
		<li><a href="#panel-id-8"><span>Lorem Exemple</span></a></li>
	</ul>


	<div id="panel-id-1" data-accessslider="slide" class="accessslider-slide">
		<a href="#"><img src="http://placehold.it/643x336/CCCCCC.png" alt="Text"></a>
	</div>

	<div id="panel-id-2" data-accessslider="slide" class="accessslider-slide">
		<a href="#"><img src="http://placehold.it/643x336/EAC5AE.png" alt="Text"></a>
	</div>

	<div id="panel-id-3" data-accessslider="slide" class="accessslider-slide" data-accessslider-active-slide="true">
		<a href="#"><img src="http://placehold.it/643x336/E4EA9C.png" alt="Text"></a>
	</div>

</div><!--/accessslider-wrapper-->
```


### 3. JavaScript

```js
$(document).ready(function() {

	// Slider
	if( $.fn.accessSlider )
		$('#slider').accessSlider({
			auto: true,
			delay: 1000
		});

}); // /ready
```


### 4. Options

* **data-accessslider-active-slide** : Slide affiché au chargement (défaut : 1ère slide)
* **delay** : Durée des slides (défaut : 5000 (ms))
* **auto** : Défilement automatique (défaut : false)
* **pauseButton** : Affiche un bouton pause/lecture pour le mode automatique (défaut : false)
* **pauseButtonLabel** : Contenu du bouton pause (défaut : "Arrêter")
* **playButtonLabel** : Contenu du bouton lecture (défaut : "Relancer")

### 5. Méthodes

* **onShow** : Déclenchée à l'affichage d'un slide
* **onPause** : Déclenchée au survol d'un slide
* **onPlay** : Déclenchée en quittant le survol d'un slide