/*
    Mahjong game for the web. 
    Currently do not have AI developed, so for now the game is in your hands.
*/
// To build deck
var types = ["bamboos", "circles", "characters"];
var dr_types = ["dragons"];
var wi_types = ["winds"];
var values = [1,2,3,4,5,6,7,8,9];
var dr_values = ["Re", "Gr", "Wh"];
var wi_values = ["E", "S", "W", "N"];

let messages = new Array();
let pairs = 0;
let game_deck = new Array();
let discard_deck = new Array();
let isDiscard = false;
let playerDeck = new Array();
let deficiencyNum = 0;
let isMahjong = false;
let isCalculatedDN = false;

function Build_Deck(){
    let Deck = new Array();

    for(let i = 0; i < types.length; i++){
        for(let j = 0 ; j < values.length; j++){
            let card = {Value: values[j], Suit: types[i]};
            let card2 = {Value: values[j], Suit: types[i]};
            let card3 = {Value: values[j], Suit: types[i]};
            let card4 = {Value: values[j], Suit: types[i]};
            game_deck.push(card);
            game_deck.push(card2);
            game_deck.push(card3);
            game_deck.push(card4);
        }
    }

    for(let i = 0 ; i < dr_types.length; i++){
        for(let j = 0 ; j < dr_values.length; j++){
            let card = {Value: dr_values[j], Suit: dr_types[i]};
            let card2 = {Value: dr_values[j], Suit: dr_types[i]};
            let card3 = {Value: dr_values[j], Suit: dr_types[i]};
            let card4 = {Value: dr_values[j], Suit: dr_types[i]};
            game_deck.push(card);
            game_deck.push(card2);
            game_deck.push(card3);
            game_deck.push(card4);
        }
    }

    for(let i = 0 ; i < wi_types.length; i++){
        for(let j = 0 ; j < wi_values.length; j++){
            let card = {Value: wi_values[j], Suit: wi_types[i]};
            let card2 = {Value: wi_values[j], Suit: wi_types[i]};
            let card3 = {Value: wi_values[j], Suit: wi_types[i]};
            let card4 = {Value: wi_values[j], Suit: wi_types[i]};
            game_deck.push(card);
            game_deck.push(card2);
            game_deck.push(card3);
            game_deck.push(card4);
        }
    }

    Shuffle(game_deck);
    console.log(game_deck);

    for(let i = 0 ; i < 16; i++){
        Deck.push(game_deck[i]);
        game_deck.splice(i, 1);
    }

    return Deck;
}

function Restart(){
    // removes all elements with classnames
    var list = document.getElementsByClassName("card");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);

    var list = document.getElementsByClassName("type");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);
    
    let elements = document.querySelectorAll('.history');

    elements.forEach(box => {
        box.remove();
    });

    playerDeck.length = 0;
    messages.length = 0;
    pairs = 0; deficiencyNum = 0;
    discard_deck.length = 0;
    isMahjong = false;
    isCalculatedDN = false;
    isDiscard = false;

    GameStart();
}

function Draw(){
    if(!isDiscard && !isMahjong){
        // able to discard
        playerDeck.push(game_deck[0]);
        ChatBox("Drew: " + game_deck[0].Value + " " + game_deck[0].Suit + " [waiting for player to discard . .] ");
        game_deck.splice(0, 1);

        Render_Deck(playerDeck);

        // Check mahjong, if not mahjong then discard
        CalculateDeficiencyNumber(Sort(playerDeck));

        if(deficiencyNum == 0){
            ChatBox("MAHJONG!!");
        }else{
            isDiscard = true;
        }


    }else{
        if(deficiencyNum == 0){
            ChatBox("MAHJONG!! Why you trying to draw???");
        }else{
            // need to discard
            ChatBox("Need to discard first . .");
        }
        
    }
    
}

function GameStart(){
    playerDeck = Build_Deck();
    playerDeck = Sort(playerDeck);
    console.log(playerDeck);
    Render_Deck(playerDeck);
    ChatBox("Welcome to Mahjong!");
    ChatBox("[Start by drawing a card]");

    CalculateDeficiencyNumber(playerDeck);
}

