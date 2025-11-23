import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import sgMail from "@sendgrid/mail";  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors({
  origin: "https://casadaeternapaz.onrender.com", // porta do Vite
  methods: ["POST",  "GET"],
  allowedHeaders: ["Content-Type"],
}));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
  const { email, nome, idade, mensagem } = req.body;

  // Validação básica
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios" });
  }

  try {
    const msg = {
      to: "miguel.costa@ufu.br", // Destino
      from: process.env.EMAIL_FROM, // Deve ser um e-mail verificado no SendGrid
      subject: `Candidatura de ${nome}, idade: ${idade} com email: ${email}`,
      text: mensagem,
    };

    await sgMail.send(msg);
    console.log("✅ Email enviado via SendGrid");

    res.json({ sucesso: true, msg: "Email enviado!" });
  } catch (err) {
    console.log("❌ Erro ao enviar email:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
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
  
  try {
    const msg = {
      to: "miguel.costa@ufu.br", // Destino
      from: process.env.EMAIL_FROM, // Deve ser um e-mail verificado no SendGrid
      subject: `Candidatura de ${nome}, idade: ${idade} com email: ${email}`,
      text: mensagem,
    };

    await sgMail.send(msg);
    console.log("✅ Email enviado via SendGrid");

    res.json({ sucesso: true, msg: "Email enviado!" });
  } catch (err) {
    console.log("❌ Erro ao enviar email:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};



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