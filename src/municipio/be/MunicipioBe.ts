import AbstractBe from "../../framework/be/AbstractBe";
import CampoObrigatorioError from "../../framework/exceptions/CampoObrigatorioError";
import RegistroJaExisteError from "../../framework/exceptions/RegistroJaExisteError";
import MunicipioDao from "../dao/MunicipioDao";
import MunicipioVo from "../vo/MunicipioVo";

class MunicipioBe extends AbstractBe {
  private MunicipioDao: MunicipioDao = new MunicipioDao(this.conexao);

  constructor(conexao: any) {
    super(conexao);
  }

  public async incluirMunicipio(municipioVo: MunicipioVo) {
    this.validarCampos(municipioVo, "incluir municipio", false);
    await this.verificarSeExisteMunicipio(municipioVo, "incluir", "municipio");
    await this.MunicipioDao.incluirMunicipio(municipioVo);
    let registros = await this.MunicipioDao.pesquisarMunicipio(
      new MunicipioVo()
    );
    return registros;
  }

  public async alterarMunicipio(municipioVo: MunicipioVo) {
    this.validarCampos(municipioVo, "alterar municipio", true);
    await this.verificarSeExisteMunicipio(municipioVo, "alterar", "municipio");
    await this.MunicipioDao.alterarMunicipio(municipioVo);
    let registros = await this.MunicipioDao.pesquisarMunicipio(
      new MunicipioVo()
    );
    return registros;
  }

  public async verificarSeExisteMunicipio(
    municipioVo: MunicipioVo,
    acao: string,
    modulo: string
  ) {
    let municipioVoFiltroPesquisa = new MunicipioVo();
    municipioVoFiltroPesquisa.nome = municipioVo.nome;
    municipioVoFiltroPesquisa.codigoUF = municipioVo.codigoUF;
    let registros = await this.MunicipioDao.pesquisarMunicipio(
      municipioVoFiltroPesquisa
    );
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigoMunicipio != municipioVo.codigoMunicipio) ||
        (registros.codigoMunicipio != undefined &&
          registros.codigoMunicipio > 0 &&
          registros.codigoMunicipio != municipioVo.codigoMunicipio))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "o nome " + municipioVo.nome,
        404
      );
    }
    municipioVoFiltroPesquisa = new MunicipioVo();
    municipioVoFiltroPesquisa.codigoMunicipio = municipioVo.codigoMunicipio;
    registros = await this.MunicipioDao.pesquisarMunicipio(
      municipioVoFiltroPesquisa
    );
    if (
      registros != undefined &&
      ((registros.length != undefined &&
        registros.length > 0 &&
        registros[0].codigomunicipio != municipioVo.codigoMunicipio) ||
        (registros.codigomunicipio != undefined &&
          registros.codigomunicipio > 0 &&
          registros.codigomunicipio != municipioVo.codigoMunicipio))
    ) {
      throw new RegistroJaExisteError(
        acao,
        modulo,
        "a sigla " + municipioVo.codigoMunicipio,
        404
      );
    }
  }

  public async pesquisarMunicipio(municipioVoFiltroPesquisa: MunicipioVo) {
    let registros = await this.MunicipioDao.pesquisarMunicipio(
      municipioVoFiltroPesquisa
    );
    if (
      municipioVoFiltroPesquisa.codigoMunicipio == undefined ||
      municipioVoFiltroPesquisa.codigoMunicipio == 0
    ) {
      //REGRA: ADICIONAR EM UMA LISTA SE A PESQUISA NÃO POR PELA PK
      let lista = [];
      lista.push(registros);
      registros = lista;
    }
    return registros;
  }
  public async deletarMunicipio(codigoMunicipio: number) {
    await this.MunicipioDao.deletarMunicipio(codigoMunicipio);
    let registros = await this.MunicipioDao.pesquisarMunicipio(
      new MunicipioVo()
    );
    return registros;
  }

  private validarCampos(
    municipioVo: MunicipioVo,
    acao: string,
    alteracao: boolean
  ) {
    if (municipioVo == null || municipioVo == undefined) {
      throw new CampoObrigatorioError(acao, "o JSON ");
    }
    if (
      municipioVo.nome == undefined ||
      municipioVo.nome == null ||
      municipioVo.nome.trim() == ""
    ) {
      throw new CampoObrigatorioError(acao, "nome");
    }
    if (
      municipioVo.status == undefined ||
      municipioVo.status == null ||
      municipioVo.status < 1
    ) {
      throw new CampoObrigatorioError(acao, "status");
    }
    if (
      alteracao &&
      (municipioVo.codigoMunicipio == undefined ||
        municipioVo.codigoMunicipio == null ||
        municipioVo.codigoMunicipio < 1)
    ) {
      throw new CampoObrigatorioError(acao, "codigomunicipio");
    }
  }
}

export default MunicipioBe;
