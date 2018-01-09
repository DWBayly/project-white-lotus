const generatePlayer = require('../lib/generate_player');
const Game = require('../lib/generate_game');

module.exports = (wss, id) => {
  // handles setting up the room
  const setupRoom = (room, playerInfo) => {
    room[`battle_${id}`] = {};
    let battle = room[`battle_${id}`];
    battle[playerInfo.battlerId] = room.clients[room.clients.length - 1];
    return generatePlayer(playerInfo.battlerId, playerInfo.team.split(','), playerInfo.name).then(player => {
      battle['players'] = [player];
    });
  };

  // once both players are in a room, this starts the game.
  const startGame = (battle, playerInfo, room) => {
    battle[playerInfo.battlerId] = room.clients[room.clients.length - 1];
    return generatePlayer(playerInfo.battlerId, playerInfo.team.split(','), playerInfo.name).then(player => {
      battle.players.push(player);
      return new Game(battle.players);
    });
  };

  // Executes action on behalf of client.
  const handleActions = (room, actionInfo) => {
    const {action} = actionInfo;
    if(!action){
      return;
    }
    return room.game.takeAction(actionInfo);
  };

  const socketFunctionality = (ws) => {
    const clients = wss.getWss(`/${id}`).clients;
    ws.broadcast = (data) => {
      clients.forEach(client => {
        // deep cloning object
        const copiedData = JSON.parse(JSON.stringify(data));
        const {game} = copiedData;
        // delete id so that player doesn't know opponent's info.
        for(let player of game.players){
          if(player.id !== client.id){
            delete player.id;
          }
        }
        // delete messages with ids that don't match the players?
        // If the client is ready for messages
        if(client.readyState === 1){
          client.send(JSON.stringify(copiedData));
        }
      });
    };

    ws.on('connection', (ws) => {
      // send a message to confirm connection
      ws.send(JSON.stringify({flash:'connected!'}));
    });
    ws.on('message', function(msg) {
      const room = wss.getWss(`/${id}`);
      const battle = room[`battle_${id}`];
      let parsedMsg = JSON.parse(msg);
      // Execute message logic depending on the type
      switch(parsedMsg.messageType) {
      case 'rejoin' : {
        if(battle && battle.game){
          const {battlerId} = parsedMsg;
          // @TODO loop over each player and see if this battlerId is, in fact, in the battle.

          // set the client id of the 'new' client. Since a new client is created for every connection
          room.clients.forEach((client) => {
            if(!client.id){
              client.id = battlerId;
            }
          });
          ws.broadcast({game:battle.game, messages:['Player rejoined']});
        }
        break;
      }
      case 'join': {
        // assign ids to clients.
        room.clients.forEach((client) => {
          if(!client.id) client.id = parsedMsg.battlerId;
        });
        if(!battle) {
          setupRoom(room, parsedMsg).catch(() => delete ws.battle);
        } else {
          startGame(battle, parsedMsg, room).then(game => {
            delete battle.players;
            battle.game = game;
            ws.broadcast({game: game, message:['Game started!']});
          });
        }
        break;
      }
      case 'action' : {
        const messages = handleActions(battle, parsedMsg);
        ws.broadcast({
          game: battle.game,
          messages: battle.game.gameOver ? ['Game is over!'] : messages
        });
        break;
      }
      default:
        ws.send(JSON.stringify({error: 'Invalid message'}));
      }
    });
  };

  return socketFunctionality;
};
