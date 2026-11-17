# SEMANA 28 — Banco de Dados (NoSQL / MongoDB)

**Docente:** Prof. Pedro Yokada  
**Estudante:** Bruno De Lima  
**Turma:** 3° B  
**Componente:** Banco de Dados  

---

## 📋 Atividade da Semana
- **Documento Oficial:** `[SIS]ANO2C4B4S28A1AP.docx`
- **Tema:** *Exploração de casos de uso e aplicações do MongoDB*
- **Arquivo de Resolução:** [`[SIS]ANO2C4B4S28A1AP_Relatorio_Casos_Uso_MongoDB.md`](file:///C:/Users/BrunoDeLima/Desktop/IA/BD/SEMANA%2028/%5BSIS%5DANO2C4B4S28A1AP_Relatorio_Casos_Uso_MongoDB.md)
- **Script com as Queries:** [`queries_dataflow.js`](file:///C:/Users/BrunoDeLima/Desktop/IA/BD/SEMANA%2028/queries_dataflow.js)

---

## 📌 Conteúdos Principais Desenvolvidos
1. **Modelagem de Dados:** Criação de schemas JSON para aplicações web (`users` com arrays aninhados e polimorfismo) e big data (`logs` de alta vazão para séries temporais).
2. **Análise Comparativa:** Justificativa da superioridade do MongoDB sobre RDBMS em leitura de objeto único sem `JOINs` e ingestão em massa.
3. **Resolução de Consultas Operacionais:**
   - Busca pontual por e-mail com `findOne()`.
   - Consulta nativa em arrays com `preferencias: "música"` e suporte a Multikey Indexes.
   - Histórico ordenado de logs por usuário (`usuario_id` com sort em `timestamp`).
   - Contagem precisa de acessos mobile via `countDocuments()` e agregação com `$match` e `$count`.
