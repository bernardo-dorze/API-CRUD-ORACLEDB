import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import BairroVo from "../vo/BairroVo";

class BairroDao extends AbstractDao {
  public async incluirBairro(bairroVo: BairroVo) {
    let sequence = await this.gerarSequence("SEQUENCE_BAIRRO");
    try {
      bairroVo.codigoBairro = sequence;
      let sql =
        "INSERT INTO TB_BAIRRO (CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS) VALUES (:codigoBairro, :codigoMunicipio, :nome, :status)";
      let resultado = await this.conexao.execute(sql, [
        bairroVo.codigoBairro,
        bairroVo.codigoMunicipio,
        bairroVo.nome,
        bairroVo.status,
      ]);
      console.log(
        "Foram inseridos " +
          resultado.rowsAffected +
          " registros no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "bairro",
        "Erro ao inserir no banco de dados",
        404,
        error
      );
    }
  }

  public async alterarBairro(bairroVo: BairroVo) {
    let resultado = null;
    try {
      const sql =
        "UPDATE TB_BAIRRO SET  CODIGO_MUNICIPIO = :codigoMunicipio, NOME = :nome, STATUS = :status  WHERE CODIGO_BAIRRO = :codigoBairro";
      resultado = await this.conexao.execute(sql, [
        bairroVo.codigoMunicipio,
        bairroVo.nome,
        bairroVo.status,
        bairroVo.codigoBairro,
      ]);
      console.log(
        "QUANTIDADE DE REGISTROS ALTERADOS (Bairros): " + resultado.rowsAffected
      );
      if (resultado.rowsAffected == 0) {
        throw new AlterarError(
          "Bairro",
          "Não existe Bairro com o código " + bairroVo.codigoBairro,
          404,
          null
        );
      }
    } catch (error) {
      if (error instanceof AlterarError) {
        throw error;
      } else {
        throw new AlterarError(
          "bairro",
          "Erro ao alterar no banco de dados",
          404,
          error
        );
      }
    }
  }

  public async pesquisarBairro(bairroVoFiltroPesquisa: BairroVo): Promise<any> {
    try {
      let recursos: any[] = this.gerarSQLConsultarListar(
        bairroVoFiltroPesquisa
      );
      let sql = recursos[0]; //sql
      let parametros: any[] = recursos[1]; //parametros
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log(
        "QUANTIDADE DE REGISTROS ENCONTRADOS (Bairros): " +
          resultSet.rows.length
      );
      let retorno =
        resultSet.rows.length == 1
          ? this.buscarUmRegistro(resultSet)
          : this.buscarVariosRegistros(resultSet);
      return retorno;
    } catch (error) {
      throw new ConsultarError(
        "bairro",
        "Erro ao pesquisar no banco de dados",
        404,
        error
      );
    }
  }

  public async deletarBairro(codigoBairro: number) {
    try {
      let sql =
        "UPDATE TB_BAIRRO SET status = 2 WHERE CODIGO_BAIRRO = :codigoBairro ";
      let resultado = await this.conexao.execute(sql, [codigoBairro]);
      console.log(
        "Foi deletado " +
          resultado.rowsAffected +
          " registro no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "bairro",
        "Erro ao deletar no banco de dados",
        404,
        error
      );
    }
  }

  private buscarUmRegistro(resultSet: any): BairroVo {
    let bairroVo = new BairroVo();
    bairroVo.codigoBairro = resultSet.rows[0][0];
    bairroVo.codigoMunicipio = resultSet.rows[0][1];
    bairroVo.nome = resultSet.rows[0][2];
    bairroVo.status = resultSet.rows[0][3];
    return bairroVo;
  }

  private buscarVariosRegistros(resultSet: any): BairroVo[] {
    let listaBairros: BairroVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while (numeroLinha < quantidadeResultados) {
      let bairroAtual = new BairroVo();
      {
        (bairroAtual.codigoBairro = resultSet.rows[numeroLinha][numeroCampo++]),
          (bairroAtual.codigoMunicipio =
            resultSet.rows[numeroLinha][numeroCampo++]),
          (bairroAtual.nome = resultSet.rows[numeroLinha][numeroCampo++]),
          (bairroAtual.status = resultSet.rows[numeroLinha][numeroCampo++]);
      }
      listaBairros.push(bairroAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaBairros;
  }

  private gerarSQLConsultarListar(bairroVoFiltroPesquisa: BairroVo): any[] {
    let parametros: any[] = [];
    let sql =
      "SELECT CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS FROM TB_BAIRRO WHERE 1 = 1 ";
    if (bairroVoFiltroPesquisa.codigoBairro != 0) {
      sql += " AND CODIGO_BAIRRO = :codigoBairro ";
      parametros = [...parametros, bairroVoFiltroPesquisa.codigoBairro]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (bairroVoFiltroPesquisa.codigoMunicipio != 0) {
      sql += " AND CODIGO_MUNICIPIO = :codigoMunicipio ";
      parametros = [...parametros, bairroVoFiltroPesquisa.codigoMunicipio]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (bairroVoFiltroPesquisa.nome != "") {
      sql += " AND NOME = :nome ";
      parametros = [...parametros, bairroVoFiltroPesquisa.nome];
    }
    if (bairroVoFiltroPesquisa.status != 0) {
      sql += " AND STATUS = :status ";
      parametros = [...parametros, bairroVoFiltroPesquisa.status];
    }
    sql += " ORDER BY CODIGO_BAIRRO DESC ";
    return [sql, parametros];
  }
}

export default BairroDao;
