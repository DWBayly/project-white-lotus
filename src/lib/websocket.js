const environment = 'production';
// simple function to delay without blocking execution
const delayFunction = (ms, callback) => {
  return new Promise(() => {
    setTimeout(callback, ms);
  });
};


/**
 * makeInfoSpan - creates a new span element
 *
 * @param {string/number} value  any value to be input as the content of the span.
 * @param {string} infoName  A class name to be added to the span
 * @returns {object} HTML element  An HTML element representing the info span.
 */

const makeInfoSpan = (value, infoName) => {
  const infoSpan = document.createElement('span');
  infoSpan.classList.add(infoName);
  infoSpan.innerText = value;
  return infoSpan;
};

/**
 * animateCharacter - adds a class to a monster image in order to perform an animation
 *
 * @param {object} animation  The object represeting the animation information
 */
const animateCharacter = (animation, player) => {
  const {target, value, playerId} = animation;
  // find the appropriate image
  let prefix = 'opponent';
  let monsterImage = document.querySelector(`.opponent-side #m-${target.id} img`);
  if(playerId && playerId === player.id){
    prefix = 'player';
    monsterImage = document.querySelector(`.player-side #m-${target.id} img`);
  }
  // add the the class(value)
  monsterImage.classList.add(`${value}-${prefix}`);
  delayFunction(2000, () => {
    // remove the class after two seconds
    monsterImage.classList.remove(`${value}-${prefix}`);
  });
};

// Takes in the monster to target, the damage to write.
// Also takes a playerId and a player (optional). These are just used to determine if it's a DOT effect.
const printInfo = (infoCollection, infoName, player) => {
  let delay = 0;
  for(const messageId in infoCollection){
    const {target, value, playerId} = infoCollection[messageId];
    if(target){
      let monsterContainer = document.querySelector(`.opponent-side #m-${target.id}`);
      if(playerId && playerId === player.id){
        monsterContainer = document.querySelector(`.player-side #m-${target.id}`);
      }
      if(monsterContainer){
        // set the delay only if there is a info span to create
        delay = 500;
        const infoSpan = makeInfoSpan(value, infoName);
        monsterContainer.prepend(infoSpan);
        delayFunction(2000, () => {
          monsterContainer.removeChild(infoSpan);
        });
      }
    }
  }
  // At the end of it all, return the delay for other alert collections to use.
  return delay;
};


/**
 * collectMessages - takes all messages sent down and funnels them into their appropriate message objects
 *
 * @param {array} messages  An array of messages. These can be strings or objects.
 * @return {object}  An object of all the filled collections
 */
const collectMessages = (messages) => {
  // initialize collections
  const alertsCollection = {};
  const animationsCollection = {};
  const messagesCollection = [];
  messages.forEach(messageObject => {
    const {type, target, value, playerId, message} = messageObject;
    // If it's just a basic message, push it and return.
    if(!target){
      messagesCollection.unshift(messageObject);
      return;
    }
    if(type === 'animate'){
      const messageId = target.id + playerId;
      animationsCollection[messageId] = {
        target, value, playerId
      };
      return;
    }
    // Initialize the alert message collection if it doesn't already exist
    if(!alertsCollection[type]){
      alertsCollection[type] = {};
    }
    const messageCollection = alertsCollection[type];
    const messageId = target.id + playerId;
    if(messageCollection[messageId]){
      // If the message value is not a number, simply update the value of the message
      // Since some values are just going to be strings we don't want them concatenating.
      typeof value === 'number' ? messageCollection[messageId].value += value : messageCollection[messageId].value = value;
    } else {
      messageCollection[messageId] = {
        target, value, playerId
      };
    }
    // push the message to be displayed in the messages component
    messagesCollection.unshift(message);
  });
  return {alertsCollection, animationsCollection, messagesCollection};
};

const updateGame = (battleComponent) => {
  return (event) => {
    let player = null;
    let opponent = null;
    let messages = null;
    let game = null;
    // try block to make sure things don't break if something that isn't JSON is sent down.
    try{
      const gameData = JSON.parse(event.data);
      messages = gameData.messages;
      game = gameData.game;
    } catch(e) {
      console.log(e);
    }
    game.players.forEach(pc => {
      // Checks if there is no opponent already to add extra bug protection.
      if(pc.id !== battleComponent.state.battlerId && !opponent){
        opponent = pc;
      } else {
        player = pc;
      }
    });
    if(messages && messages.length > 0){
      // Collect all message types into the alerts collection.
      const {alertsCollection, animationsCollection, messagesCollection} = collectMessages(messages);
      messages = messagesCollection;
      let delay = 0;
      // animate characters
      for(const animationId in animationsCollection){
        const animation = animationsCollection[animationId];
        animateCharacter(animation, player);
      }
      // for each collection, print the info, delaying it as necessary
      for(const collectionName in alertsCollection){
        const alertCollection = alertsCollection[collectionName];
        if(!delay){
          delay = printInfo(alertCollection, collectionName, player);
          continue;
        }
        delayFunction(delay, () => {
          printInfo(alertCollection, collectionName, player);
        });
      }
    }
    battleComponent.setState({game, messages: messages || [], player, opponent});
  };
};

const rejoinBattle = (battleComponent) => {
  const {roomName} = battleComponent.props;
  let socket = null;
  if (environment === 'development') {
    socket = new WebSocket(`ws://localhost:3001/battles/${roomName}`);
  } else if (environment === 'production') {
    socket = new WebSocket(`wss://projectwhitelotus.herokuapp.com/battles/${roomName}`);
  }
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      messageType: 'rejoin',
      battlerId: battleComponent.state.battlerId,
    }));
  });
  socket.addEventListener('message', updateGame(battleComponent));
  return socket;
};

const joinGame = (battleComponent, team) => {
  const {roomName} = battleComponent.props;
  let socket = null;
  if (environment === 'development') {
    socket = new WebSocket(`ws://localhost:3001/battles/${roomName}`);
  } else if (environment === 'production') {
    socket = new WebSocket(`wss://projectwhitelotus.herokuapp.com/battles/${roomName}`);
  }
  // Joining the game
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      messageType: 'join',
      team,
      battlerId: battleComponent.state.battlerId,
      name: battleComponent.props.username
    }));
  });
  // When game updates are sent
  socket.addEventListener('message', updateGame(battleComponent));
  return socket;
};


export {joinGame, rejoinBattle};
