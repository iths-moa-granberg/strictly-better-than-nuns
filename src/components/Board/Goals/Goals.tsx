import React from 'react';
import { MyPlayer } from '../../../clientTypes';
import { ClientPlayer } from '../../../modules/player';
import goals from '../../../shared/goals';

interface GoalsProps {
  myPlayer: MyPlayer;
  viewAll: boolean;
}

interface GoalProps {
  x: number;
  y: number;
}

const Goals = ({ myPlayer, viewAll }: GoalsProps) => {
  if (viewAll) {
    return (
      <>
        <article className="goalWrapper">
          {goals.map((goal) => (
            <Goal x={goal.x} y={goal.y} key={goal.id} />
          ))}
        </article>
      </>
    );
  }

  if (myPlayer.isEvil || (myPlayer as ClientPlayer).hasGoal) {
    return <></>;
  }

  const goal = goals.find((k) => k.id === (myPlayer as ClientPlayer).goal.id)!;
  return (
    <article className="goalWrapper">
      <Goal x={goal.x} y={goal.y} />
    </article>
  );
};

const Goal = ({ x, y }: GoalProps) => {
  return (
    <img
      src={require('../../../assets/goal.svg')}
      alt="goal"
      style={{ position: 'absolute', top: `${y * (856 / 900)}vh`, left: `${x * (856 / 900)}vh` }}
    />
  );
};

export default Goals;
