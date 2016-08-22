import Player from "./player";
import { inherit } from "./utilities";

function AiPlayer() {
    Player.call(this);
}

inherit(AiPlayer, Player);

export default AiPlayer;