function Sort(deck){
    let bamDeck = new Array();
    let cirDeck = new Array();
    let manDeck = new Array();
    let draDeck = new Array();
    let winDeck = new Array();

    for(let i = 0 ; i < deck.length; i++){
        if (deck[i].Suit == 'bamboos')
            bamDeck.push(deck[i]);
        else if (deck[i].Suit == 'circles')
            cirDeck.push(deck[i]);
        else if (deck[i].Suit == 'characters')
            manDeck.push(deck[i]);
        else if(deck[i].Suit == 'dragons')
            draDeck.push(deck[i]);
        else if(deck[i].Suit == 'winds')
            winDeck.push(deck[i]);
    }

    Organize(bamDeck);
    Organize(cirDeck);
    Organize(manDeck);
    Organize(draDeck);
    Organize(winDeck);

    let fusedDeck = new Array();

    fusedDeck = fusedDeck.concat(bamDeck, cirDeck, manDeck, draDeck, winDeck);

    return fusedDeck;
}

function Organize(deck){
    for(let i = 1 ; i < deck.length; i++){
        let key = deck[i].Value;
        let keyCard = deck[i];
        let j = i - 1;
        while(j >= 0 && deck[j].Value > key){
            deck[j+1] = deck[j];
            j--;
        }
        deck[j+1] = keyCard;
    }
}

function Shuffle(deck)
{
	// for 1000 turns
	// switch the values of two random cards
	for (let i = 0; i < 500; i++)
	{
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

function Render_Deck(deck){
    console.log("Enter rendering");
    // removes previous iterations of hand if there are any
    var list = document.getElementsByClassName("card");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);

    let deckID = document.getElementById("hand");

    for(let i = 0 ; i < deck.length; i++){
        let card = document.createElement("div");
        let type = document.createElement("div");
        var icon = '';
		if (deck[i].Suit == 'bamboos')
		icon='&#126992;';
		else if (deck[i].Suit == 'circles')
		icon = '&#127001;';
		else if (deck[i].Suit == 'characters')
		icon = '&#126983;';
		else if(deck[i].Suit == 'dragons')
		icon = '&#126981;';
        else if(deck[i].Suit == 'winds')
		icon = '&#126976;';

		card.innerHTML = deck[i].Value + '<br/><br/>';
		card.className = 'card';
        type.className = 'type';
        type.innerHTML = icon;

        

        card.appendChild(type);
        deckID.appendChild(card);
        
        card.addEventListener('click', (event) => {
            if(isDiscard){
                onClickFunction(deck[i], i);

            }else{
                if(deficiencyNum == 0){
                    ChatBox("MAHJONG!! Why you trying to discard???");
                }else{
                    ChatBox("[Not ready to discard yet]");
                }
            }
          });

        card.addEventListener('mouseover', function handleMouseOver() {
            card.style.cursor = "pointer";
        });
    }

}

function onClickFunction(card, i){
    discard_deck.push(card);
    ChatBox("[Player] discarded: " + card.Value + " " + card.Suit);

    playerDeck.splice(i, 1);
    playerDeck = Sort(playerDeck);
    Render_Deck(playerDeck);
    isDiscard = false;
}

function CalculateDef(){
    isCalculatedDN = true;
    CalculateDeficiencyNumber(Sort(playerDeck));
    ChatBox("Deficiency number of " + deficiencyNum);
}

function Render_Stats(defNum){
    // removes all elements with classnames
    var list = document.getElementsByClassName("stats");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);

    let stat = document.getElementById("stats");

    let inputDefNum = document.createElement("p");
    inputDefNum.className = "stats";
    let button = document.createElement("button");
    button.innerHTML="?";
    button.style.backgroundColor = "#A491D3"
    button.addEventListener('mouseover', function handleMouseOver() {
        button.style.backgroundColor = '#a491d3d3';
        button.style.cursor = "pointer";
    });
    
    // 👇️ Change text color back on mouseout
    button.addEventListener('mouseout', function handleMouseOut() {
        button.style.backgroundColor = '#A491D3';
    });

    button.addEventListener('click', (event) => {
        ChatBox("Deficiency number is a number that determines how close you are to 'Mahjong'. The lower the deficiency number, the better. DN of 0 = MAHJONG!")
    });
    
    // Make user click DN calculations to update number
    if(!isCalculatedDN && !isMahjong){
        inputDefNum.innerHTML = " Deficiency number: ?";
    }else{
        inputDefNum.innerHTML = " Deficiency number: " + defNum;
    }

    inputDefNum.insertBefore(button, inputDefNum.firstChild);

    stat.appendChild(inputDefNum);
}

