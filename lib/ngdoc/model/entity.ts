import {Method} from './method';
import {AttributeType} from './attributeType';

export interface Entity {
    name: string;
    description?: string;
    type?: string;
    methods?: Method[];
    attributes?: AttributeType[];
}
