import oracle, { errorOnConcurrentExecute } from "oracledb";
import ConexaoError from "../exceptions/ConexaoError";

class Conexao {
  public static conexao: any = null;

  constructor() {}

  public static async abrirConexao() {
    try {
      if (this.conexao === null || this.conexao.isClosed()) {
        console.log("Tentando abrir conexao");
        this.conexao = await oracle.getConnection({
          user: "C##NODE",
          password: "node",
          connectString: "localhost:1521/XE",
        });
        console.log("Abriu conexao");
      }
      return this.conexao;
    } catch (error) {
      throw new ConexaoError(
        "Não foi possível abrir conexão com o banco de dados",
        404,
        error
      );
    }
  }

  public static async fecharConexao() {
    if (this.conexao != null) {
      console.log("Tentando fechar conexao");
      this.conexao.close();
      this.conexao = null;
      console.log("Conexao fechada");
    }
  }

  public static async commit() {
    if (this.conexao != null) {
      console.log("Tentando comitar a transação");
      this.conexao.commit();
      console.log("Comitou a transacao");
    }
  }

  public static async rollback() {
    if (this.conexao != null) {
      console.log("Tentando desfazer a transação");
      this.conexao.rollback();
      console.log("Executou rollback");
    }
  }
}

export default Conexao;
