/** Configuration information that is necessary for the processor to process docs. */
interface Configuration {
    cwd?: string;
    pattern?: string;
    ignore?: string[];
}

export default Configuration;
