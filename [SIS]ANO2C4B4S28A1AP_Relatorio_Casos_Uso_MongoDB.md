# Roteiro de Atividade Prática — Resolução Completa

**Componente Curricular:** Banco de Dados (NoSQL / MongoDB)  
**Título da Atividade:** Exploração de casos de uso e aplicações do MongoDB  
**Documento de Origem:** `[SIS]ANO2C4B4S28A1AP.docx`  
**Semana:** 28  

---

## 👤 Identificação do Aluno e Disciplina
- **Nome do Aluno:** Bruno De Lima
- **Turma:** 3° B
- **Professor:** Pedro Yokada
- **Matéria:** Banco de Dados
- **Data de Resolução:** 17/11/2026

---

## 1. Contextualização e Cenário da Atividade

A **DataFlow Solutions**, uma empresa de tecnologia focada em arquiteturas de microsserviços e processamento distribuído de alto desempenho, abriu um processo de avaliação técnica para determinar a viabilidade e os benefícios de adoção do **MongoDB** em dois de seus setores centrais:

1. **Setor de Aplicações Web:** Necessita de um banco de dados ágil para armazenar perfis de usuários, preferências dinâmicas e históricos heterogêneos de interações em tempo real.
2. **Setor de Big Data & Analytics:** Demanda uma solução para ingestão massiva e contínua de logs de acesso de milhões de dispositivos, com capacidade de expiração automática de dados antigos e agregações analíticas de alta velocidade.

Neste relatório técnico, definimos os esquemas de dados, justificamos a superioridade do modelo NoSQL orientado a documentos sobre os bancos relacionais tradicionais e resolvemos todas as consultas operacionais solicitadas.

---

## 2. Modelagem e Definição de Esquemas (JSON Schemas)

### 2.1 Caso 1: Aplicação Web — Coleção `users` (Perfis de Usuários)

A coleção `users` aproveita a natureza *schemaless* (esquema dinâmico) do MongoDB, incorporando dados polimórficos de preferências e interações diretamente no documento do usuário:

```json
{
  "_id": ObjectId("654321abcd7890ef12345678"),
  "nome": "Ana Oliveira",
  "email": "ana.oliveira@email.com",
  "data_cadastro": ISODate("2026-02-16T10:00:00Z"),
  "status_conta": "ativa",
  "preferencias": [
    "música",
    "tecnologia",
    "fotografia"
  ],
  "interacoes": [
    {
      "tipo": "like",
      "item": "artigo_123",
      "timestamp": ISODate("2026-02-16T10:14:00Z")
    },
    {
      "tipo": "comentário",
      "item": "post_456",
      "conteudo": "Excelente artigo, parabéns aos autores!",
      "timestamp": ISODate("2026-02-16T10:15:30Z")
    }
  ],
  "configuracoes": {
    "notificacoes_email": true,
    "tema": "escuro",
    "idioma": "pt-BR"
  }
}
```

---

### 2.2 Caso 2: Big Data — Coleção `logs` (Registros de Acesso de Alta Vazão)

A coleção `logs` foi estruturada de forma enxuta e atômica, otimizada para inserções de alta velocidade (*high-throughput write operations*) e suporte nativo a índices temporais (TTL):

```json
{
  "_id": ObjectId("abcdef123456789012345678"),
  "usuario_id": "654321abcd7890ef12345678",
  "acao": "login",
  "timestamp": ISODate("2026-02-16T10:15:30Z"),
  "dispositivo": "mobile",
  "sistema_operacional": "Android 14",
  "ip_origem": "189.120.45.12",
  "localizacao": {
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil"
  },
  "status_requisicao": 200,
  "latencia_ms": 42
}
```

---

## 3. Vantagens e Justificativas Técnicas do MongoDB

### 3.1 Vantagens para o Setor de Aplicações Web (Perfis de Usuários)

| Desafio no Modelo Relacional (SQL) | Vantagem com MongoDB (NoSQL) | Benefício Direto para a Aplicação Web |
| :--- | :--- | :--- |
| **Normalização Excessiva:** Exigiria 3 ou 4 tabelas separadas (`usuarios`, `preferencias`, `interacoes`, `configuracoes`) com chaves estrangeiras. | **Documentos Embutidos (*Embedded Documents*):** Todos os dados do perfil coabitam um único documento BSON. | **Velocidade de Leitura Máxima:** Carrega a tela do usuário em uma única consulta simples, eliminando múltiplos `JOINs` que degradam o servidor. |
| **Rigidez de Esquema (*Schema Rigidity*):** Adicionar um novo tipo de preferência ou configuração exige comando `ALTER TABLE`, bloqueando a tabela em produção. | **Flexibilidade Dinâmica:** Diferentes usuários podem possuir estruturas ligeiramente distintas sem necessidade de migrações complexas. | **Agilidade de Negócio:** Novas funcionalidades no front-end são lançadas instantaneamente sem parada de banco. |
| **Manipulação de Listas:** Requer tabelas associativas N:N (`usuario_preferencia`). | **Arrays Nativos com Multikey Index:** Arrays são tipos primitivos manipulados com operadores `$push`, `$addToSet` e `$pull`. | Código mais limpo e natural para desenvolvedores JavaScript/TypeScript. |

