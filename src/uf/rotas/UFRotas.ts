import { Router } from "express";
import UFController from "../controller/UFController";

const ufRotas = Router();

const ufController: UFController = new UFController();

ufRotas.post("/", ufController.incluirUF);
ufRotas.put("/", ufController.alterarUF);
ufRotas.get("/", ufController.pesquisarUF);
ufRotas.delete("/:codigoUF", ufController.deletarUF);

export default ufRotas;
