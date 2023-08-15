import AbstractError from "./AbstractError";

class AlterarError extends AbstractError
{
    constructor(modulo : String, motivo : string, status : number, causa : any)
    {
        super("Não foi possível alterar " + modulo +" no banco de dados.<br>Motivo: " + motivo, status, causa);
    }
}

export default AlterarError;