---

### 3.2 Vantagens para o Setor de Big Data (Análise de Logs)

1. **Alta Vazão de Inserção (*High Write Throughput*):** O MongoDB foi projetado para operações de gravação não bloqueantes com *WiredTiger Storage Engine*, suportando dezenas de milhares de logs por segundo sem engarrafamento.
2. **Índices TTL (Time-To-Live) Automáticos:** Em Big Data, reter logs indefinidamente estoura o armazenamento. No MongoDB, cria-se um índice TTL no campo `timestamp`:
   ```javascript
   // Remove automaticamente logs com mais de 90 dias
   db.logs.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 7776000 });
   ```
   O próprio banco limpa os dados velhos em segundo plano, sem necessidade de rotinas cron externas.
3. **Escalabilidade Horizontal via Sharding:** Conforme o volume de acessos cresce, a coleção `logs` pode ser particionada entre dezenas de nós físicos com chave hashada, mantendo o tempo de consulta constante.
4. **Poder Analítico com Aggregation Pipeline:** Permite cruzar bilhões de registros diretamente no banco usando processamento multithread nativo (`$match`, `$group`, `$bucketAuto`).

---

## 4. Resolução das Consultas MongoDB (Queries Operacionais)

Abaixo estão as consultas programadas para atender rigorosamente a cada demanda do roteiro, com explicação técnica de cada operador:

---

### 4.1 Aplicação Web — Consultas em Perfis de Usuários

#### Consulta 3.1.1: Buscar um usuário pelo e-mail
> **Pergunta do Roteiro:** *Qual operador do MongoDB permite encontrar um documento específico com base em um campo de valor único?*

**Código MongoDB:**
```javascript
db.users.findOne({ email: "ana.oliveira@email.com" });
```

**Explicação Técnica:**
- O método **`findOne()`** varre a coleção e encerra a execução assim que encontra a **primeira ocorrência** que satisfaz o critério de igualdade (`{ campo: valor }`), retornando diretamente um objeto JSON/BSON único (em vez de um cursor iterável).
- **Boa Prática:** Como o e-mail identifica unicamente o usuário no sistema, deve-se aplicar um índice único no campo:
  ```javascript
  db.users.createIndex({ email: 1 }, { unique: true });
  ```
  Isso transforma a consulta em uma busca indexada com complexidade $O(1)$, com tempo de resposta quase instantâneo (< 1 ms).

---

#### Consulta 3.1.2: Buscar usuários que tenham "música" como preferência
> **Pergunta do Roteiro:** *Considerando que "preferências" é uma lista dentro do documento, como buscar documentos cujo determinado valor está presente dentro dessa lista?*

**Código MongoDB:**
```javascript
db.users.find({ preferencias: "música" });
```

*Alternativa explícita utilizando operador de pertinência:*
```javascript
db.users.find({ preferencias: { $in: ["música"] } });
```

**Explicação Técnica:**
- No MongoDB, **não é necessário** utilizar comandos complexos ou desmembrar a lista para buscar itens dentro de um array. O MongoDB possui suporte nativo a arrays: quando você passa uma string escalar como critério de busca em um campo que é um array (`{ preferencias: "música" }`), ele **automaticamente itera pelos elementos da lista** e seleciona qualquer documento que contenha aquele valor exato entre seus itens.
- Esse mecanismo utiliza os chamados **Multikey Indexes**, garantindo altíssima performance mesmo em coleções com milhões de perfis cadastrados.

---

### 4.2 Big Data — Consultas em Logs de Acesso

#### Consulta 3.2.1: Buscar todos os acessos de um usuário específico
> **Pergunta do Roteiro:** *Cada log contém um campo que referencia um usuário específico. Como fazer uma consulta filtrando por esse campo?*

**Código MongoDB:**
```javascript
db.logs.find({ usuario_id: "654321abcd7890ef12345678" }).sort({ timestamp: -1 });
```

**Explicação Técnica:**
- A consulta utiliza o método **`find()`** passando no filtro o campo de referência externa `usuario_id`.
- Adicionou-se o método **`.sort({ timestamp: -1 })`** para que o histórico de acessos do usuário seja retornado em **ordem cronológica decrescente** (os acessos mais recentes aparecem primeiro).
- Para manter essa consulta rápida no setor de Big Data, cria-se o índice secundário:
  ```javascript
  db.logs.createIndex({ usuario_id: 1, timestamp: -1 });
  ```

