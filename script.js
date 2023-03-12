const logContainer = document.getElementById('container');
const single = document.getElementById('singlePlayer');
const multi = document.getElementById('multiPlayer');
const body = document.querySelector('body');
let board; //board selector

let disableClick = true; //switch for disabling click events
let turn = "Player 2";   
let player2 = "Player 2"; // 'Player 2' for multiplayer,otherwise 'CPU'
let input;   // switch for 'X' or 'O'
let singleplayer; //toggles singleplayer mode
let draw = false; 

let leftTurn;  //selector for turn display(right)
let rightTurn; //'''''''''''''''''''''''''(left)



function disableEvents(){
    disableClick = true;
    document.addEventListener("click", e => {   //disable all click events
        if(disableClick){
            e.stopPropagation();
            e.preventDefault();
        }
    },true)
}

function changeLog(){   //changes the menu to handle shape selection and calls the main function

    removeChilds(logContainer);

    let title = document.createElement('p');
    title.classList.add("title");
    title.innerHTML = "&lt;Tic Tac Toe&#47;&gt;";
    
    let p = document.createElement('p');
    p.innerHTML = "Shape Selection";
    
    let x = document.createElement('div');
    x.classList.add('shapes')
    x.setAttribute('id','x');
    x.innerHTML = 'X';
    
    let o = document.createElement('div');
    o.classList.add('shapes');
    o.setAttribute('id','o');
    o.innerHTML = 'O';
    
    logContainer.appendChild(title);
    logContainer.appendChild(p);
    logContainer.appendChild(x);
    logContainer.appendChild(o);

    x.addEventListener('click',() => {
        let player1 = 'X'
        removeChilds(logContainer);
        logContainer.remove()
        playTicTacToe(player1,singleplayer,'O');
    });
    
    o.addEventListener('click',() => {
        let player1 = 'O';
        removeChilds(logContainer);
        logContainer.remove()
        playTicTacToe(player1,singleplayer,'X');
    });


}

function removeChilds(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

function createBoard(){
    let bo = document.createElement('div');
    bo.classList.add('gridContainer');
    bo.setAttribute('id','board');
    body.appendChild(bo);

    for(i = 0; i < 3; i ++){
        for(j = 0;j < 3;j ++){
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.setAttribute('id',i.toString().concat(j.toString()));
            bo.appendChild(tile);
            
        }
    }
    board = document.getElementById('board')

    let leftLog = document.createElement('div');
    let rightLog = document.createElement('div');
    
    leftLog.classList.add("turnLog")
    leftLog.setAttribute('id','leftLog')
    rightLog.classList.add("turnLog");
    rightLog.classList.add("right");
    rightLog.setAttribute('id','rightLog')

    body.appendChild(leftLog);
    body.appendChild(rightLog);

    rightTurn = document.getElementById('rightLog');
    leftTurn = document.getElementById('leftLog');

}

function checkBoard(tiles){
    
    let check = "";
   
    check = "";
    //check rows
    for(i = 0;i < 9;i++){
        check+=tiles[i].innerHTML
        if(i % 3 == 2 ){
            if(check == input.repeat(3)){
                return true
            }
            check = "";
        }
    }

    //check cols
    for(i = 0;i < 3;i++){
        for(j = i;j <= 8;j+=3){
            check+=tiles[j].innerHTML
        }
        if(check == input.repeat(3)){
            return true
        }
        check = "";
    }

    //check foward diag   
    for(i = 0;i <= 8;i += 4){
        check += tiles[i].innerHTML;
    }
    if(check == input.repeat(3)){return true
    }
    check = "";
    //check backwards diag
    for(i = 2;i <=6;i += 2){
        check += tiles[i].innerHTML;
    }
    if(check == input.repeat(3)){
        return true
    }
    
    
    return false
}

function checkDraw(tiles){
        for(j = 0;j < 9;j++){
           if(tiles[j].innerHTML.length == 0){
            return false
           }
        }
        
        draw = true;
        return true
    }


function cpuMove(tiles){
    let tilesArr = []
    tiles.forEach(tile => tilesArr.push(tile))
    
    let avaidableTiles = tilesArr.filter(tile => {   //check for empty tiles
        if(tile.innerHTML != 'X' && tile.innerHTML != 'O'){
            return tile
        }
    })
    
    let random = Math.floor(Math.random() * avaidableTiles.length)
    avaidableTiles[random].innerHTML = input;

   
}

function showResults(){
    removeChilds(body);
    
    let resultsContainer = document.createElement('div');
    resultsContainer.classList.add('resultsContainer');
    body.appendChild(resultsContainer)

    let title = document.createElement('p');
    title.classList.add("title");
    title.innerHTML = `${turn} wins!`;
    
    
    let playAgain = document.createElement('div');
    playAgain.classList.add('playButton')
    playAgain.setAttribute('id','playAgain');
    playAgain.innerHTML = "Play Again?";
    
    if(draw){
        title.innerHTML = "The game has tied..."
    }
    
    
    resultsContainer.appendChild(title);
    resultsContainer.appendChild(playAgain);

    playAgain.addEventListener('click',() => {window.location.reload()})
    disableClick = false;
    
}






//game mode selection
single.addEventListener('click',() => {
    singleplayer = true;
    changeLog()
    })

multi.addEventListener('click',() => {
    singleplayer = false
    changeLog()
})



//main 
function playTicTacToe(player,singleplayer,oponent){    
    
    createBoard();
    input = oponent;
    if(singleplayer === true){
      player2 = "CPU" 
      turn = player2;    
    }
    if(player == 'X'){   //check if Player 1 goes first
        turn = "Player 1"
        input = player;
    }
    
    leftTurn.innerHTML = "Player 1";
    rightTurn.innerHTML = player2;
    const tiles = document.querySelectorAll(".tile"); //selector for all tiles on the board
    
    //check if CPU goes first
    if(turn == "CPU"){
        disableEvents();
        setTimeout(() => {cpuMove(tiles)},1000);
        setTimeout(() => {
            disableClick = false
            input = player;
            turn = "Player 1"     
        },1200);
    }

    tiles.forEach(tile => { //add input and turn switching events to all tiles
        tile.addEventListener('click',() => {
            if(tile.innerHTML != "X" && tile.innerHTML != "O"){ //check if tile is empty
                tile.innerHTML = input;
                if(checkBoard(tiles) || checkDraw(tiles)){ //check end
                    //change turn before showing the results
                    if(turn == "Player 1"){
                        turn = "Player 2"
                    }
                    else if(turn == "Player 2"){  //only happens if singleplayer == false 
                        turn = "Player 1"
                    }
                    
                    disableEvents();
                    setTimeout(() =>{showResults()},1000)
                }
                
                //change turns
                if(turn == "Player 1"){
                    turn = player2;
                    input = oponent;
                    
                }
                else if(turn == "Player 2"){  //only happens if singleplayer == false 
                    turn = "Player 1"
                    input = player;
                } 
                
                //CPU movement(only if singleplayer == true)
                if(turn == "CPU"){
                    disableEvents();
                    setTimeout(() => {cpuMove(tiles)},1000); //Calls CPU movement function
                    
                    setTimeout(() => {
                        if(checkBoard(tiles)){ //check if CPU wins
                            turn = "CPU"
                            disableEvents();
                            showResults()
                        }
                        else if(checkDraw(tiles)){ 
                            showResults();
                        }
                        input = player;
                        turn = "Player 1"
                        disableClick = false
                    },2000)
                }
            }
        },{once: true})
    })
}










