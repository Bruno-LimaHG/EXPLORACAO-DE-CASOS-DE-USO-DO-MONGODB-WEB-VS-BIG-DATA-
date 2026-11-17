// =====================================================================
// DATAFLOW SOLUTIONS - SCRIPT DE QUERIES MONGODB
// SEMANA 28 - Banco de Dados (Prof. Pedro Yokada)
// Aluno: Bruno De Lima - Turma: 3° B
// =====================================================================

// Caso 1: Aplicação Web
// 3.1.1 Buscar um usuário pelo e-mail
db.users.findOne({ email: "ana.oliveira@email.com" });

// 3.1.2 Buscar usuários que tenham "música" como preferência
db.users.find({ preferencias: "música" });

// Caso 2: Big Data
// 3.2.1 Buscar todos os acessos de um usuário específico
db.logs.find({ usuario_id: "654321abcd" }).sort({ timestamp: -1 });

// 3.2.2 Contar quantos acessos foram feitos via dispositivos móveis
db.logs.countDocuments({ dispositivo: "mobile" });

// Alternativa via pipeline de agregação
db.logs.aggregate([
  { $match: { dispositivo: "mobile" } },
  { $count: "total_acessos_moveis" }
]);
