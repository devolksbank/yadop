import {Method} from './method';
import {AttributeType} from './attributeType';
import {Yadop} from "./yadop";

export interface Entity extends Yadop {
    type?: string;
    attributes?: AttributeType[];
    methods?: Method[];
    requires?: string[];
}
