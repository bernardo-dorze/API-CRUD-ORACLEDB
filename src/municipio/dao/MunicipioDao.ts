import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import MunicipioVo from "../vo/MunicipioVo";

class MunicipioDao extends AbstractDao {
  public async incluirMunicipio(municipioVo: MunicipioVo) {
    let sequence = await this.gerarSequence("SEQUENCE_MUNICIPIO");
    try {
      municipioVo.codigoMunicipio = sequence;
      let sql =
        "INSERT INTO TB_Municipio (CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS) VALUES (:codigoMunicipio, :codigoUF, :nome, :status)";
      let resultado = await this.conexao.execute(sql, [
        municipioVo.codigoMunicipio,
        municipioVo.codigoUF,
        municipioVo.nome,
        municipioVo.status,
      ]);
      console.log(
        "Foram inseridos " +
          resultado.rowsAffected +
          " registros no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "municipio",
        "Erro ao inserir no banco de dados",
        404,
        error
      );
    }
  }

  public async alterarMunicipio(municipioVo: MunicipioVo) {
    let resultado = null;
    try {
      const sql =
        "UPDATE TB_MUNICIPIO SET CODIGO_UF = :codigoUF, NOME = :nome, STATUS = :status  WHERE CODIGO_MUNICIPIO = :codigoMunicipio";
      resultado = await this.conexao.execute(sql, [
        municipioVo.codigoUF,
        municipioVo.nome,
        municipioVo.status,
        municipioVo.codigoMunicipio,
      ]);
      console.log(
        "QUANTIDADE DE REGISTROS ALTERADOS (Municipios): " +
          resultado.rowsAffected
      );
      if (resultado.rowsAffected == 0) {
        throw new AlterarError(
          "Municipio",
          "Não existe Municipio com o código " + municipioVo.codigoMunicipio,
          404,
          null
        );
      }
    } catch (error) {
      if (error instanceof AlterarError) {
        throw error;
      } else {
        throw new AlterarError(
          "municipio",
          "Erro ao alterar no banco de dados",
          404,
          error
        );
      }
    }
  }

  public async pesquisarMunicipio(
    municipioVoFiltroPesquisa: MunicipioVo
  ): Promise<any> {
    try {
      let recursos: any[] = this.gerarSQLConsultarListar(
        municipioVoFiltroPesquisa
      );
      let sql = recursos[0]; //sql
      let parametros: any[] = recursos[1]; //parametros
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log(
        "QUANTIDADE DE REGISTROS ENCONTRADOS (Municipios): " +
          resultSet.rows.length
      );
      let retorno =
        resultSet.rows.length == 1
          ? this.buscarUmRegistro(resultSet)
          : this.buscarVariosRegistros(resultSet);
      return retorno;
    } catch (error) {
      throw new ConsultarError(
        "municipio",
        "Erro ao pesquisar no banco de dados",
        404,
        error
      );
    }
  }

  public async deletarMunicipio(codigoMunicipio: number) {
    try {
      let sql =
        "UPDATE TB_MUNICIPIO SET TB_MUNICIPIO.status = 2 WHERE CODIGO_MUNICIPIO = :codigoMunicipio";
      let resultado = await this.conexao.execute(sql, [codigoMunicipio]);
      console.log(
        "Foi deletado " +
          resultado.rowsAffected +
          " registro no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "uf",
        "Erro ao deletar no banco de dados",
        404,
        error
      );
    }
  }

  private buscarUmRegistro(resultSet: any): MunicipioVo {
    let municipioVo = new MunicipioVo();
    municipioVo.codigoMunicipio = resultSet.rows[0][0];
    municipioVo.codigoUF = resultSet.rows[0][1];
    municipioVo.nome = resultSet.rows[0][2];
    municipioVo.status = resultSet.rows[0][3];
    return municipioVo;
  }

  private buscarVariosRegistros(resultSet: any): MunicipioVo[] {
    let listaMunicipios: MunicipioVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while (numeroLinha < quantidadeResultados) {
      let municipioAtual = new MunicipioVo();
      {
        (municipioAtual.codigoMunicipio =
          resultSet.rows[numeroLinha][numeroCampo++]),
          (municipioAtual.codigoUF =
            resultSet.rows[numeroLinha][numeroCampo++]),
          (municipioAtual.nome = resultSet.rows[numeroLinha][numeroCampo++]),
          (municipioAtual.status = resultSet.rows[numeroLinha][numeroCampo++]);
      }
      listaMunicipios.push(municipioAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaMunicipios;
  }

  private gerarSQLConsultarListar(
    municipioVoFiltroPesquisa: MunicipioVo
  ): any[] {
    let parametros: any[] = [];
    let sql =
      "SELECT CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS FROM TB_MUNICIPIO WHERE 1 = 1 ";
    if (municipioVoFiltroPesquisa.codigoMunicipio != 0) {
      sql += " AND CODIGO_MUNICIPIO = :codigoMunicipio ";
      parametros = [...parametros, municipioVoFiltroPesquisa.codigoMunicipio]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (municipioVoFiltroPesquisa.codigoUF != 0) {
      sql += " AND CODIGO_UF = :codigoUF ";
      parametros = [...parametros, municipioVoFiltroPesquisa.codigoUF];
    }
    if (municipioVoFiltroPesquisa.nome != "") {
      sql += " AND NOME = :nome ";
      parametros = [...parametros, municipioVoFiltroPesquisa.nome];
    }
    if (municipioVoFiltroPesquisa.status != 0) {
      sql += " AND STATUS = :status ";
      parametros = [...parametros, municipioVoFiltroPesquisa.status];
    }
    sql += " ORDER BY CODIGO_MUNICIPIO DESC ";
    return [sql, parametros];
  }
}

export default MunicipioDao;