function CalculateDeficiencyNumber(deck){
    let tempBam = new Array();
    let tempCir = new Array();
    let tempMan = new Array();
    let tempDra = new Array();
    let tempWin = new Array();

    pairs = 0;

    // input cards into respective arrays
    for(let i = 0 ; i < deck.length; i++){
		if (deck[i].Suit == 'bamboos')
		    tempBam.push(deck[i]);
		else if (deck[i].Suit == 'circles')
		    tempCir.push(deck[i]);
		else if (deck[i].Suit == 'characters')
            tempMan.push(deck[i]);
		else if(deck[i].Suit == 'dragons')
		    tempDra.push(deck[i]);
        else if(deck[i].Suit == 'winds')
		    tempWin.push(deck[i]);
    }

    let bNum = DeficiencyNumber(tempBam);
    let cNum = DeficiencyNumber(tempCir);
    let mNum = DeficiencyNumber(tempMan);
    let dNum = PairsDeficiencyNumber(tempDra);
    let wNum = PairsDeficiencyNumber(tempWin);

    let defNum = bNum+cNum+mNum+dNum+wNum;
    console.log("Total DN score before pairs added: " + defNum);
    console.log("Total pairs: " + pairs);
    // calculate defNum;
    if(pairs > 1){
        defNum = defNum + (pairs-1);
    }

    deficiencyNum = defNum;

    if(deficiencyNum == 0){
        isMahjong = true;
    }

    console.log("defNum: " + defNum);
    Render_Stats(deficiencyNum);
}


function DeficiencyNumber(deck){
    let tempDeck = new Array();
    tempDeck = deck;
    let completedDeck = new Array();
    let uncompletedDeck = new Array();

    let defNum = 0;

    try {
        while(tempDeck.length > 0){
            let firstNum = 0, secondNum = 0, thirdNum = 0;
            let firstCard, secondCard, thirdCard;

            if(firstNum + 1 < tempDeck.length){
                secondNum = firstNum +  1;
                if(firstNum+2 < tempDeck.length){
                    thirdNum = firstNum + 2;

                    // compare 1-3 cards here
                    firstCard = tempDeck[firstNum];
                    secondCard = tempDeck[secondNum];
                    thirdCard = tempDeck[thirdNum];

                    if(secondCard.Value-firstCard.Value == 0){
                        if(thirdCard.Value-secondCard.Value == 0){
                            // a 3ofakind
                            completedDeck.push(firstCard);completedDeck.push(secondCard);completedDeck.push(thirdCard);
                            tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }else if(thirdCard.Value-secondCard.Value == 1){
                            // check for 3 potential pairs for a potential 2 confirm sequences
                             //check fourthCard 
                             let fourthCard;
                             if(firstNum+3 < deck.length){
                                 fourthCard = tempDeck[firstNum+3];
                                 if(fourthCard.Value-thirdCard.Value == 0){
                                     // a confirmed 2 pair
 
                                     //check 5th and 6th cards for potential 2 confirm sequence
                                     let fiveCard, sixCard;
                                     if(firstNum + 4 < deck.length && firstNum + 5 < deck.length){
                                         fiveCard = tempDeck[firstNum+4];
                                         sixCard = tempDeck[firstNum+5];
 
                                         if(fiveCard.Value-fourthCard.Value == 1 && sixCard.Value-fiveCard.Value == 0){
                                             // a confirmed 2 sequence with 1-6 cards
                                             completedDeck.push(sixCard);completedDeck.push(fiveCard);completedDeck.push(fourthCard);completedDeck.push(thirdCard);completedDeck.push(secondCard);completedDeck.push(firstCard);
                                             tempDeck.splice(firstNum+5,1);tempDeck.splice(firstNum+4,1);tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            continue;
                                            }
                                     }

                                     // check for 1 pair and 1 potential sequence
                                     if(firstNum+4 < deck.length){
                                        fiveCard = tempDeck[firstNum+4];
                                        if(fiveCard.Value-fourthCard.Value == 0){
                                            // confirmed sequence with 1 pair
                                            completedDeck.push(sixCard);completedDeck.push(fiveCard);completedDeck.push(fourthCard);completedDeck.push(thirdCard);
                                            tempDeck.splice(firstNum+5,1);tempDeck.splice(firstNum+4,1);tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);

                                            if(pairs == 0){
                                                pairs++;
                                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            }else{
                                                pairs++;
                                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            }
                                            continue;
                                        }
                                     }
                                     // only 2 confirmed pairs
                                     pairs += 2;
                                     uncompletedDeck.push(fourthCard);uncompletedDeck.push(thirdCard);uncompletedDeck.push(secondCard);uncompletedDeck.push(firstCard);
                                     tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                     continue;
                                 }
                             }
 
                             // only 1 confirmed pair
                             if(pairs == 0){
                                 pairs++;
                                 completedDeck.push(firstCard);completedDeck.push(secondCard);
                                 tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                             }else{
                                 pairs++;
                                 uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                 tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                             }
                            // 1 pair & +1 DN
                            if(pairs == 0){
                                pairs++;
                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }else{
                                pairs++;
                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }
                        }else{
                            if(pairs == 0){
                                pairs++;
                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }else{
                                pairs++;
                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }
                            
                        }
                    }else if(secondCard.Value-firstCard.Value == 1){
                        if(thirdCard.Value-secondCard.Value == 1){
                            // a confirmed sequence
                            completedDeck.push(firstCard);completedDeck.push(secondCard);completedDeck.push(thirdCard);
                            tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }else if(thirdCard.Value-secondCard.Value == 0){
                            //check fourthCard 
                            let fourthCard;
                            if(firstNum+3 < deck.length){
                                fourthCard = tempDeck[firstNum+3];
                                if(fourthCard.Value-thirdCard.Value == 0){
                                    // a confirmed 3ofakind
                                    completedDeck.push(fourthCard);completedDeck.push(thirdCard);completedDeck.push(secondCard);
                                    tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);
                                    continue;
                                }else if(fourthCard.Value-thirdCard.Value == 1){
                                    // a confirmed sequence
                                    completedDeck.push(fourthCard);completedDeck.push(thirdCard);completedDeck.push(firstCard);
                                    tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(firstNum,1);
                                    continue;
                                }
                            }

                            if(pairs == 0){
                                pairs++;
                                completedDeck.push(thirdCard);completedDeck.push(secondCard);
                                tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);
                            }else{
                                pairs++;
                                completedDeck.push(thirdCard);completedDeck.push(secondCard);
                                tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);
                            }
                        }else{
                            // 1 2 4 -> 1 2 = incomplete / 4 undecided.
                            uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            defNum = defNum + 1;
                        }
                    }else if(secondCard.Value-firstCard.Value == 2){
                        // 1 3 6 ->
                        if(thirdCard.Value-secondCard.Value > 2){
                            uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            defNum = defNum + 1;
                        //}else if(thirdCard.Value-secondCard.Value == 1){
                            // 1 3 4 4
                        }else{
                            // 
                            uncompletedDeck.push(firstCard);
                            tempDeck.splice(firstNum,1);
                            defNum = defNum + 1;
                        }
                    }else{
                        uncompletedDeck.push(firstCard);
                        tempDeck.splice(firstNum,1);
                        defNum = defNum + 1;
                    }

                }else{
                    // no thirdCard here
                    firstCard = tempDeck[firstNum];
                    secondCard = tempDeck[secondNum];

                    if(secondCard.Value-firstCard.Value==0){
                        if(pairs == 0){
                            pairs++;
                            completedDeck.push(secondCard);completedDeck.push(firstCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }else{
                            pairs++;
                            uncompletedDeck.push(secondCard);uncompletedDeck.push(firstCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }
                        
                    }else if(secondCard.Value-firstCard.Value <= 2){
                        uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                        tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        defNum = defNum + 1;
                    }else{
                        // 1 5
                        uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                        tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        defNum = defNum + 2;
                    }
                }
            }else{
                // only 1 card remaining
                firstCard = tempDeck[firstNum];
                uncompletedDeck.push(firstCard);
                tempDeck.splice(firstNum,1);
                defNum = defNum + 1;
            }
        }
    } catch (error) {
        console.log(error);
    }

    console.log("Num: " + defNum);
    console.log(completedDeck);
    console.log(uncompletedDeck);
    return defNum;
}

