import SequenceError from "../exceptions/SequenceError";

class AbstractDao
{
    protected conexao : any = null;

    constructor(conexao : any)
    {
        this.conexao = conexao;
    }
 
    protected async gerarSequence (nomeSequence : String)
    {
        try
        {
            console.log('Tentou gerar sequence: ' + nomeSequence);
            let sql = 'SELECT '+ nomeSequence + '.NEXTVAL AS CODIGO FROM DUAL';
            let resultado = await this.conexao.execute(sql);
            let sequence = resultado.rows[0][0];
            console.log('Gerou a sequence ' + sequence);
            return sequence;
        }
        catch(error)
        {
            throw new SequenceError(nomeSequence, error);
        }
    }

}

export default AbstractDao;