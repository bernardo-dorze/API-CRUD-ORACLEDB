import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import PessoaVo from "../vo/PessoaVo";

class PessoaDao extends AbstractDao {
  public async incluirPessoa(pessoaVo: PessoaVo) {
    let sequence = await this.gerarSequence("SEQUENCE_PESSOA");
    try {
      pessoaVo.codigoPessoa = sequence;
      let sql =
        "INSERT INTO TB_PESSOA (CODIGO_PESSOA, NOME, SOBRENOME, IDADE, LOGIN, SENHA, STATUS) VALUES (:codigoPessoa, :nome, :sobrenome, :idade, :login, :senha, :status)";
      let resultado = await this.conexao.execute(sql, [
        pessoaVo.codigoPessoa,
        pessoaVo.nome,
        pessoaVo.sobrenome,
        pessoaVo.idade,
        pessoaVo.login,
        pessoaVo.senha,
        pessoaVo.status,
      ]);
      console.log(
        "Foram inseridos " +
          resultado.rowsAffected +
          " registros no banco de dados."
      );
      return sequence;
    } catch (error) {
      throw new IncluirError(
        "pessoa",
        "Erro ao inserir no banco de dados",
        404,
        error
      );
    }
  }

  public async alterarPessoa(pessoaVo: PessoaVo) {
    let resultado = null;
    try {
      const sql =
        "UPDATE TB_PESSOA SET NOME = :nome, SOBRENOME = :sobrenome, IDADE = :idade, LOGIN = :login, SENHA = :senha,  STATUS = :status  WHERE CODIGO_PESSOA = :codigoPessoa";
      resultado = await this.conexao.execute(sql, [
        pessoaVo.nome,
        pessoaVo.sobrenome,
        pessoaVo.idade,
        pessoaVo.login,
        pessoaVo.senha,
        pessoaVo.status,
        pessoaVo.codigoPessoa,
      ]);
      console.log(
        "QUANTIDADE DE REGISTROS ALTERADOS (Pessoas): " + resultado.rowsAffected
      );
      if (resultado.rowsAffected == 0) {
        throw new AlterarError(
          "Pessoa",
          "Não existe Pessoa com o código " + pessoaVo.codigoPessoa,
          404,
          null
        );
      }
    } catch (error) {
      if (error instanceof AlterarError) {
        throw error;
      } else {
        throw new AlterarError(
          "pessoa",
          "Erro ao alterar no banco de dados",
          404,
          error
        );
      }
    }
  }

  public async pesquisarPessoa(pessoaVoFiltroPesquisa: PessoaVo): Promise<any> {
    try {
      let recursos: any[] = this.gerarSQLConsultarListar(
        pessoaVoFiltroPesquisa
      );
      let sql = recursos[0]; //sql
      let parametros: any[] = recursos[1]; //parametros
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log(
        "QUANTIDADE DE REGISTROS ENCONTRADOS (Pessoas): " +
          resultSet.rows.length
      );
      let retorno =
        resultSet.rows.length == 1
          ? this.buscarUmRegistro(resultSet)
          : this.buscarVariosRegistros(resultSet);
      return retorno;
    } catch (error) {
      throw new ConsultarError(
        "pessoa",
        "Erro ao pesquisar no banco de dados",
        404,
        error
      );
    }
  }

  public async deletarPessoa(codigoPessoa: number) {
    try {
      let sql =
        "UPDATE TB_PESSOA SET status = 2 WHERE CODIGO_PESSOA = :codigoPessoa";
      let resultado = await this.conexao.execute(sql, [codigoPessoa]);
      console.log(
        "Foi deletado " +
          resultado.rowsAffected +
          " registro no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "pessoa",
        "Erro ao deletar no banco de dados",
        404,
        error
      );
    }
  }

  private buscarUmRegistro(resultSet: any): PessoaVo {
    let pessoaVo = new PessoaVo();
    pessoaVo.codigoPessoa = resultSet.rows[0][0];
    pessoaVo.nome = resultSet.rows[0][1];
    pessoaVo.sobrenome = resultSet.rows[0][2];
    pessoaVo.idade = resultSet.rows[0][3];
    pessoaVo.login = resultSet.rows[0][4];
    pessoaVo.senha = resultSet.rows[0][5];
    pessoaVo.status = resultSet.rows[0][6];
    return pessoaVo;
  }

  private buscarVariosRegistros(resultSet: any): PessoaVo[] {
    let listaPessoas: PessoaVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while (numeroLinha < quantidadeResultados) {
      let pessoaAtual = new PessoaVo();
      {
        (pessoaAtual.codigoPessoa = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.nome = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.sobrenome = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.idade = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.login = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.senha = resultSet.rows[numeroLinha][numeroCampo++]),
          (pessoaAtual.status = resultSet.rows[numeroLinha][numeroCampo++]);
      }
      listaPessoas.push(pessoaAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaPessoas;
  }

  private gerarSQLConsultarListar(pessoaVoFiltroPesquisa: PessoaVo): any[] {
    let parametros: any[] = [];
    let sql =
      "SELECT CODIGO_PESSOA, NOME, SOBRENOME, IDADE, LOGIN, SENHA, STATUS FROM TB_PESSOA WHERE 1 = 1 ";
    if (pessoaVoFiltroPesquisa.codigoPessoa != 0) {
      sql += " AND CODIGO_Pessoa = :codigoPessoa ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.codigoPessoa]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (pessoaVoFiltroPesquisa.nome != "") {
      sql += " AND NOME = :nome ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.nome];
    }
    if (pessoaVoFiltroPesquisa.sobrenome != "") {
      sql += " AND SOBRENOME = :sobrenome ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.sobrenome];
    }
    if (pessoaVoFiltroPesquisa.idade != 0) {
      sql += " AND IDADE = :idade ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.idade];
    }
    if (pessoaVoFiltroPesquisa.login != "") {
      sql += " AND LOGIN = :login ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.login];
    }
    if (pessoaVoFiltroPesquisa.senha != "") {
      sql += " AND SENHA = :senha ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.senha];
    }
    if (pessoaVoFiltroPesquisa.status != 0) {
      sql += " AND STATUS = :status ";
      parametros = [...parametros, pessoaVoFiltroPesquisa.status];
    }
    sql += " ORDER BY CODIGO_Pessoa DESC ";
    return [sql, parametros];
  }
}

export default PessoaDao;
