import express from "express";
import rotas from "../rotas";
const app = express();

app.use(express.json());

function interceptador(request: any, response: any, proximo: any) {
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:3333");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");
  const { method, url } = request;
  console.log(`[${method.toUpperCase()}] ${url} `);
  return proximo();
}
app.use(interceptador);
app.use(rotas);

app.listen(3333, () => {
  console.log("O SERVIDOR FOI INICIALIZADO...");
});
