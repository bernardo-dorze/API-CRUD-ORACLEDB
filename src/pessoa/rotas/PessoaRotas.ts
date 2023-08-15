import { Router } from "express";
import PessoaController from "../controller/PessoaController";

const pessoaRotas = Router();

const pessoaController: PessoaController = new PessoaController();

pessoaRotas.post("/", pessoaController.incluirPessoa);
pessoaRotas.put("/", pessoaController.alterarPessoa);
pessoaRotas.get("/", pessoaController.pesquisarPessoa);
pessoaRotas.delete("/:codigoPessoa", pessoaController.deletarPessoa);

export default pessoaRotas;
