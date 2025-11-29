//
//  main.cpp
//  chessMaster
//
//  Created by Karan Mukhi on 08/04/2019.
//  Copyright © 2019 Karan Mukhi. All rights reserved.
//  Main program for a chess game program written in c++
//  Program welcomes and initialsises a game
//  Then lets users play a game of chess
//  After the game is concluded players are given the option to qutit or play again

#include <iostream>
#include <memory>
#include "game.hpp"
using namespace std;

void printTitle(){
    std::cout << R"(
 __        __   _                            _          
 \ \      / /__| | ___ ___  _ __ ___   ___  | |_ ___    
  \ \ /\ / / _ \ |/ __/ _ \| '_ ` _ \ / _ \ | __/ _ \   
   \ V  V /  __/ | (_| (_) | | | | | |  __/ | || (_) |  
    \_/\_/ \___|_|\___\___/|_| |_| |_|\___|  \__\___/   
                                                        
   ____ _                   
  / ___| |__   ___  ___ ___ 
 | |   | '_ \ / _ \/ __/ __|
 | |___| | | |  __/\__ \__ \
  \____|_| |_|\___||___/___/
)" << std::endl;
}

int main() {
    
    printTitle();
    string input;
    while(true){
        game chess;
        chess.play();
        cout << "Would you like to play again?\n";
        std::getline(std::cin, input);
        if(!(input[0] == 'y' || input[0] =='Y')) break;
    }
    cout << "Goodbye\n";
    
    return 0;
}


