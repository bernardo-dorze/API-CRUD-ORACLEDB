import { Router } from "express";
import EnderecoController from "../controller/EnderecoController";

const enderecoRotas = Router();

const enderecoController: EnderecoController = new EnderecoController();

enderecoRotas.post("/", enderecoController.incluirEndereco);
enderecoRotas.put("/", enderecoController.alterarEndereco);
enderecoRotas.get("/", enderecoController.pesquisarEndereco);

export default enderecoRotas;
