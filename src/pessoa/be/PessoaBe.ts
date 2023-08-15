import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import PessoaDao from "../dao/PessoaDao";
import PessoaVo from "../vo/PessoaVo";
import EnderecoBe from "../../endereco/be/EnderecoBe";
import EnderecoVo from "../../endereco/vo/EnderecoVo";

class PessoaBe extends AbstractBe {
  private pessoaDao: PessoaDao = new PessoaDao(this.conexao);
  private enderecoBe: EnderecoBe = new EnderecoBe(this.conexao);

  constructor(conexao: any) {
    super(conexao);
  }

  public async incluirPessoa(pessoaVo: PessoaVo) {
    this.validarCampos(pessoaVo, "incluir Pessoa", false);
    await this.verificarSeExistePessoa(pessoaVo, "incluir", "Pessoa");
    const sequence = await this.pessoaDao.incluirPessoa(pessoaVo);
    for (let i = 0; i < pessoaVo.enderecos.length; i++) {
      pessoaVo.enderecos[i].codigoPessoa = sequence;
      await this.enderecoBe.incluirEndereco(pessoaVo.enderecos[i]);
    }
    let registros = await this.pessoaDao.pesquisarPessoa(new PessoaVo());
    return registros;
  }

  public async alterarPessoa(pessoaVo: PessoaVo) {
    this.validarCampos(pessoaVo, "alterar Pessoa", true);
    await this.verificarSeExistePessoa(pessoaVo, "alterar", "Pessoa");
    await this.pessoaDao.alterarPessoa(pessoaVo);
    for (let i = 0; i < pessoaVo.enderecos.length; i++) {
      await this.enderecoBe.alterarEndereco(pessoaVo.enderecos[i]);
    }
    let registros = await this.pessoaDao.pesquisarPessoa(new PessoaVo());
    return registros;
  }

  public async verificarSeExistePessoa(
    pessoaVo: PessoaVo,
    acao: string,
    modulo: string
  ) {
    let pessoaVoFiltroPesquisa = new PessoaVo();
    pessoaVoFiltroPesquisa.nome = pessoaVo.nome;
    pessoaVoFiltroPesquisa.sobrenome = pessoaVo.sobrenome;
    let registros = await this.pessoaDao.pesquisarPessoa(
      pessoaVoFiltroPesquisa
    );
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoPessoa != pessoaVo.codigoPessoa) ||
        (registros.codigoPessoa != undefined &&
          registros.codigoPessoa > 0 &&
          registros.codigoPessoa != pessoaVo.codigoPessoa))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "o nome " + pessoaVo.nome + pessoaVo.sobrenome,
        404
      );
    }
    pessoaVoFiltroPesquisa = new PessoaVo();
    pessoaVoFiltroPesquisa.login = pessoaVo.login;
    registros = await this.pessoaDao.pesquisarPessoa(pessoaVoFiltroPesquisa);
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoPessoa != pessoaVo.codigoPessoa) ||
        (registros.codigoPessoa != undefined &&
          registros.codigoPessoa > 0 &&
          registros.codigoPessoa != pessoaVo.codigoPessoa))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "o login " + pessoaVo.login,
        404
      );
    }
  }

  public async pesquisarPessoa(pessoaVoFiltroPesquisa: PessoaVo) {
    let registros = await this.pessoaDao.pesquisarPessoa(
      pessoaVoFiltroPesquisa
    );
    // if (
    //   registros.codigoPessoa != undefined &&
    //   pessoaVoFiltroPesquisa.codigoPessoa == 0 &&
    //   pessoaVoFiltroPesquisa.nome == "" &&
    //   pessoaVoFiltroPesquisa.sobrenome == "" &&
    //   pessoaVoFiltroPesquisa.idade == 0 &&
    //   pessoaVoFiltroPesquisa.login == "" &&
    //   pessoaVoFiltroPesquisa.senha == "" &&
    //   pessoaVoFiltroPesquisa.status == 0
    // )
    if (registros.codigoPessoa == undefined || registros.codigoPessoa == 0) {
      //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
      let lista = [];
      lista.push(registros);
      registros = lista;

      for (let i = 0; i < registros.length; i++) {
        // await this.enderecoBe.incluirEndereco(pessoaVo.enderecos[i]);
        let enderecoVoFiltroPesquisa = new EnderecoVo();
        enderecoVoFiltroPesquisa.codigoPessoa = registros[i].codigoPessoa;
        let enderecos = await this.enderecoBe.pesquisarEndereco(
          enderecoVoFiltroPesquisa
        );
        registros[i].enderecos = enderecos;
      }
    } else {
      let enderecoVoFiltroPesquisa = new EnderecoVo();
      enderecoVoFiltroPesquisa.codigoPessoa = registros.codigoPessoa;
      let enderecos = await this.enderecoBe.pesquisarEndereco(
        enderecoVoFiltroPesquisa
      );
      registros.enderecos = enderecos;
    }
    return registros;
  }

  public async deletarPessoa(codigoPessoa: number) {
    await this.pessoaDao.deletarPessoa(codigoPessoa);
    await this.enderecoBe.deletarEnderecosPorPessoa(codigoPessoa);
    let registros = await this.pessoaDao.pesquisarPessoa(new PessoaVo());
    return registros;
  }

  private validarCampos(pessoaVo: PessoaVo, acao: string, alteracao: boolean) {
    if (pessoaVo == null || pessoaVo == undefined) {
      throw new CampoObrigatorioError(acao, "o JSON ");
    }
    if (
      pessoaVo.nome == undefined ||
      pessoaVo.nome == null ||
      pessoaVo.nome.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "nome");
    }
    if (
      pessoaVo.sobrenome == undefined ||
      pessoaVo.sobrenome == null ||
      pessoaVo.sobrenome.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "sobrenome");
    }
    if (
      pessoaVo.idade == undefined ||
      pessoaVo.idade == null ||
      pessoaVo.idade < 1
    ) {
      throw new CampoObrigatorioError(acao, "idade");
    }
    if (
      pessoaVo.login == undefined ||
      pessoaVo.login == null ||
      pessoaVo.login.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "login");
    }
    if (
      pessoaVo.senha == undefined ||
      pessoaVo.senha == null ||
      pessoaVo.senha.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "senha");
    }
    if (
      pessoaVo.status == undefined ||
      pessoaVo.status == null ||
      pessoaVo.status < 1
    ) {
      throw new CampoObrigatorioError(acao, "status");
    }
    if (
      alteracao &&
      (pessoaVo.codigoPessoa == undefined ||
        pessoaVo.codigoPessoa == null ||
        pessoaVo.codigoPessoa < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoPessoa");
    }
  }
}

export default PessoaBe;
