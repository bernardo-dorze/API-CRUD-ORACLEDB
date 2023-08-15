import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import EnderecoDao from "../dao/EnderecoDao";
import EnderecoVo from "../vo/EnderecoVo";

class EnderecoBe extends AbstractBe {
  private enderecoDao: EnderecoDao = new EnderecoDao(this.conexao);

  constructor(conexao: any) {
    super(conexao);
  }

  public async incluirEndereco(enderecoVo: EnderecoVo) {
    this.validarCampos(enderecoVo, "incluir Endereco", false);
    await this.verificarSeExisteEndereco(enderecoVo, "incluir", "Endereco");
    await this.enderecoDao.incluirEndereco(enderecoVo, enderecoVo.codigoPessoa);
    let registros = await this.enderecoDao.pesquisarEndereco(new EnderecoVo());
    return registros;
  }

  public async alterarEndereco(enderecoVo: EnderecoVo) {
    this.validarCampos(enderecoVo, "alterar Endereco", true);
    await this.verificarSeExisteEndereco(enderecoVo, "alterar", "Endereco");
    await this.enderecoDao.alterarEndereco(enderecoVo);
    let registros = await this.enderecoDao.pesquisarEndereco(new EnderecoVo());
    return registros;
  }

  public async verificarSeExisteEndereco(
    enderecoVo: EnderecoVo,
    acao: string,
    modulo: string
  ) {
    let enderecoVoFiltroPesquisa = new EnderecoVo();
    enderecoVoFiltroPesquisa.codigoPessoa = enderecoVo.codigoPessoa;
    enderecoVoFiltroPesquisa.codigoBairro = enderecoVo.codigoBairro;
    enderecoVoFiltroPesquisa.nomeRua = enderecoVo.nomeRua;
    enderecoVoFiltroPesquisa.numero = enderecoVo.numero;
    enderecoVoFiltroPesquisa.complemento = enderecoVo.complemento;
    enderecoVoFiltroPesquisa.cep = enderecoVo.cep;
    let registros = await this.enderecoDao.pesquisarEndereco(
      enderecoVoFiltroPesquisa
    );
    console.log(
      "total de registros encontrados na tabela endereço " + registros.length
    );

    if (registros != undefined) {
      if (registros.length > 0) {
        throw new RegistroJaExisteError(
          acao,
          modulo,
          "com os dados informados",
          404
        );
      }
    }
  }

  public async pesquisarEndereco(enderecoVoFiltroPesquisa: EnderecoVo) {
    let registros = await this.enderecoDao.pesquisarEndereco(
      enderecoVoFiltroPesquisa
    );
    console.log(registros);
    if (
      registros.codigoEndereco != undefined &&
      enderecoVoFiltroPesquisa.codigoEndereco == 0 &&
      registros.codigoPessoa != undefined &&
      enderecoVoFiltroPesquisa.codigoPessoa == 0 &&
      registros.codigoBairro != undefined &&
      enderecoVoFiltroPesquisa.codigoBairro == 0 &&
      enderecoVoFiltroPesquisa.nomeRua == "" &&
      enderecoVoFiltroPesquisa.numero == "" &&
      enderecoVoFiltroPesquisa.complemento == "" &&
      enderecoVoFiltroPesquisa.cep == ""
    ) {
      //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
      let lista = [];
      lista.push(registros);
      registros = lista;
    }
    return registros;
  }

  public async deletarEnderecosPorPessoa(codigoPessoa: number) {
    await this.enderecoDao.deletarEnderecosPorPessoa(codigoPessoa);
    let registros = await this.enderecoDao.pesquisarEndereco(new EnderecoVo());
    return registros;
  }

  private validarCampos(
    enderecoVo: EnderecoVo,
    acao: string,
    alteracao: boolean
  ) {
    if (enderecoVo == null || enderecoVo == undefined) {
      throw new CampoObrigatorioError(acao, "o JSON ");
    }
    if (
      alteracao &&
      (enderecoVo.codigoEndereco == undefined ||
        enderecoVo.codigoEndereco == null ||
        enderecoVo.codigoEndereco < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoEndereco");
    }
    if (
      alteracao &&
      (enderecoVo.codigoPessoa == undefined ||
        enderecoVo.codigoPessoa == null ||
        enderecoVo.codigoPessoa < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoPessoa");
    }
    if (
      alteracao &&
      (enderecoVo.codigoBairro == undefined ||
        enderecoVo.codigoBairro == null ||
        enderecoVo.codigoBairro < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoBairro");
    }
    if (
      enderecoVo.nomeRua == undefined ||
      enderecoVo.nomeRua == null ||
      enderecoVo.nomeRua.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "nomeRua");
    }
    if (
      enderecoVo.numero == undefined ||
      enderecoVo.numero == null ||
      enderecoVo.numero.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "numero");
    }
    if (
      enderecoVo.complemento == undefined ||
      enderecoVo.complemento == null ||
      enderecoVo.complemento.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "complemento");
    }
    if (
      enderecoVo.cep == undefined ||
      enderecoVo.cep == null ||
      enderecoVo.cep.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "cep");
    }
  }
}

export default EnderecoBe;
