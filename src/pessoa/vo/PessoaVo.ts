import EnderecoVo from "../../endereco/vo/EnderecoVo";
class PessoaVo {
  public codigoPessoa: number = 0;
  public nome: string = "";
  public sobrenome: string = "";
  public idade: number = 0;
  public login: string = "";
  public senha: string = "";
  public status: number = 0;
  public enderecos: Array<EnderecoVo> = [];
}

export default PessoaVo;
