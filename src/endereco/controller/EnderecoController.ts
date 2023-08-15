import { Request, Response } from "express";
import EnderecoBe from "../be/EnderecoBe";
import EnderecoVo from "../vo/EnderecoVo";
import Conexao from "../../framework/banco/Conexao";
import AbstractError from "../../framework/exceptions/AbstractError";
import NumeroFormatoInvalidoError from "../../framework/exceptions/NumeroFormatoInvalidoError";

class EnderecoController {
  public async incluirEndereco(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let enderecoBe: EnderecoBe = new EnderecoBe(conexao);
      let enderecoVo: any = request.body;
      let registros = await enderecoBe.incluirEndereco(enderecoVo);
      await Conexao.commit();
      return response.status(200).json(registros);
    } catch (error) {
      console.error(error);
      await Conexao.rollback();
      let codigoErro: number =
        error instanceof AbstractError ? error.status : 404;
      return response
        .status(codigoErro)
        .json(
          error instanceof AbstractError
            ? error
            : { status: 404, mensagem: "Não foi possível incluir Endereco." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async alterarEndereco(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let enderecoBe: EnderecoBe = new EnderecoBe(conexao);
      let endereco: any = request.body;
      let registros = await enderecoBe.alterarEndereco(endereco);
      await Conexao.commit();
      return response.status(200).json(registros);
    } catch (error) {
      console.error(error);
      await Conexao.rollback();
      let codigoErro: number =
        error instanceof AbstractError ? error.status : 404;
      return response
        .status(codigoErro)
        .json(
          error instanceof AbstractError
            ? error
            : { status: 404, mensagem: "Não foi possível alterar Endereco." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async pesquisarEndereco(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let enderecoBe: EnderecoBe = new EnderecoBe(conexao);
      let { codigoEndereco } = request.query;
      let { codigoPessoa } = request.query;
      let { codigoBairro } = request.query;
      let { nomeRua } = request.query;
      let { numero } = request.query;
      let { complemento } = request.query;
      let { cep } = request.query;
      let enderecoVoFiltroPesquisa: EnderecoVo = new EnderecoVo();
      let registros = null;
      if (codigoEndereco != undefined) {
        if (isNaN(parseInt("" + codigoEndereco))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Endereco",
            "codigoEndereco",
            "" + codigoEndereco,
            404
          );
        }
        enderecoVoFiltroPesquisa.codigoEndereco = parseInt("" + codigoEndereco);
      }
      if (codigoPessoa != undefined) {
        if (isNaN(parseInt("" + codigoPessoa))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Endereco",
            "codigoPessoa",
            "" + codigoPessoa,
            404
          );
        }
        enderecoVoFiltroPesquisa.codigoEndereco = parseInt("" + codigoPessoa);
      }
      if (codigoBairro != undefined) {
        if (isNaN(parseInt("" + codigoBairro))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Endereco",
            "codigoBairro",
            "" + codigoBairro,
            404
          );
        }
        enderecoVoFiltroPesquisa.codigoEndereco = parseInt("" + codigoBairro);
      }

      if (nomeRua != undefined) {
        enderecoVoFiltroPesquisa.nomeRua = "" + nomeRua;
      }
      if (numero != undefined) {
        enderecoVoFiltroPesquisa.numero = "" + numero;
      }
      if (complemento != undefined) {
        enderecoVoFiltroPesquisa.complemento = "" + complemento;
      }
      if (cep != undefined) {
        enderecoVoFiltroPesquisa.cep = "" + cep;
      }

      registros = await enderecoBe.pesquisarEndereco(enderecoVoFiltroPesquisa);
      return response.status(200).json(registros);
    } catch (error) {
      console.error(error);
      let codigoErro: number =
        error instanceof AbstractError ? error.status : 404;
      return response
        .status(codigoErro)
        .json(
          error instanceof AbstractError
            ? error
            : { status: 404, mensagem: "Não foi possível consultar Endereco." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }
}

export default EnderecoController;
