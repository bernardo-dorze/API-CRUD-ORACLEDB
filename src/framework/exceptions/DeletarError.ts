import AbstractError from "./AbstractError";

class DeletarError extends AbstractError
{
    constructor(modulo : String, motivo : string, status : number, causa : any)
    {
        super("Não foi possível deletar " + modulo +" no banco de dados.<br>Motivo: " + motivo, status, causa);
    }
}

export default DeletarError;