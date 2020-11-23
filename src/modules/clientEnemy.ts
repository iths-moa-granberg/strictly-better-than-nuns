import { Position } from '../shared/sharedTypes';

interface ClientEnemy {
  id: string;
  position: Position;
  isEvil: boolean;
}

class ClientEnemy {
  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
    this.isEvil = true;
  }
}

export default ClientEnemy;
