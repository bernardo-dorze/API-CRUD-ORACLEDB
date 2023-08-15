import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import BairroDao from "../dao/BairroDao";
import BairroVo from "../vo/BairroVo";

class BairroBe extends AbstractBe {
  private bairroDao: BairroDao = new BairroDao(this.conexao);

  constructor(conexao: any) {
    super(conexao);
  }

  public async incluirBairro(bairroVo: BairroVo) {
    this.validarCampos(bairroVo, "incluir Bairro", false);
    await this.verificarSeExisteBairro(bairroVo, "incluir", "Bairro");
    await this.bairroDao.incluirBairro(bairroVo);
    let registros = await this.bairroDao.pesquisarBairro(new BairroVo());
    return registros;
  }

  public async alterarBairro(bairroVo: BairroVo) {
    this.validarCampos(bairroVo, "alterar Bairro", true);
    await this.verificarSeExisteBairro(bairroVo, "alterar", "Bairro");
    await this.bairroDao.alterarBairro(bairroVo);
    let registros = await this.bairroDao.pesquisarBairro(new BairroVo());
    return registros;
  }

  public async verificarSeExisteBairro(
    bairroVo: BairroVo,
    acao: string,
    modulo: string
  ) {
    let bairroVoFiltroPesquisa = new BairroVo();
    bairroVoFiltroPesquisa.nome = bairroVo.nome;
    bairroVoFiltroPesquisa.codigoMunicipio = bairroVo.codigoMunicipio;
    let registros = await this.bairroDao.pesquisarBairro(
      bairroVoFiltroPesquisa
    );
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoBairro != bairroVo.codigoBairro) ||
        (registros.codigoBairro != undefined &&
          registros.codigoBairro > 0 &&
          registros.codigoBairro != bairroVo.codigoBairro))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "o nome " + bairroVo.nome,
        404
      );
    }
  }

  public async pesquisarBairro(bairroVoFiltroPesquisa: BairroVo) {
    let registros = await this.bairroDao.pesquisarBairro(
      bairroVoFiltroPesquisa
    );
    if (
      registros.codigoBairro != undefined &&
      bairroVoFiltroPesquisa.codigoBairro == 0 &&
      bairroVoFiltroPesquisa.nome == ""
    ) {
      //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
      let lista = [];
      lista.push(registros);
      registros = lista;
    }
    return registros;
  }
  public async deletarBairro(codigoBairro: number) {
    await this.bairroDao.deletarBairro(codigoBairro);
    let registros = await this.bairroDao.pesquisarBairro(new BairroVo());
    return registros;
  }

  private validarCampos(bairroVo: BairroVo, acao: string, alteracao: boolean) {
    if (bairroVo == null || bairroVo == undefined) {
      throw new CampoObrigatorioError(acao, "o JSON ");
    }
    if (
      bairroVo.nome == undefined ||
      bairroVo.nome == null ||
      bairroVo.nome.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "nome");
    }
    if (
      bairroVo.status == undefined ||
      bairroVo.status == null ||
      bairroVo.status < 1
    ) {
      throw new CampoObrigatorioError(acao, "status");
    }
    if (
      alteracao &&
      (bairroVo.codigoBairro == undefined ||
        bairroVo.codigoBairro == null ||
        bairroVo.codigoBairro < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoBairro");
    }
    if (
      alteracao &&
      (bairroVo.codigoMunicipio == undefined ||
        bairroVo.codigoMunicipio == null ||
        bairroVo.codigoMunicipio < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoMunicipio");
    }
  }
}

export default BairroBe;
