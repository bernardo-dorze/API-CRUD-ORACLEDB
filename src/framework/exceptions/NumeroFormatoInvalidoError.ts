import AbstractError from "./AbstractError";

class NumeroFormatoInvalidoError extends AbstractError
{
    constructor(acao : string , modulo : string, nomeCampo : string, valorCampo : string, status : number)
    {
        super("Não foi possível " + acao + " " + modulo + " no banco de dados.<br>Motivo: O valor do campo " + nomeCampo +" precisa ser um número, e você passou '"+ valorCampo + "'.", status, null);
    }
}

export default NumeroFormatoInvalidoError;