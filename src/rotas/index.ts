import { Router } from "express";
import ufRotas from "../uf/rotas/UFRotas";
import municipioRotas from "../municipio/rotas/MunicipioRotas";
import bairroRotas from "../bairro/rotas/BairroRotas";
import pessoaRotas from "../pessoa/rotas/PessoaRotas";

const rotas = Router();
rotas.use("/uf", ufRotas);
rotas.use("/municipio", municipioRotas);
rotas.use("/bairro", bairroRotas);
rotas.use("/pessoa", pessoaRotas);

export default rotas;
