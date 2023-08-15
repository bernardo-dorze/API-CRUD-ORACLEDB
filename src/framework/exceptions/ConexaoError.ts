import AbstractError from "./AbstractError";

class ConexaoError extends AbstractError
{
    constructor(mensagem : string, status : number, causa : any)
    {
        super(mensagem, status, causa);
    }
}

export default ConexaoError;