import React from "react";
import ReactDOM from "react-dom";
import GameTemp from "./gametemp";

window.addEventListener("load", function() {
    
    let el = document.createElement("div");
    let containerIdClass = "game-container";
    el.id = containerIdClass;
    el.classList.add("container-fluid");
    let body = document.querySelector("body");
    body.appendChild(el);
    
    ReactDOM.render(<GameTemp />, document.getElementById(containerIdClass));
});