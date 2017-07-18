// d.ts file for espree.
// Only the bare minimal has been declared here.
declare namespace espree {
    interface Comment {
        value: string;
    }
    interface ParseOptions {
        comments: boolean;
        attachComment: boolean;
    }
    interface Ast {
        comments: Comment[];
    }
}

declare module 'espree' {
    export function parse(code: string | Buffer, options: any): espree.Ast;
}

export = espree;
