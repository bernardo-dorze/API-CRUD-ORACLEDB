class AbstractError extends Error
{
    public mensagem : string = "";
    public status : number = 0;

    constructor(mensagem : string, status : number, causa : any)
    {
        super((causa != null ? causa.message : "SEM DETALHES"));
        console.log(causa);
        this.mensagem = mensagem;
        this.status = status;
    }
}

export default AbstractError;