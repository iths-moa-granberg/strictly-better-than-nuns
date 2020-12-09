import { ReactComponent as Bottom } from './bottom-path-ending.svg';
import { ReactComponent as Top } from './top-path-ending.svg';
import { ReactComponent as Middle } from './middle-path-ending.svg';
import { ReactComponent as Left } from './left-path-ending.svg';
import { ReactComponent as Right } from './right-path-ending.svg';

interface PathEndingComponents {
  readonly [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const PathEndings: PathEndingComponents = {
  Bottom,
  Top,
  Middle,
  Left,
  Right,
};

export default PathEndings;
