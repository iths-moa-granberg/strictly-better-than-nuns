import { ReactComponent as Home0 } from './home0.svg';
import { ReactComponent as Home1 } from './home1.svg';
import { ReactComponent as Home2 } from './home2.svg';
import { ReactComponent as Home3 } from './home3.svg';
import { ReactComponent as Home4 } from './home4.svg';
import { ReactComponent as Home5 } from './home5.svg';
import { ReactComponent as Home6 } from './home6.svg';

interface HomeComponents {
  readonly [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const Homes: HomeComponents = {
  Home0,
  Home1,
  Home2,
  Home3,
  Home4,
  Home5,
  Home6,
};

export default Homes;
