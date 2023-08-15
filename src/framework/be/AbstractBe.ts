class AbstractBe {
  protected conexao: any = null;

  constructor(conexao: any) {
    this.conexao = conexao;
  }
}

export default AbstractBe;
