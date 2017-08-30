import {ReturnType} from './returnType';
import {ParamType} from './paramType';

export interface Method {
    name: string;
    description?: string;
    returns?: ReturnType;
    params?: ParamType[];
}

