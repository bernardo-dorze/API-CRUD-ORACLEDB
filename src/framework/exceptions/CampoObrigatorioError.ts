import AbstractError from "./AbstractError";

class CampoObrigatorioError extends AbstractError
{
    public nomeDoCampo : string = "";
    constructor(acao : String, nomeDoCampo : string)
    {
        super("Não foi possível " + acao +" no banco de dados.<br>Motivo: o campo " + nomeDoCampo + " é obrigatório.", 404, null);
        this.nomeDoCampo = nomeDoCampo;
    }
}

export default CampoObrigatorioError;