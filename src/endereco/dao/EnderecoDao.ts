import AbstractDao from "../../framework/dao/AbstractDao";
import AlterarError from "../../framework/exceptions/AlterarError";
import ConsultarError from "../../framework/exceptions/ConsultarError";
import IncluirError from "../../framework/exceptions/IncluirError";
import EnderecoVo from "../vo/EnderecoVo";

class EnderecoDao extends AbstractDao {
  public async incluirEndereco(enderecoVo: EnderecoVo, codigoPessoa: number) {
    let sequence = await this.gerarSequence("SEQUENCE_ENDERECO");
    try {
      enderecoVo.codigoEndereco = sequence;
      let sql =
        "INSERT INTO TB_ENDERECO (CODIGO_ENDERECO, CODIGO_PESSOA, CODIGO_BAIRRO, NOME_RUA, NUMERO, COMPLEMENTO, CEP) VALUES (:codigoEndereco, :codigoPessoa, :codigoBairro, :nomeRua, :numero, :complemento, :cep)";
      let resultado = await this.conexao.execute(sql, [
        enderecoVo.codigoEndereco,
        codigoPessoa,
        enderecoVo.codigoBairro,
        enderecoVo.nomeRua,
        enderecoVo.numero,
        enderecoVo.complemento,
        enderecoVo.cep,
      ]);
      console.log(
        "Foram inseridos " +
          resultado.rowsAffected +
          " registros no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "endereco",
        "Erro ao inserir no banco de dados",
        404,
        error
      );
    }
  }

  public async alterarEndereco(enderecoVo: EnderecoVo) {
    let resultado = null;
    try {
      const sql =
        "UPDATE TB_ENDERECO SET CODIGO_ENDERECO = :codigoEndereco, CODIGO_PESSOA = :codigoPessoa, CODIGO_BAIRRO = :codigoBairro, NOME_RUA = :nomeRua, NUMERO = :numero, COMPLEMENTO = :complemento, CEP = :cep WHERE CODIGO_ENDERECO = :codigoEndereco";
      resultado = await this.conexao.execute(sql, [
        enderecoVo.codigoPessoa,
        enderecoVo.codigoBairro,
        enderecoVo.nomeRua,
        enderecoVo.numero,
        enderecoVo.complemento,
        enderecoVo.cep,
        enderecoVo.codigoEndereco,
      ]);
      console.log(
        "QUANTIDADE DE REGISTROS ALTERADOS (Enderecos): " +
          resultado.rowsAffected
      );
      if (resultado.rowsAffected == 0) {
        throw new AlterarError(
          "Endereco",
          "Não existe Endereco com o código " + enderecoVo.codigoEndereco,
          404,
          null
        );
      }
    } catch (error) {
      if (error instanceof AlterarError) {
        throw error;
      } else {
        throw new AlterarError(
          "endereco",
          "Erro ao alterar no banco de dados",
          404,
          error
        );
      }
    }
  }

  public async pesquisarEndereco(
    enderecoVoFiltroPesquisa: EnderecoVo
  ): Promise<any> {
    try {
      let recursos: any[] = this.gerarSQLConsultarListar(
        enderecoVoFiltroPesquisa
      );
      let sql = recursos[0]; //sql
      console.log(sql);
      let parametros: any[] = recursos[1]; //parametros
      let resultSet = await this.conexao.execute(sql, parametros);
      console.log(
        "QUANTIDADE DE REGISTROS ENCONTRADOS (Enderecos): " +
          resultSet.rows.length
      );
      let retorno =
        resultSet.rows.length == 1
          ? this.buscarUmRegistro(resultSet)
          : this.buscarVariosRegistros(resultSet);
      return retorno;
    } catch (error) {
      throw new ConsultarError(
        "endereco",
        "Erro ao pesquisar no banco de dados",
        404,
        error
      );
    }
  }

  public async deletarEnderecosPorPessoa(codigoPessoa: number) {
    try {
      let sql = "DELETE FROM TB_ENDERECO WHERE CODIGO_PESSOA = :codigoPessoa";
      let resultado = await this.conexao.execute(sql, [codigoPessoa]);
      console.log(
        "Foi deletado " +
          resultado.rowsAffected +
          " registro no banco de dados."
      );
    } catch (error) {
      throw new IncluirError(
        "endereco",
        "Erro ao deletar no banco de dados",
        404,
        error
      );
    }
  }

  private buscarUmRegistro(resultSet: any): EnderecoVo {
    let enderecoVo = new EnderecoVo();
    enderecoVo.codigoEndereco = resultSet.rows[0][0];
    enderecoVo.codigoPessoa = resultSet.rows[0][1];
    enderecoVo.codigoBairro = resultSet.rows[0][2];
    enderecoVo.nomeRua = resultSet.rows[0][3];
    enderecoVo.numero = resultSet.rows[0][4];
    enderecoVo.complemento = resultSet.rows[0][5];
    enderecoVo.cep = resultSet.rows[0][6];
    return enderecoVo;
  }

  private buscarVariosRegistros(resultSet: any): EnderecoVo[] {
    let listaEnderecos: EnderecoVo[] = [];
    let numeroCampo = 0;
    let numeroLinha = 0;
    let quantidadeResultados = resultSet.rows.length;
    while (numeroLinha < quantidadeResultados) {
      let enderecoAtual = new EnderecoVo();
      {
        (enderecoAtual.codigoEndereco =
          resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.codigoPessoa =
            resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.codigoBairro =
            resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.nomeRua = resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.numero = resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.complemento =
            resultSet.rows[numeroLinha][numeroCampo++]),
          (enderecoAtual.cep = resultSet.rows[numeroLinha][numeroCampo++]);
      }
      listaEnderecos.push(enderecoAtual);
      numeroLinha++;
      numeroCampo = 0;
    }
    return listaEnderecos;
  }

  private gerarSQLConsultarListar(enderecoVoFiltroPesquisa: EnderecoVo): any[] {
    let parametros: any[] = [];
    let sql =
      "SELECT CODIGO_ENDERECO, CODIGO_PESSOA, CODIGO_BAIRRO, NOME_RUA, NUMERO, COMPLEMENTO, CEP STATUS FROM TB_Endereco WHERE 1 = 1 ";
    if (enderecoVoFiltroPesquisa.codigoEndereco != 0) {
      sql += " AND CODIGO_ENDERECO = :codigoEndereco ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoEndereco]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (enderecoVoFiltroPesquisa.codigoPessoa != 0) {
      sql += " AND CODIGO_PESSOA = :codigoPessoa ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoPessoa]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (enderecoVoFiltroPesquisa.codigoBairro != 0) {
      sql += " AND CODIGO_BAIRRO = :codigoBairro ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.codigoBairro]; //outra forma de adicionar um elemento dentro de um array (não é muito usual, mas é possível)
    }
    if (enderecoVoFiltroPesquisa.nomeRua != "") {
      sql += " AND NOME_RUA = :nomeRua ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.nomeRua];
    }
    if (enderecoVoFiltroPesquisa.numero != "") {
      sql += " AND NUMERO = :numero ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.numero];
    }
    if (enderecoVoFiltroPesquisa.complemento != "") {
      sql += " AND COMPLEMENTO = :complemento ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.complemento];
    }
    if (enderecoVoFiltroPesquisa.cep != "") {
      sql += " AND CEP = :cep ";
      parametros = [...parametros, enderecoVoFiltroPesquisa.cep];
    }
    sql += " ORDER BY CODIGO_ENDERECO DESC ";
    return [sql, parametros];
  }
}

export default EnderecoDao;
