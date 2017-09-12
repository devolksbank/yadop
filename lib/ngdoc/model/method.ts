import {ReturnType} from './returnType';
import {ParamType} from './paramType';

export interface Method {
    name: string;
    description?: string;
    deprecated: boolean;
    returns?: ReturnType;
    params?: ParamType[];
}