---

#### Consulta 3.2.2: Contar quantos acessos foram feitos via dispositivos móveis
> **Pergunta do Roteiro:** *Como contar documentos no MongoDB e qual operador pode ser usado para verificar um valor específico dentro dos registros?*

**Solução Principal (Método Recomendado e Mais Rápido):**
```javascript
db.logs.countDocuments({ dispositivo: "mobile" });
```

**Solução Alternativa via Framework de Agregação:**
```javascript
db.logs.aggregate([
  { $match: { dispositivo: "mobile" } },
  { $count: "total_acessos_moveis" }
]);
```

**Explicação Técnica:**
- O método **`countDocuments()`** é a função moderna do MongoDB que contabiliza de forma precisa os documentos que correspondem ao filtro especificado, utilizando metadados de índices quando disponíveis.
- Na abordagem com **Pipeline de Agregação**:
  1. O estágio **`$match`** atua como filtro declarativo, selecionando apenas registros onde `dispositivo == "mobile"`;
  2. O estágio **`$count`** recebe o fluxo de documentos filtrados e emite um documento final contendo o valor numérico acumulado no campo customizado `total_acessos_moveis`.

---

## 5. Script Completo de Demonstração e Validação

Para validação prática imediata de todos os conceitos, estruturou-se o script executável em Node.js / `mongosh`:

```javascript
// =====================================================================
// DATAFLOW SOLUTIONS - SCRIPT DE POVOAMENTO E TESTE DE QUERIES MONGODB
// Aluno: Bruno De Lima | 3° B | Prof. Pedro Yokada
// =====================================================================

use dataflow_db;

// 1. Limpeza de coleções anteriores
db.users.drop();
db.logs.drop();

// 2. Inserção de dados de teste na coleção 'users'
db.users.insertMany([
  {
    nome: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    preferencias: ["música", "tecnologia"],
    interacoes: [
      { tipo: "like", item: "artigo_123" },
      { tipo: "comentário", item: "post_456", conteudo: "Ótimo post!" }
    ]
  },
  {
    nome: "Carlos Eduardo",
    email: "carlos.eduardo@email.com",
    preferencias: ["esportes", "games"],
    interacoes: [
      { tipo: "like", item: "artigo_999" }
    ]
  },
  {
    nome: "Mariana Souza",
    email: "mariana.souza@email.com",
    preferencias: ["música", "cinema", "literatura"],
    interacoes: []
  }
]);

// 3. Inserção de dados de teste na coleção 'logs'
db.logs.insertMany([
  {
    usuario_id: "654321abcd",
    acao: "login",
    timestamp: new Date("2026-02-16T10:15:30Z"),
    dispositivo: "mobile",
    localizacao: "São Paulo, Brasil"
  },
  {
    usuario_id: "654321abcd",
    acao: "visualizacao_artigo",
    timestamp: new Date("2026-02-16T10:17:00Z"),
    dispositivo: "mobile",
    localizacao: "São Paulo, Brasil"
  },
  {
    usuario_id: "998877efab",
    acao: "login",
    timestamp: new Date("2026-02-16T10:18:22Z"),
    dispositivo: "desktop",
    localizacao: "Curitiba, Brasil"
  },
  {
    usuario_id: "654321abcd",
    acao: "logout",
    timestamp: new Date("2026-02-16T10:30:10Z"),
    dispositivo: "mobile",
    localizacao: "São Paulo, Brasil"
  }
]);

print("\n--- TESTE 1: Buscar usuário por e-mail ---");
printjson(db.users.findOne({ email: "ana.oliveira@email.com" }));

print("\n--- TESTE 2: Buscar usuários com preferência 'música' ---");
printjson(db.users.find({ preferencias: "música" }).toArray());

print("\n--- TESTE 3: Buscar todos os acessos do usuário '654321abcd' ---");
printjson(db.logs.find({ usuario_id: "654321abcd" }).toArray());

print("\n--- TESTE 4: Contar acessos feitos via dispositivos móveis ---");
const totalMobile = db.logs.countDocuments({ dispositivo: "mobile" });
print("Total de acessos mobile:", totalMobile);
```

---

## 6. Conclusão

A avaliação técnica comprovou que o **MongoDB** é a escolha ideal tanto para o setor de aplicações web quanto para o setor de big data da DataFlow Solutions:
1. **No Front-End / Web:** A modelagem orientada a documentos reduz a latência e a complexidade do código de acesso aos dados, dispensando a sobrecarga de mapeamento relacional (ORM).
2. **No Big Data:** A capacidade nativa de ingestão veloz, expiração automática com índices TTL e escalabilidade distribuída via sharding garantem robustez operacional e custo controlado para o crescimento contínuo da empresa.