function PairsDeficiencyNumber(deck){
    let tempDeck = new Array();
    tempDeck = deck;
    let completedDeck = new Array();
    let uncompletedDeck = new Array();

    let defNum = 0;

    try {
        while(tempDeck.length > 0){
            let firstNum = 0, secondNum = 0, thirdNum = 0;
            let firstCard, secondCard, thirdCard;

            if(firstNum + 1 < tempDeck.length){
                secondNum = firstNum +  1;
                if(firstNum+2 < tempDeck.length){
                    thirdNum = firstNum + 2;

                    // compare 1-3 cards here
                    firstCard = tempDeck[firstNum];
                    secondCard = tempDeck[secondNum];
                    thirdCard = tempDeck[thirdNum];
                    
                    if(secondCard.Value.localeCompare(firstCard.Value) == 0){
                        if(thirdCard.Value.localeCompare(secondCard.Value) == 0){
                            // a 3ofakind
                            completedDeck.push(firstCard);completedDeck.push(secondCard);completedDeck.push(thirdCard);
                            tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }else if(thirdCard.Value.localeCompare(secondCard.Value) == 1){
                            // 1 1 2 // potential 2 pair
                            //check fourthCard 
                            let fourthCard;
                            if(firstNum+3 < deck.length){
                                fourthCard = tempDeck[firstNum+3];
                                if(fourthCard.Value-thirdCard.Value == 0){
                                    // a confirmed 2 pair

                                    //check 5th and 6th cards for potential 2 confirm sequence
                                    let fiveCard, sixCard;
                                    if(firstNum + 4 < deck.length && firstNum + 5 < deck.length){
                                        fiveCard = tempDeck[firstNum+4];
                                        sixCard = tempDeck[firstNum+5];

                                        if(fiveCard.Value-fourthCard.Value == 1 && sixCard.Value-fiveCard.Value == 0){
                                            // a confirmed 2 sequence with 1-6 cards
                                            completedDeck.push(sixCard);completedDeck.push(fiveCard);completedDeck.push(fourthCard);completedDeck.push(thirdCard);completedDeck.push(secondCard);completedDeck.push(firstCard);
                                            tempDeck.splice(firstNum+5,1);tempDeck.splice(firstNum+4,1);tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            continue;
                                        }
                                    }
                                    // check for 1 pair and 1 potential sequence
                                    if(firstNum+4 < deck.length){
                                        fiveCard = tempDeck[firstNum+4];
                                        if(fiveCard.Value-fourthCard.Value == 0){
                                            // confirmed sequence with 1 pair
                                            completedDeck.push(sixCard);completedDeck.push(fiveCard);completedDeck.push(fourthCard);completedDeck.push(thirdCard);
                                            tempDeck.splice(firstNum+5,1);tempDeck.splice(firstNum+4,1);tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);

                                            if(pairs == 0){
                                                pairs++;
                                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            }else{
                                                pairs++;
                                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                            }
                                            continue;
                                        }
                                     }
                                    // only 2 confirmed pairs
                                    pairs += 2;
                                    uncompletedDeck.push(fourthCard);uncompletedDeck.push(thirdCard);uncompletedDeck.push(secondCard);uncompletedDeck.push(firstCard);
                                    tempDeck.splice(firstNum+3,1);tempDeck.splice(thirdNum,1);tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                                    continue;
                                }
                            }

                            // only 1 confirmed pair
                            if(pairs == 0){
                                pairs++;
                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }else{
                                pairs++;
                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }
                        }else{
                            if(pairs == 0){
                                pairs++;
                                completedDeck.push(firstCard);completedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }else{
                                pairs++;
                                uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                                tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                            }
                            
                        }
                    }else{
                        uncompletedDeck.push(firstCard);
                        tempDeck.splice(firstNum,1);
                        defNum = defNum + 1;
                    }

                }else{
                    // no thirdCard here
                    firstCard = tempDeck[firstNum];
                    secondCard = tempDeck[secondNum];

                    if(secondCard.Value.localeCompare(firstCard.Value)==0){
                        if(pairs == 0){
                            pairs++;
                            completedDeck.push(secondCard);completedDeck.push(firstCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }else{
                            pairs++;
                            uncompletedDeck.push(secondCard);uncompletedDeck.push(firstCard);
                            tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        }
                    }else{
                        // 1 5
                        uncompletedDeck.push(firstCard);uncompletedDeck.push(secondCard);
                        tempDeck.splice(secondNum,1);tempDeck.splice(firstNum,1);
                        defNum = defNum + 2;
                    }
                }
            }else{
                // only 1 card remaining
                firstCard = tempDeck[firstNum];
                uncompletedDeck.push(firstCard);
                tempDeck.splice(firstNum,1);
                defNum = defNum + 1;
            }
        }
    } catch (error) {
        console.log(error);
    }

    console.log("Num: " + defNum);
    console.log(completedDeck);
    console.log(uncompletedDeck);
    return defNum;
}

/*
    Chatbox for inputting text messages for player to see
        Max of 6 messages on screen
*/

function ChatBox(message){
    let textHTML = document.getElementById("texts");
    // removes all elements with classnames
    var list = document.getElementsByClassName("history");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);
    // display messages

    messages.push(message);
    
    if(messages.length >= 7){
        for(let i = messages.length-1; i >= 7; i--){
            console.log("Delete: " + messages[0]);
            messages.splice(0,1);
        }
    }

    for(let i = 0; i < messages.length; i++){
        if(i == messages.length-1){
            let p = document.createElement("p");
            p.innerHTML = messages[i];
            p.style.color = "#F9DAD0";
            p.className = "history";
            textHTML.appendChild(p);
            
        }else{
            let p = document.createElement("p");
            p.innerHTML = messages[i];
            p.className = "history";
            textHTML.appendChild(p);
        }
        
    }

}