import { ChatMessage, ProgressLogObject } from '../../src/shared/sharedTypes';
import Player from './serverPlayer';

export const formatProgressLogObjects = (enemyUsername: string, players: Player[], msg: ChatMessage) => {
  let username = '';
  if (msg.id === 'e1') {
    username = enemyUsername;
  } else {
    const user = players.find((player) => player.id === msg.id);
    if (user) {
      username = user.username;
    }
  }

  const messages: ProgressLogObject[] = [{ text: `${username}: `, id: msg.id }, { text: msg.text }];
  return messages;
};
