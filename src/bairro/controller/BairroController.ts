import { Request, Response } from "express";
import BairroBe from "../be/BairroBe";
import BairroVo from "../vo/BairroVo";
import Conexao from "../../framework/banco/Conexao";
import AbstractError from "../../framework/exceptions/AbstractError";
import NumeroFormatoInvalidoError from "../../framework/exceptions/NumeroFormatoInvalidoError";

class BairroController {
  public async incluirBairro(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let bairroBe: BairroBe = new BairroBe(conexao);
      let bairroVo: any = request.body;
      let registros = await bairroBe.incluirBairro(bairroVo);
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
            : { status: 404, mensagem: "Não foi possível incluir Bairro." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async alterarBairro(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let bairroBe: BairroBe = new BairroBe(conexao);
      let bairro: any = request.body;
      let registros = await bairroBe.alterarBairro(bairro);
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
            : { status: 404, mensagem: "Não foi possível alterar Bairro." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async pesquisarBairro(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let bairroBe: BairroBe = new BairroBe(conexao);
      let { codigoBairro } = request.query;
      let { status } = request.query;
      let { nome } = request.query;
      let { codigoMunicipio } = request.query;
      let bairroVoFiltroPesquisa: BairroVo = new BairroVo();
      let registros = null;
      if (codigoBairro != undefined) {
        if (isNaN(parseInt("" + codigoBairro))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Bairro",
            "codigoBairro",
            "" + codigoBairro,
            404
          );
        }
        bairroVoFiltroPesquisa.codigoBairro = parseInt("" + codigoBairro);
      }
      if (nome != undefined) {
        bairroVoFiltroPesquisa.nome = "" + nome;
      }
      if (status != undefined) {
        if (isNaN(parseInt("" + status))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Bairro",
            "status",
            "" + status,
            404
          );
        }
        bairroVoFiltroPesquisa.status = parseInt("" + status);
      }
      if (codigoMunicipio != undefined) {
        if (isNaN(parseInt("" + codigoMunicipio))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Bairro",
            "codigoMunicipio",
            "" + codigoMunicipio,
            404
          );
        }
        bairroVoFiltroPesquisa.codigoMunicipio = parseInt("" + codigoMunicipio);
      }
      registros = await bairroBe.pesquisarBairro(bairroVoFiltroPesquisa);
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
            : { status: 404, mensagem: "Não foi possível consultar Bairro." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }
  public async deletarBairro(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let bairroBe: BairroBe = new BairroBe(conexao);
      const { codigoBairro } = request.params;
      let registros = await bairroBe.deletarBairro(parseInt(codigoBairro));
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
            : { status: 404, mensagem: "Não foi possível incluir Bairro." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }
}

export default BairroController;
