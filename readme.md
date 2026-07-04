# 🛒 E-Commerce & Marketplace API (Node.js) — Projetado com Rigor, Codificado na Zuera

Este projeto consiste no desenvolvimento de uma API REST de e-commerce e marketplace construída do zero utilizando o ecossistema Node.js. Conduzido no formato **Full Cycle**, o projeto nasceu como um laboratório descontraído de estudos ("na zuera"), mas foi projetado, arquitetado e mantido sob o mais estrito rigor técnico e seriedade profissional.

O grande diferencial deste repositório não é apenas o código final, mas **como ele foi construído**. Ele é o resultado prático de uma mentoria dinâmica de Engenharia de Software, onde o desenvolvedor atuou como um investigador ativo de sistemas e os Agentes de IA operaram como professores assistentes de arquitetura.

---

## 🧠 A Dinâmica de Aprendizado: Aluno Crítico vs. Mentores de IA

O desenvolvimento não seguiu receitas prontas. Ele avançou através de ciclos onde o **Aluno trouxe a provocação de negócios e engenharia de sistemas**, e os **Professores de IA forneceram os blocos de infraestrutura e padrões de projeto**, sempre sob avaliação crítica do desenvolvedor.

### 💡 As Grandes Sacadas do Aluno (Os Diferenciais do Projeto)
Enquanto a IA sugeria os caminhos convencionais de desenvolvimento, o senso investigativo do desenvolvedor trouxe sacadas que mudaram o rumo do sistema:

1. **Desmistificação do Erro Postgres do Driver:** Diante de uma quebra misteriosa de runtime (`NamedPlaceholdersNotSupportedError`), o aluno identificou cirurgicamente que a raiz do problema estava no conflito de placeholders do driver do Postgres que não aceita variáveis nomeadas (padrão Oracle/MySQL), forçando a adoção pura de repositórios do ORM ou queries indexadas dinamicamente (`$1`, `$2`).
2. **Hibridismo de Negócios (A Sacada do Marketplace):** O aluno recusou o modelo engessado de Roles (onde um usuário é só comprador ou só vendedor). Ele propôs a sacada de que um usuário comum, em determinado momento, pode querer ativar seu modo vendedor sem perder o histórico ou permissão de comprador. Isso forçou uma mudança arquitetural para **RBAC + Claims**.
3. **O Isolamento Absoluto do Swagger:** Ao perceber que os endpoints sumiam devido a ambiguidades de execução no Linux, o aluno provocou a refatoração baseada em caminhos absolutos com o módulo nativo `path` do Node, tornando a documentação imune ao diretório de onde o comando global do sistema é disparado.

---

## 🗺️ As Fases de Aprendizado e Evolução

### 🏗️ Fase 0: Fundações Estruturadas pelos Professores de IA
Os mentores forneceram e auxiliaram na configuração do motor base do ecossistema:
* **Docker & Postgres:** Criação de um ambiente reprodutível e isolado.
* **TypeORM Limpo:** Configuração do `DataSource` nativo usando `EntitySchema` para manter o projeto legível em JavaScript puro, sem poluidores.
* **Segurança de Escopo:** Ingestão de variáveis com `dotenv` (limpas de aspas que quebravam o interpretador do driver) e proteção de origens de requisições com políticas finas de **CORS**.

### 🧩 Fase 1: Modelagem das Entidades Base e Relações Relacionais
Modelagem guiada dos quatro pilares fundamentais no diretório `src/entities/`:
* **Usuários (`User`) & Produtos (`Product`):** Estruturas com auto-incremento nativo (`generated: true`).
* **Pedido (`Pedido.js`) & Item do Pedido (`ItemPedido.js`):** Implementação de um relacionamento Muitos para Muitos (`N:M`) decomposto, com uma tabela pivô que congela o preço histórico do produto (`preco_unitario`) para blindar o faturamento contra oscilações futuras do catálogo.

### 🔑 Fase 2: Autenticação e Autorização Avançada (O Ecossistema de Claims)
Evolução da barreira de segurança da API utilizando middlewares encadeados em formato de linha de montagem:
* Uso de `bcrypt` para geração de hashes e segurança de senhas.
* Implementação do fluxo **OAuth2 com JWT Bearer Token** (`Authorization: Bearer <token>`).
* **O Diferencial de Autorização:** Criação de um middleware de autorização granular por **Claims** (`exigirClaim('vender')`), permitindo que um usuário transite organicamente entre comprar e expor itens no ecossistema sem quebrar as regras de segurança ou travar sua conta.

### 🛒 Fase 3: Lógica de Checkout Transacional (Regras ACID)
O ponto culminante do backend: o endpoint `POST /pedidos`.
* Gerenciamento manual de transações usando `QueryRunner` do TypeORM.
* O sistema abre a transação, checa atomicamente o estoque do produto, decrementa a quantidade e, em caso de inconsistência ou falta de itens, executa um **Rollback** completo, garantindo a integridade do banco de dados contra condições de corrida (*race conditions*).

---

## 🛠️ Arquitetura de Pastas de Alta Coesão

A fim de suportar o crescimento para o Frontend, o projeto separa estritamente a escuta das rotas, os filtros middleware e as regras de negócio através do padrão **Controller**:

```text
src/
├── config/
│   ├── database.js     # Inicialização do TypeORM
│   ├── swagger.js      # Configuração do Swagger
│   └── passport.js     # Estratégias de login social / OAuth2
├── entities/           # Mapeamento de tabelas (EntitySchema)
│   ├── Produto.js
│   ├── User.js
│   ├── Pedido.js
│   └── ItemPedido.js
├── controllers/        # Orquestradores de Regras de Negócio (req, res)
│   ├── produto.controller.js
│   └── pedido.controller.js
├── middlewares/        # Interceptadores (Autenticação JWT, Logs, Claims)
│   └── auth.middleware.js
├── routes/             # Definição dos caminhos HTTP e anotações Swagger JSDoc
│   ├── produto.routes.js
│   ├── pedido.routes.js
│   └── auth.routes.js
└── app.js              # Inicialização do Express e middlewares globais