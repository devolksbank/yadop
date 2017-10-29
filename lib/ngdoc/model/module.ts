import {Entity} from './entity';
import {Yadop} from './yadop';

export interface Module extends Yadop {
    entities?: Entity[];
}
