import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import UFDao from "../dao/UFDao";
import UFVo from "../vo/UFVo";

class UFBe extends AbstractBe {
  private ufDao: UFDao = new UFDao(this.conexao);

  constructor(conexao: any) {
    super(conexao);
  }

  public async incluirUF(ufVo: UFVo) {
    this.validarCampos(ufVo, "incluir UF", false);
    await this.verificarSeExisteUF(ufVo, "incluir", "UF");
    await this.ufDao.incluirUF(ufVo);
    let registros = await this.ufDao.pesquisarUF(new UFVo());
    return registros;
  }

  public async alterarUF(ufVo: UFVo) {
    this.validarCampos(ufVo, "alterar UF", true);
    await this.verificarSeExisteUF(ufVo, "alterar", "UF");
    await this.ufDao.alterarUF(ufVo);
    let registros = await this.ufDao.pesquisarUF(new UFVo());
    return registros;
  }

  public async verificarSeExisteUF(ufVo: UFVo, acao: string, modulo: string) {
    let ufVoFiltroPesquisa = new UFVo();
    ufVoFiltroPesquisa.nome = ufVo.nome;
    let registros = await this.ufDao.pesquisarUF(ufVoFiltroPesquisa);
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoUF != ufVo.codigoUF) ||
        (registros.codigoUF != undefined &&
          registros.codigoUF > 0 &&
          registros.codigoUF != ufVo.codigoUF))
    ) {
      throw new RegistroJaExisteError(acao, modulo, "o nome " + ufVo.nome, 404);
    }
    ufVoFiltroPesquisa = new UFVo();
    ufVoFiltroPesquisa.sigla = ufVo.sigla;
    registros = await this.ufDao.pesquisarUF(ufVoFiltroPesquisa);
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoUF != ufVo.codigoUF) ||
        (registros.codigoUF != undefined &&
          registros.codigoUF > 0 &&
          registros.codigoUF != ufVo.codigoUF))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "a sigla " + ufVo.sigla,
        404
      );
    }
  }

  public async pesquisarUF(ufVoFiltroPesquisa: UFVo) {
    let registros = await this.ufDao.pesquisarUF(ufVoFiltroPesquisa);
    if (
      registros.codigoUF != undefined &&
      ufVoFiltroPesquisa.codigoUF == 0 &&
      ufVoFiltroPesquisa.nome == "" &&
      ufVoFiltroPesquisa.sigla == ""
    ) {
      //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
      let lista = [];
      lista.push(registros);
      registros = lista;
    }
    return registros;
  }
  public async deletarUF(codigoUF: number) {
    await this.ufDao.deletarUF(codigoUF);
    let registros = await this.ufDao.pesquisarUF(new UFVo());
    return registros;
  }

  private validarCampos(ufVo: UFVo, acao: string, alteracao: boolean) {
    if (ufVo == null || ufVo == undefined) {
      throw new CampoObrigatorioError(acao, "o JSON ");
    }
    if (
      ufVo.sigla == undefined ||
      ufVo.sigla == null ||
      ufVo.sigla.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "sigla");
    }
    if (ufVo.nome == undefined || ufVo.nome == null || ufVo.nome.trim() == "") {
      throw new CampoObrigatorioError(acao, "nome");
    }
    if (ufVo.status == undefined || ufVo.status == null || ufVo.status < 1) {
      throw new CampoObrigatorioError(acao, "status");
    }
    if (
      alteracao &&
      (ufVo.codigoUF == undefined || ufVo.codigoUF == null || ufVo.codigoUF < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigoUF");
    }
  }
}

export default UFBe;
