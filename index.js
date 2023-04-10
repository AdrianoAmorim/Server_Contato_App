const express = require("express");
const cors = require("cors");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

//CADASTRA UM NOVO CONTATO
app.post("/cadContato", async (req, res) => {
  const contato = req.body;

  try {
    const response = await prisma.contato.create({
      data: {
        nome: contato.nome,
        sobrenome: contato.sobrenome,
        email: contato.email,
        site: contato.site,
        celular: contato.celular,
        fixo: contato.fixo,
        id_categoria: contato.categoria,
      },
      select: {
        id: true,
      },
    });

   return res.status(201).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//CADASTRA UMA NOVA CATEGORIA
app.post("/cadCategoria", async (req, res) => {
  const categoria = req.body;
  try {
    const response = await prisma.categoria.create({
      data: {
        nome: categoria.nome,
      },
      select: {
        id: true,
      },
    });
   return res.status(201).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//BUSCA UM CONTATO PELO ID DELE
app.get("/contato/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await prisma.contato.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        celular: true,
        fixo: true,
        email: true,
        site: true,
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
   return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//LISTA TODOS OS CONTATOS - ( RETORNA O ID ,NOME)
app.get("/contatos", async (req, res) => {
  try {
    const response = await prisma.contato.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    if (response[0]?.id) {
      return res.status(200).json(response);
    } else {
      return res
        .status(404)
        .json({ error: true, msg: "Ops! Nenhum Contato Cadastrado!" });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//LISTA TODAS AS CATEGORIAS CADASTRADAS
app.get("/categorias", async (req, res) => {
  try {
    const response = await prisma.categoria.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    if (response[0].id > 0) {
      return res.status(200).json(response);
    } else {
      return res
        .status(200)
        .json({ aviso: true, msg: "Ops! Nenhuma Categoria Cadastrado!" });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//ATUALIZA O CONTATO SELECIONADO
app.put("/updateContato", async (req, res) => {
  const contact = req.body;

  try {
    const response = await prisma.contato.update({
      where: {
        id: contact.id,
      },
      data: {
        nome: contact.nome,
        sobrenome: contact.sobrenome,
        celular: contact.celular,
        fixo: contact.fixo,
        email: contact.email,
        site: contact.site,
        id_categoria: contact.categoria,
      },
      select: {
        id: true,
      },
    });

    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});

//DELETA O CONTATO SELECIONADO
app.delete("/deleteContato/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await prisma.contato.delete({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
      },
    });
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(500).json({
        error: true,
        msg: "Error de Sintaxe na Requisição do Servidor!",
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        error: true,
        msg: "Erro de Violação de Restrições",
        code: error.code,
      });
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return res
        .status(500)
        .json({ error: true, msg: "Error Desconhecido no Servidor!" });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({
        error: true,
        msg: "Erro na Inicialização da Conexão com o BD!",
        code: error.errorCode,
      });
    } else {
      return res.status(400).json({ error: true, msg: "Error no servidor!" });
    }
  }
});



app.listen(4041, () => {
  console.log("Server On!");
});
