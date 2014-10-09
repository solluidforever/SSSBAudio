/*
 * Simple Metro Music Player v1.0
 */

$(function(){
	//Create an object to play HTML5 Audio files
	var objReproductor=new Audio();
	//Variable to store the song that is playing
	var iCancionActual=0;
	//Obtain the total number of songs in the list (below the need)
	var iTotalCanciones=$('#olCanciones li').length;

	//We assign to the player the first song in the list
	objReproductor.src=$('#olCanciones').children().eq(0).attr('rel');

	//Click the play button
	$('#btnReproducir').on('click',function(){
		//Call the function that plays the files
		$.fntReproducir();
	});

	//Play the next file in the list
	$('#btnSiguiente').on('click',function(){
		//Check if still more songs in the list
		if(iCancionActual<iTotalCanciones-1){
			//Proceed to the next song
			iCancionActual++;
		}else{
			//Return to the first song in the list
			iCancionActual=0;
		}
		//Reproduce the file that is
		$.fntReproducir();
	});

	//Displayable silence
	$('#btnSilencio').on('click',function(){
		//Placed on mute to its opposite state
		//Turn to turn the sound, if the sound is enabled disable it
		objReproductor.muted=!objReproductor.muted;
		//Remove or add the class that indicates whether the sound is on or off
		$(this).toggleClass('clsSeleccionado');
	});

	//Function that plays audio files
	$.fntReproducir=function(){
		//Get an instance of the element containing the info. of song to play
		var $objContenedorCancion=$('#olCanciones').children().eq(iCancionActual);
		//Get the path of the file to be played and assign that
		//The source of HTML5 audio player
		objReproductor.src=$objContenedorCancion.attr('rel');

		//Uncheck any song in the list
		$('#olCanciones li').removeClass('clsSeleccionado');
		//Marked in the song list let's play
		$objContenedorCancion.addClass('clsSeleccionado');

		//Play the song with the play method
		objReproductor.play();

		//Hide data smoothly previous song
		$('#divInfoCancion').find('label').stop(true.true).animate({
			opacity: 0
		},function(){
			//Get an instance of the element containing the song data
			var $objContenedorCancion=$('#olCanciones').children().eq(iCancionActual);

			//Update the information of the song that is playing
			//Total duration
			$('#lblDuracion').find('span').text('00:00');
			//Name of the song
			$('#lblCancion').find('span').text($objContenedorCancion.find('strong').text());
			//Artist
			$('#lblArtista').find('span').text($objContenedorCancion.find('em').text());
			//Elapsed time
			$('#lblEstado').find('span').text('00:00');

			//Gently show info. New song
			$(this).stop(true,true).animate({
				opacity: 1
			});
		});
	};

	//Event to click on the button above
	$('#btnAnterior').on('click',function(){
		//Check if we are positioned in the first song or not
		if(iCancionActual>=1){
			//Go back a song
			iCancionActual--;
		}else{
			//We turn to the last song in the list
			iCancionActual=$('#olCanciones li').length-1;
		}
		//Reproduce the song
		$.fntReproducir();
	});

	//Event by clicking on any of the songs
	$('#olCanciones li').on('click',function(){
		//Establish the number of song
		iCancionActual=$(this).index();
		//Call the function that plays audio files
		$.fntReproducir();
	});

	//Player errors
	$(objReproductor).on('error',function(){
		alert('No Internet Connectivity - Cannot Stream Audio!');
	});

	//Pause or continue playing
	$('#btnPausar').on('click',function(){
		//Check if the reproduction is paused
		if(objReproductor.paused){
			//Verify that the file has been played even an instant
			if(objReproductor.currentTime>0){
				//Resumed playback
				objReproductor.play();
				//Eliminate the class to the button
				$(this).removeClass('clsSeleccionado');
			}
		}else{
			//Add the class to the button
			$(this).addClass('clsSeleccionado');
			//Pause current playback
			objReproductor.pause();
		}
	});

	//Button to set the continuous reproduction of the list
	$('#btnRepetir').on('click',function(){
		$(this).toggleClass('clsSeleccionado');
	});

	$(objReproductor).on('ended',function(){
		if(iCancionActual==iTotalCanciones-1){
			if($('#btnRepetir').hasClass('clsSeleccionado')){
				$('#btnSiguiente').trigger('click');
			}
		}else{
			$('#btnSiguiente').trigger('click');
		}
	});

	//Update the time and the progress bar
	$(objReproductor).on('timeupdate',function(){
		//Elapsed playback time
		var iTiempoTranscurrido=objReproductor.currentTime;
		//Total duration of the song
		var iTiempoTotal=objReproductor.duration;
		//Approximate percentage of reproduction
		var iPorcentajeProgreso=(iTiempoTranscurrido*100)/iTiempoTotal;
		//Format the time
		var objTiempo=$.fntTransformarSegundos(iTiempoTranscurrido);

		//Get the length of the song
		var objDuracion=$.fntTransformarSegundos(iTiempoTotal);
		$('#lblDuracion').find('span').text(objDuracion[0]+':'+objDuracion[1]);

		$('#divBarra').css('width',iPorcentajeProgreso+'%');
		//Update the elapsed time
		$('#lblEstado').find('span').text(objTiempo[0]+':'+objTiempo[1]);
	});

	//Function to format the seconds to minutes and seconds
	$.fntTransformarSegundos=function(iTiempoTranscurrido){
		var iMinutos=Math.floor(iTiempoTranscurrido/60);
		var iSegundos=Math.floor(iTiempoTranscurrido-iMinutos*60);

		//Add a zero to the minutes and seconds, just for aesthetics
		if(iSegundos<10) iSegundos='0'+iSegundos;
		if(iMinutos<10) iMinutos='0'+iMinutos;

		//Return a formatted time array
		return Array(iMinutos,iSegundos);
	};

	//Change the opacity of the buttons by placing the mouse over them
	$('input[type="button"]').hover(function(){
		//Change the opacity to 50%
		$(this).stop(true.true).animate({
			opacity: .5
		});
	},function(){
		//Button back to 100% opacity
		$(this).stop(true,true).animate({
			opacity: 1
		});
	});

});