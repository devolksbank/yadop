import {Yadop} from "./yadop";
import {AttributeType} from "./attributeType";

export interface Method extends Yadop {
    params?: AttributeType[];
    returns?: AttributeType;
}

