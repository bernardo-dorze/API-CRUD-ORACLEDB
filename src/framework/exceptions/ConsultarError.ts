import AbstractError from "./AbstractError";

class ConsultarError extends AbstractError
{
    constructor(modulo : String, motivo : string, status : number, causa : any)
    {
        super("Não foi possível consultar " + modulo +" no banco de dados.<br>Motivo: " + motivo, status, causa);
    }
}

export default ConsultarError;