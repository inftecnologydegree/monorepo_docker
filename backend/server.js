const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexão Inteligente com o MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => console.log("🔌 Conectado com sucesso ao MongoDB Atlas!"))
    .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// 📝 Modelo de Dados do Banco (Schema)
const TransacaoSchema = new mongoose.Schema({
    cliente: { type: String, required: true },
    tipo: { type: String, enum: ['DEPÓSITO', 'SAQUE'], required: true },
    valor: { type: Number, required: true },
    data: { type: Date, default: Date.now }
});

const Transacao = mongoose.model('Transacao', TransacaoSchema);

// 💰 Rota 1: Realizar uma nova Transação (Depósito ou Saque)
app.post('/api/transacoes', async (req, res) => {
    try {
        const { cliente, tipo, valor } = req.body;

        if (!cliente || !tipo || !valor) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        // Validação de negócio básica
        if (valor <= 0) {
            return res.status(400).json({ erro: "O valor deve ser maior que zero." });
        }

        const novaTransacao = new Transacao({
            cliente: String(cliente),
            tipo: String(tipo).toUpperCase(),
            valor: Number(valor)
        });

        await novaTransacao.save();
        res.status(201).json({ mensagem: "Transação computada!", transacao: novaTransacao });
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor ao salvar transação." });
    }
});

// 📊 Rota 2: Buscar Extrato Completo e Calcular o Saldo Atualizado
app.get('/api/extrato', async (req, res) => {
    try {
        // Busca todas as transações salvas no banco de dados, ordenando pelas mais recentes
        const transacoes = await Transacao.find().sort({ data: -1 });

        // Calcula o saldo consolidado de forma dinâmica
        let saldoConsolidado = 0;
        transacoes.forEach(t => {
            if (t.tipo === 'DEPÓSITO') saldoConsolidado += t.valor;
            if (t.tipo === 'SAQUE') saldoConsolidado -= t.valor;
        });

        res.json({
            saldoGeral: saldoConsolidado,
            historico: transacoes
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar extrato bancário." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor bancário rodando na porta ${PORT}`));
