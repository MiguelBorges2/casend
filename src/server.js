import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5174", // porta do Vite
  methods: ["POST",  "GET"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());
app.use("/paginas", express.static(path.join(__dirname, "paginas")));

app.get("/remi", (req, res) => {
    res.sendFile(path.join(__dirname, "/paginas/remi.html"));
});
app.post("/api/download", async (req, res) => {
    console.log("qual download?");
    const imagem = req.body.numero;
    if(imagem == 1){
          const filePath = path.join(__dirname, "files", "1.jpg");
          res.sendFile(filePath, (err) => {
            if (err) {
                console.log("❌ erro ao enviar arquivo:", err);
                res.status(500).send("Erro ao baixar o arquivo");
            }
        });

    }
     if(imagem == 3){
          const filePath = path.join(__dirname, "files", "3.webp");
          res.sendFile(filePath, (err) => {
            if (err) {
                console.log("❌ erro ao enviar arquivo:", err);
                res.status(500).send("Erro ao baixar o arquivo");
            }
        });

    }
    if(imagem == 12){
          const filePath = path.join(__dirname, "files", "1.jfif");
          res.sendFile(filePath, (err) => {
            if (err) {
                console.log("❌ erro ao enviar arquivo:", err);
                res.status(500).send("Erro ao baixar o arquivo");
            }
        });

    }
    if(imagem == 7){
          const filePath = path.join(__dirname, "files", "7.jpg");
          res.sendFile(filePath, (err) => {
            if (err) {
                console.log("❌ erro ao enviar arquivo:", err);
                res.status(500).send("Erro ao baixar o arquivo");
            }
        });

    }
    
});

app.post("/api/rece", async (req, res) => {
  console.log("➡️  /api/recebe foi chamado");

  try {
    const { email, mensagem, idade, nome} = req.body;
    const check = validarEntrada(nome, idade, email, mensagem);
    if(check){
      return res.status(400).json({
        sucesso: false,
        erro: check,
      })
    }

    const r = await enviaEmail(email, nome, idade, mensagem);
    console.log("➡️  Resultado do email:", r);
 
    return res.json({ sucesso: true, msg: "Email enviado!" });
  } catch (err) {
    console.log("❌ ERRO DETECTADO:");
    console.log(err);

    return res.status(500).json({
      sucesso: false,
      erro: err?.message || err
    });
  }
});
function validarEntrada( nome, idade, email, mensagem) {

  // nome
  if (!nome || nome.trim().length < 2) {
    return "Nome inválido";
  }

  // idade (somente números)
  if (!idade || !/^[0-9]+$/.test(String(idade))) {
    return "Idade deve conter apenas números";
  }

  // email básico
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return "Email inválido";
  }

  // mensagem
  if (!mensagem || mensagem.trim().length < 5) {
    return "Mensagem muito curta";
  }

  return null; // passou
}
async function  enviaEmail(email, nome, idade, mensagem) {
  console.log("➡️  Enviando email...");

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});



  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "miguel.costa@ufu.br",
      subject: `Candidatura de ${nome}, idade: ${idade} com email: ${email} `, 
      text: mensagem,
    });

    console.log("✅ Email enviado:", info);

    return info;

  } catch (err) {
    console.log("❌ ERRO NO SENDMAIL:");
    console.log(err);
    throw err;
  }
}

app.listen(process.env.PORT || 3000, () =>
  console.log(`Servidor rodando`)
);