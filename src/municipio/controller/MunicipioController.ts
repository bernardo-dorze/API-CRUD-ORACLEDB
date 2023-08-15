import { Request, Response } from "express";
import MunicipioBe from "../be/MunicipioBe";
import MunicipioVo from "../vo/MunicipioVo";
import Conexao from "../../framework/banco/Conexao";
import AbstractError from "../../framework/exceptions/AbstractError";
import NumeroFormatoInvalidoError from "../../framework/exceptions/NumeroFormatoInvalidoError";

class MunicipioController {
  public async incluirMunicipio(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let municipioBe: MunicipioBe = new MunicipioBe(conexao);
      let municipioVo: any = request.body;
      let registros = await municipioBe.incluirMunicipio(municipioVo);
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
            : { status: 404, mensagem: "Não foi possível incluir Municipio." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async alterarMunicipio(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let municipioBe: MunicipioBe = new MunicipioBe(conexao);
      let municipio: any = request.body;
      let registros = await municipioBe.alterarMunicipio(municipio);
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
            : { status: 404, mensagem: "Não foi possível alterar Municipio." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }

  public async pesquisarMunicipio(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let municipioBe: MunicipioBe = new MunicipioBe(conexao);
      let { codigoMunicipio } = request.query;
      let { codigoUF } = request.query;
      let { status } = request.query;
      let { nome } = request.query;
      let municipioVoFiltroPesquisa: MunicipioVo = new MunicipioVo();
      let registros = null;
      if (codigoMunicipio != undefined) {
        if (isNaN(parseInt("" + codigoMunicipio))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Municipio",
            "codigoMunicipio",
            "" + codigoMunicipio,
            404
          );
        }
        municipioVoFiltroPesquisa.codigoMunicipio = parseInt(
          "" + codigoMunicipio
        );
      }
      if (nome != undefined) {
        municipioVoFiltroPesquisa.nome = "" + nome;
      }
      if (status != undefined) {
        if (isNaN(parseInt("" + status))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Municipio",
            "status",
            "" + status,
            404
          );
        }
        municipioVoFiltroPesquisa.status = parseInt("" + status);
      }
      registros = await municipioBe.pesquisarMunicipio(
        municipioVoFiltroPesquisa
      );
      if (codigoUF != undefined) {
        if (isNaN(parseInt("" + codigoUF))) {
          throw new NumeroFormatoInvalidoError(
            "consultar",
            "Municipio",
            "codigoUF",
            "" + codigoUF,
            404
          );
        }
        municipioVoFiltroPesquisa.codigoUF = parseInt("" + codigoUF);
      }
      registros = await municipioBe.pesquisarMunicipio(
        municipioVoFiltroPesquisa
      );
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
            : { status: 404, mensagem: "Não foi possível consultar Municipio." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }
  public async deletarMunicipio(request: Request, response: Response) {
    try {
      let conexao = await Conexao.abrirConexao();
      let municipioBe: MunicipioBe = new MunicipioBe(conexao);
      const { codigoMunicipio } = request.params;
      let registros = await municipioBe.deletarMunicipio(
        parseInt(codigoMunicipio)
      );
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
            : { status: 404, mensagem: "Não foi possível incluir Municipio." }
        );
    } finally {
      await Conexao.fecharConexao();
    }
  }
}

export default MunicipioController;
