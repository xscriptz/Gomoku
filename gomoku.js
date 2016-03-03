var websocket = new WebSocket("ws://localhost:8080/Gomoku/connectfive"),
	body = document.getElementById("body"),
	turn = 0,
	color,
	otherColor;
	body.addEventListener("click", click, false);
	
websocket.onerror = function(evt) { onError(evt) };
document.getElementById("button").addEventListener("click", reload, false);
document.getElementById("sendButton").addEventListener("click", chat, false);
document.getElementById("chatText").addEventListener("click", checkEnter, true);

function checkEnter(e){
	if (e.keyCode == 13) {
		chat();
	}
}

function reload(){
	location.reload();
}

function chat() {
	if(typeof color !== 'undefined'){
		var text = document.getElementById("chatText").value,
			json = JSON.stringify({"message": text, "color" : color});
		document.getElementById("chatHistory").value += color +": "+text+"\n";
		document.getElementById("chatText").value ="";
		sendText(json);
	}
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
websocket.onmessage = function(evt) { onMessage(evt) };

function sendText(json) {
    websocket.send(json);
}

function notify(message){
	document.getElementById("message").innerHTML = message;
	document.getElementById("popup").style.display = "block";
	turn = 0;
}
                
function onMessage(evt) {
    var message = JSON.parse(evt.data); 
    if (typeof message.start !== 'undefined'){
    	color = message.start;
    	document.getElementById("chatHistory").value ="";
    	if(color == "black"){
    		otherColor = "white";
    		turn = 1; 
    		document.getElementById("turn").innerHTML="Your Turn";
    	} else {
    		document.getElementById("turn").innerHTML = "Other Player's Turn";
    		otherColor = "black";
    	}
    } else {
    	if(typeof message.id !== 'undefined') {
    		drawPiece(otherColor, message.id);
    		turn = 1;
    		document.getElementById("turn").innerHTML="Your Turn";
    	}
    }
    
    if(typeof message.message !== 'undefined' && message.color !== 'undefined'){
    	document.getElementById("chatHistory").value += message.color +": "+message.message+"\n";
    }
  
    //Check victory condition
    checkVictory(otherColor);
    
    if(typeof message.win !== 'undefined') {
    	notify(message.win);
    }
    
}



function click(evt){
	if(turn == 1 && document.getElementById(evt.srcElement.id).className.indexOf(color)==-1 && document.getElementById(evt.srcElement.id).className.indexOf(otherColor)==-1) {
		var json = JSON.stringify({"id": evt.srcElement.id});
		drawPiece(color, evt.srcElement.id);
		sendText(json);
		turn = 0;
		document.getElementById("turn").innerHTML="Other Player's Turn";
		checkVictory(color);
	} 
} 

function drawPiece(color, id){
	var node = document.getElementById(id);
	if(node){
			node.className = "square "+color;
	}
}

function checkVictory(color) {
	var nodes = document.getElementsByClassName(color),
		allNodes = document.getElementsByClassName("square"),
		arrayLength = nodes.length;
	for (var i = 0; i < arrayLength; i++) {
		//Horizontal
		var firstHalf = 0,
			secondHalf = 0,
			currentNode = nodes[i],
			id = parseInt(currentNode.id);
		
		var toCheck = 4;
		if((id+1)%18<toCheck){
			toCheck = id%19;
		}
		for(var j=1;j<toCheck;j++){
			if(document.getElementById(id-j).className.indexOf(color)>-1){
				firstHalf++;
			} else {
				break;
			}
		}
		
		toCheck = 4;
		if(19-id%19<toCheck){
			toCheck = 19-id%19;
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(id+j).className.indexOf(color)>-1){
				secondHalf++;
			} else {
				break;
			}
		}
		if(secondHalf+firstHalf>=4){
			notify("Winner: " + color);
			return;
		}
		
		//Vertical
		firstHalf = 0;
		secondHalf = 0;
		currentNode = nodes[i];
		id = parseInt(currentNode.id);
		
		toCheck = 4;
		if(Math.floor((id-1)/19)<toCheck){
			toCheck = Math.floor((id-1)/19);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(id-j*19).className.indexOf(color)>-1){
				firstHalf++;
			} else {
				break;
			}
		}
		
		toCheck = 4;
		if(19-Math.floor((id-1)/19)<toCheck){
			toCheck = 19-Math.floor((id-1)/19);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(j*19+id).className.indexOf(color)>-1){
				secondHalf++;
			} else {
				break;
			}
		}
		if(secondHalf+firstHalf>=4){
			notify("Winner: " + color);
			return;
		}
		
		
		// \ <- that direction
		firstHalf = 0;
		secondHalf = 0;
		currentNode = nodes[i];
		id = parseInt(currentNode.id);
		
		toCheck = 4;
		if(Math.floor((id-1)/20)<toCheck){
			toCheck = Math.floor((id-1)/20);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(id-j*20).className.indexOf(color)>-1){
				firstHalf++;
			} else {
				break;
			}
		}
		
		toCheck = 4;
		if(19-Math.floor((id-1)/20)<toCheck){
			toCheck = 19-Math.floor((id-1)/20);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(j*20+id).className.indexOf(color)>-1){
				secondHalf++;
			} else {
				break;
			}
		}
		if(secondHalf+firstHalf>=4){
			notify("Winner: " + color);
			return;
		}
		
		// / <- that direction
		firstHalf = 0;
		secondHalf = 0;
		currentNode = nodes[i];
		id = parseInt(currentNode.id);
		
		toCheck = 4;
		if(Math.floor((id-1)/18)<toCheck){
			toCheck = Math.floor((id-1)/18);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(id-j*18).className.indexOf(color)>-1){
				firstHalf++;
			} else {
				break;
			}
		}
		
		toCheck = 4;
		if(19-Math.floor((id-1)/18)<toCheck){
			toCheck = 19-Math.floor((id-1)/18);
		}
		for(var j=1;j<toCheck+1;j++){
			if(document.getElementById(j*18+id).className.indexOf(color)>-1){
				secondHalf++;
			} else {
				break;
			}
		}
		if(secondHalf+firstHalf>=4){
			notify("Winner: " + color);
			return;
		}
	}
	
}

