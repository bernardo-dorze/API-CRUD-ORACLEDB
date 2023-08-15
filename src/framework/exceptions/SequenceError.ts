import AbstractError from "./AbstractError";

class SequenceError extends AbstractError
{
    constructor(nomeSequence : String, causa : any)
    {
        super("Não foi possível gerar a sequence: " + nomeSequence +".", 404, causa);
    }
}

export default SequenceError;