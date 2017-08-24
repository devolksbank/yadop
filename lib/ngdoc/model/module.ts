import {Entity} from './entity';

export interface Module {
    name: string;
    entities?: Entity[];
}
