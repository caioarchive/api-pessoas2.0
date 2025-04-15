import express, { request } from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const PORT = 3333

const app = express()
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())

const pessoas = []
const login = []

app.get("/cadastros", (request, response) => {
    response.status(200).json(pessoas)
})

app.get("/login", (request, response) => {
    response.status(200).json(login)
})
app.post("/cadastro", (request, response) => {
    const { nome, email, senha } = request.body

    if (!nome) {
        return response.status(400).json({ message: "Nome é obrigatório" })
    }

    if (!email) {
        return response.status(400).json({ message: "Email é obrigatório" })
    }

    if (!senha) {
        return response.status(400).json({ message: "Senha é obrigatória" })
    }


    const emailRepetido = pessoas.find((pessoa) => pessoa.email === email)
    if (emailRepetido) {
        return response.status(400).json({ message: "Email já cadastrado. Use outro email." })
    }

    const pessoa = {
        id: uuidv4(),
        nome,
        email,
        senha
    }

    pessoas.push(pessoa)

    return response.status(201).json({ mensagem: "Cadastro realizado", pessoa })
})
app.post("/login", (request, response) => {
    const { email, senha } = request.body

    if (!email) {
        response.status(400).json({ message: "Email é obrigatório" })
        return
    }
    if (!senha) {
        response.status(400).json({ message: "Senha é obrigatório" })
        return
    }
    const loginPessoa = {
        id: uuidv4(), //teria que ser o mesmo id do cadastro? fiquei na duvida, ass caio
        email,
        senha
    }

    const emailExistente = pessoas.find((pessoa) => pessoa.email !== email)
    const senhaExistente = pessoas.find((pessoa) => pessoa.senha !== senha)
    if (emailExistente) {
        return response.status(400).json({ message: "Digite um email existente!" })
    }
    if (senhaExistente) {
        return response.status(400).json({ message: "Digite uma senha existente!" })
    }

    login.push(loginPessoa)
    response.status(201).json({ mensagem: "Login realizado", loginPessoa })
})

app.get("/cadastros/:id", (request, response) => {
    const { id } = request.params

    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id)
    if (encontrarPessoa === -1) {
        response.status(400).json({ message: "Pessoa não encontrada" })
        return
    }

    const pessoaEncontrada = pessoas[encontrarPessoa]
    response.status(200).json(pessoaEncontrada)
})

app.put("/cadastros/:id", (request, response) => {
    const { id } = request.params
    const { nome, email, senha } = request.body

    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id)
    if (encontrarPessoa === -1) {
        response.status(400).json({ message: "Pessoa não encontrada" })
        return
    }

    if (!nome || !email || !senha) {
        response.status(400).json({ message: "Nome e Cargo é obrigatório" })
        return
    }

    const pessoaAtualizada = {
        id,
        nome,
        email,
        senha
    }
    pessoas[encontrarPessoa] = pessoaAtualizada
    response.status(200).json({ message: "Pessoa Atualizada", pessoaAtualizada })
})

app.delete("/cadastros/:id", (request, response) => {
    const { id } = request.params

    const encontrarPessoa = pessoas.findIndex((pessoa) => pessoa.id === id)
    if (encontrarPessoa === -1) {
        response.status(400).json({ message: "Pessoa não encontrada" })
        return
    }

    pessoas.splice(encontrarPessoa, 1)
    response.status(200).json({ mensagem: "Pessoa Excluída" })
})

app.listen(PORT, () => {
    console.log("Servidor iniciado!")
})