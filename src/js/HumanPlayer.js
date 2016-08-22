import Player from "./player";
import { inherit } from "./utilities";

function HumanPlayer() {
    Player.call(this);
}

inherit(HumanPlayer, Player);

export default HumanPlayer;