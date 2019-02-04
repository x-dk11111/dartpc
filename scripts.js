winner = 0;
active = 1;
other = 2;
wurf = 0;
game = 501;
popUp = 3;
ghost = 0;
ghost_id = 0;
ghostScores = new Object();
ghostArray = new Array(180,170,151);
player = new Array();
player[1] = new Array();
player[2] = new Array();
player[0] = '';
$( document ).on( "keydown", function( event ) {
	if(event.which == 13){
		if(popUp == 0){
			if(ghost == 1 && active == 2){
				var value = ghostArray[wurf];
			}else{
				var value = $('#currWurf_'+active+' input').val();
			}
			value = (value*10)/10;

			if(value == ''){
				value = 0*1;
			}else if(value > 180){
				value = 0*1;
			}
			var sum = 0;
			for (var i = 0; i < player[active].length; i++) {
			   sum = (sum*1)+(player[active][i]*1)/1;
			}
			
			console.log("Sum: "+sum+" + "+value+" = "+(sum+value));
			if((sum + (value*10)/10) <= game){

				player[active][wurf] = (value*10)/10;
				sum = sum + player[active][wurf];
				left = game - sum;
				var avg = sum / player[active].length;
				$('#curravg_'+active).html(avg.toFixed(2));
				$('.player_'+active+' .left').html(left);
				if(left == 0){
					winner = active;
					// active player is winner!!
					var msg = "<h2>Spieler "+$('.player_'+active+'_name').html()+" hat gewonnen! Wuhu!</h2>";
					if((active == 2 && ghost != 1) || active == 1){
						msg+="<br>M&ouml;chtest du das Ergebnis als Geist speichern?<p></p><input type='button' value='yes brah' id='saveGhost'> <input type='button' value='go away' id='noSaving'>";
					}else{
						popUp = 2;
						msg+="<input type='button' value='neues Spiel' id='reload' autofocus>";
					}
					$('#popUp').html(msg).css("display","block");
					// var dude = confirm("Spieler "+$('.player_'+active+'_name').html()+" hat gewonnen! Wuhu!");
					// if(dude == true){
					// 	location.reload();
					// }
				}
			}	
			else{
				value = 0*1;
				player[active][wurf] = value;
			}
			$('#currWurf_'+active).css('display','none');
			$('#currWurf_'+active+' input').val('');
			$('.player_'+active+' .scores .scoreWrapper').append('<div class="wurf" id="'+active+'_'+wurf+'">'+value+'</div>');
			// $('.player_'+other+' .scores').append('<div id="currWurf_'+other+'"><input type="text" id="curInp_'+other+'"></div>');
			$('#currWurf_'+other).css('display','block');
			$('#curInp_'+other+'').focus();
			if(active == 1){
				active = 2;
				other = 1;
			}else{
				active = 1;
				other = 2;	
				wurf++;
				if(wurf > 0){
					var dartsSum = (wurf+1)*3;
					$('.dartsWrapper').append("<div class='dartsSum'>"+dartsSum+"</div>");
				}
			}
		}
		else if(popUp == 2){
			location.reload();
		}else if(popUp == 3){
			
		}else{
			update();
		}
	}
	if (event.which == 27) {
		
	}
  // console.log(player);
});
$(function(){
	$('#ghost').on('click',function(){
		if($('#ghost').is(':checked')){
			getScores();
		}else{
			$('#ghostSel').html('');
		}
	});
	$('#startGame').on('click', function(){
		popUp = 0;
		var name_p1 = $('#playerName1').val();
		var name_p2 = $('#playerName2').val();
		if(name_p1.length == 0){
			name_p1 = "Spieler 1";
		}
		if(name_p2.length == 0){
			name_p2 = "Spieler 2";
		}
		if($('#ghost').is(':checked')){
			ghost = 1;
			var ghost_id = $('#ghostId').val();
			ghostArray = ghostScores[ghost_id].scores;
			console.log(ghostArray);
			var nameAdd = " (S)";
		}else{
			var nameAdd = "";
		}
		$('.player_1_name').html(name_p1);
		$('.player_2_name').html(name_p2+nameAdd);
		$('#popUp').css("display","none");
		$('#curInp_1').focus();
	});	
	$('.scoreWrapper').on('click','.wurf',function(){

		var thisWurf = $(this).attr("id");
		popUp = 1;
		$('#popUp').html("<h2>Neuen Wert eintragen</h2>Alter Wert: "+$(this).html()+"<br><input type='text' id='newvalue' rel='"+thisWurf+"' autofocus><input type='button' value='speichern' onclick='update();'>").css('display','block');
		$('#newvalue').focus();
	});
	$('#popUp').on('click','#saveGhost',function(){
		var ghostName = $('.player_'+winner+'_name').html();
		saveScore(ghostName,player[winner]);
	});
	$('#popUp').on('click','#noSaving',function(){
		location.reload();
	});
	$('#popUp').on('click','#reload',function(){
		location.reload();
	});
});
function update(){
	var wurf_id = $('#newvalue').attr("rel");
	var newValue = $('#newvalue').val();
	if(newValue == ''){
		newValue = 0;
	}
	if(newValue <= 180){
		$('#'+wurf_id).html(newValue);
		var res = wurf_id.split("_");
		var maybeNewSum = doTheMath(res[0], newValue);
		if(maybeNewSum != false){
			player[res[0]][res[1]] = newValue;
			var newLeft = game - maybeNewSum;
			$('.player_'+res[0]+' .left').html(newLeft);
			$('#curravg_'+res[0]+'').html(getAVG(res[0]));
			if(newLeft == 0 || newLeft == '0'){
				// active player is winner!!
				var msg = "<h2>Spieler "+$('.player_'+res[0]+'_name').html()+" hat gewonnen! Wuhu!</h2>";
				if((res[0] == 2 && ghost != 1) || res[0] == 1){
					msg+="<br>M&ouml;chtest du das Ergebnis als Geist speichern?<p></p><input type='button' value='yes brah' id='saveGhost'> <input type='button' value='go away' id='noSaving'>";
				}else{
					popUp = 2;
					msg+="<input type='button' value='neues Spiel' id='reload' autofocus>";
				}
				winner = res[0];
				$('#popUp').html(msg).css("display","block");
				// active player is winner!!
				// var msg = "Spieler "+$('.player_'+res[0]+'_name').html()+" hat gewonnen! Wuhu!";
				// if((res[0] == 2 && ghost != 1) || res[0] == 1){
				// 	msg+="<br>Möchtest du das Ergebis als Geist speichern?";
				// }
				// $('#popUp').html(msg);
				// var dude = confirm("");
				// if(dude == true){
				// 	location.reload();
				// }
			}else{
				$('#popUp').css("display","none");
			}
		}else{
			console.log("false")
			$('#popUp').css("display","none");
		}
		popUp = 0;
		$('#curInp_'+active+'').focus();
	}else{
		$('#response').html("nah brah!");
	}

}
function doTheMath(theone, newValue){
	var newSum=0;
	for (var i = 0; i < player[theone].length-1; i++) {
		newSum = (newSum*1) + (player[theone][i])*1;
	}
	var theSum = (newSum*1)+(newValue*1);
	console.log("sum "+theSum);
	if((theSum) > game){
		return false;
	}else{
		return theSum;
	}
}
function getAVG(theone) {
	var newSum = 0;
	for (var i = 0; i < player[theone].length; i++) {
		newSum = (newSum*1) + (player[theone][i])*1;
	}
	var avg =newSum/player[theone].length;
	console.log("AVG "+avg);
	avg =  avg.toFixed(2);
	return avg;
}	
function saveScore(name,dude){
	$.ajax({        
		type: "POST",
		url: "/scores.php",
		data: {r:2,name:name,dude:dude},
		success: function(msg){
			if(msg == "1"){
				location.reload();
			}
		}
	});	
}
function getScores() {
	var printError = function( req, status, err ) {
		  console.log( 'something went wrong ', status, err );
		};
	$.ajax({        
		type: "POST",
		url: "/scores.php",
		data: {r:1},
		dataType: 'json',
		success: function($jsonAnswer){
			var msg = '<select id="ghostId">';
			var last = $jsonAnswer.length;
			for (var i = 0; i < last; i++) {
				msg+='<option value="'+i+'">'+$jsonAnswer[i].bra+' &empty;'+$jsonAnswer[i].avg+'</option>';
			}
			msg+= '</select><br>';
			ghostScores = $jsonAnswer;
			$('#ghostSel').html(msg);
		},
		error: printError
	});
}