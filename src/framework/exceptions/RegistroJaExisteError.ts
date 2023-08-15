import AbstractError from "./AbstractError";

class RegistroJaExisteError extends AbstractError
{
    constructor(acao : string , modulo : string, textoDoCampoRepetido : string, status : number)
    {
        super("Não foi possível " + acao + " " + modulo + " no banco de dados.<br>Motivo: Já existe um(a) registro de " + modulo +" com "+ textoDoCampoRepetido + " cadastrado no banco de dados.", status, null);
    }
}

export default RegistroJaExisteError;