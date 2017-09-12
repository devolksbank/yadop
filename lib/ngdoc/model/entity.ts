import {Method} from './method';
import {AttributeType} from './attributeType';

export interface Entity {
    attributes?: AttributeType[];
    name: string;
    deprecated?: string;
    description?: string;
    methods?: Method[];
    requires: string[];
    type: string;
}
