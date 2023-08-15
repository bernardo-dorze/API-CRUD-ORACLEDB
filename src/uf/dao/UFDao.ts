import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import UFVo from "../vo/UFVo";

class UFDao extends AbstractDao {
  public async incluirUF(ufVo: UFVo) {
    let sequence = await this.gerarSequence("SEQUENCE_UF");
    try {
      ufVo.codigoUF = sequence;
      let sql =
        "INSERT INTO TB_UF (CODIGO_UF, SIGLA, NOME, STATUS) VALUES (:codigoUF, :sigla, :nome, :status)";
      let resultado = await this.conexao.execute(sql, [
        ufVo.codigoUF,
        ufVo.sigla,
        ufVo.nome,
        ufVo.status,
      ]);
      console.log(
        "Foram inseridos " +
          resultado.rowsAffected +
          " registros no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "uf",
        "Erro ao inserir no banco de dados",
        404,
        error
      );
    }
  }

  public async alterarUF(ufVo: UFVo) {
    let resultado = null;
    try {
      const sql =
        "UPDATE TB_UF SET SIGLA = :sigla, NOME = :nome, STATUS = :status  WHERE CODIGO_UF = :codigoUF";
      resultado = await this.conexao.execute(sql, [
        ufVo.sigla,
        ufVo.nome,
        ufVo.status,
        ufVo.codigoUF,
      ]);
      console.log(
        "QUANTIDADE DE REGISTROS ALTERADOS (UFs): " + resultado.rowsAffected
      );
      if (resultado.rowsAffected == 0) {
        throw new AlterarError(
          "UF",
          "Não existe UF com o código " + ufVo.codigoUF,
          404,
          null
        );
      }
    } catch (error) {
      if (error instanceof AlterarError) {
        throw error;
      } else {
        throw new AlterarError(
          "uf",
          "Erro ao alterar no banco de dados",
          404,
          error
        );
      }
    }
  }

  public async pesquisarUF(ufVoFiltroPesquisa: UFVo): Promise<any> {
    try {
      let recursos: any[] = this.gerarSQLConsultarListar(ufVoFiltroPesquisa);
      let sql = recursos[0]; //sql
      let parametros: any[] = recursos[1]; //parametros
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log(
        "QUANTIDADE DE REGISTROS ENCONTRADOS (UFs): " + resultSet.rows.length
      );
      let retorno =
        resultSet.rows.length == 1
          ? this.buscarUmRegistro(resultSet)
          : this.buscarVariosRegistros(resultSet);
      return retorno;
    } catch (error) {
      throw new ConsultarError(
        "uf",
        "Erro ao pesquisar no banco de dados",
        404,
        error
      );
    }
  }

  public async deletarUF(codigoUF: number) {
    try {
      let sql = "UPDATE TB_UF SET status = 2 WHERE CODIGO_UF = :codigoUF";
      let resultado = await this.conexao.execute(sql, [codigoUF]);
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

  private buscarUmRegistro(resultSet: any): UFVo {
    let ufVo = new UFVo();
    ufVo.codigoUF = resultSet.rows[0][0];
    ufVo.sigla = resultSet.rows[0][1];
    ufVo.nome = resultSet.rows[0][2];
    ufVo.status = resultSet.rows[0][3];
    return ufVo;
  }

  private buscarVariosRegistros(resultSet: any): UFVo[] {
    let listaUFs: UFVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while (numeroLinha < quantidadeResultados) {
      let ufAtual = new UFVo();
      {
        (ufAtual.codigoUF = resultSet.rows[numeroLinha][numeroCampo++]),
          (ufAtual.sigla = resultSet.rows[numeroLinha][numeroCampo++]),
          (ufAtual.nome = resultSet.rows[numeroLinha][numeroCampo++]),
          (ufAtual.status = resultSet.rows[numeroLinha][numeroCampo++]);
      }
      listaUFs.push(ufAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaUFs;
  }

  private gerarSQLConsultarListar(ufVoFiltroPesquisa: UFVo): any[] {
    let parametros: any[] = [];
    let sql = "SELECT CODIGO_UF, SIGLA, NOME, STATUS FROM TB_UF WHERE 1 = 1 ";
    if (ufVoFiltroPesquisa.codigoUF != 0) {
      sql += " AND CODIGO_UF = :codigoUF ";
      parametros = [...parametros, ufVoFiltroPesquisa.codigoUF]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (ufVoFiltroPesquisa.sigla != "") {
      sql += " AND SIGLA = :sigla ";
      parametros = [...parametros, ufVoFiltroPesquisa.sigla];
    }
    if (ufVoFiltroPesquisa.nome != "") {
      sql += " AND NOME = :nome ";
      parametros = [...parametros, ufVoFiltroPesquisa.nome];
    }
    if (ufVoFiltroPesquisa.status != 0) {
      sql += " AND STATUS = :status ";
      parametros = [...parametros, ufVoFiltroPesquisa.status];
    }
    sql += " ORDER BY CODIGO_UF DESC ";
    return [sql, parametros];
  }
}

export default UFDao;
