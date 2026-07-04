O arquivo Markdown completo para a documentação do seu projeto Node.js foi estruturado com base em todas as referências fornecidas, organizando o progresso atual, a arquitetura de pastas e os próximos passos de forma clara e profissional.

O conteúdo do seu arquivo `README.md` está pronto e estruturado abaixo:

```markdown
# 🛒 E-Commerce API (Node.js)

Este projeto consiste no desenvolvimento de uma API REST completa para um e-commerce do zero, utilizando o ecossistema Node.js. O objetivo principal é consolidar conhecimentos práticos em arquitetura de software, modelagem de dados avançada, segurança e gerenciamento de infraestrutura em containers.

A construção desta aplicação impõe desafios reais de regras de negócio complexas (como gerenciamento de estoque concorrente e checkout transacional) e segurança (autenticação e autorização baseada em papéis).

---

## 📊 Estado Atual do Projeto (Fundações Concluídas)

O motor e a infraestrutura base da aplicação já estão totalmente construídos e operacionais:

* **Infraestrutura:** Container PostgreSQL isolado e rodando via Docker.
* **Segurança de Ambiente:** Configuração de arquivos `.env` para proteção de credenciais, livre de aspas e integrada ao processo do Node.js.
* **Mapeamento de Dados (ORM):** Integração com o TypeORM (`DataSource`) utilizando `EntitySchema` em JavaScript puro, com sincronização automática ativa para o ambiente de desenvolvimento (`synchronize: true`).
* **Documentação Dinâmica:** Swagger configurado de forma modular usando caminhos absolutos, pronto para leitura de metadados em JSDoc, incluindo o esquema de cadeado global (`Authorize`) para o padrão OAuth2 / JWT Bearer.
* **Middlewares Globais e de Filtro:** Ingestão de logs com `morgan`, parsing de JSON nativo, isolamento de políticas de segurança de origem com `CORS`, criptografia com `bcrypt` e interceptador de tokens via `Passport.js` com validação manual JWT.

---

## 🗺️ Trilha de Evolução do Sistema

O desenvolvimento da camada de negócio e regras do e-commerce agora se divide em três fases lógicas e sequenciais:

### 🧩 Fase 1: Modelagem das Entidades Essenciais
Modelagem e criação dos esquemas ausentes no banco de dados através do `EntitySchema` do TypeORM para os quatro pilares fundamentais no diretório `src/entities/`:
* **Usuários (`User`):** Clientes e administradores (já construído).
* **Produtos (`Product`):** O catálogo de itens com id, nome, descrição, preço e estoque (já construído).
* **Pedido (`Pedido.js`):** Tabela que guarda o cabeçalho e metadados da compra (id, data, valor_total, id_usuario).
* **Item do Pedido (`ItemPedido.js`):** Tabela pivô que resolve o relacionamento de muitos-para-muitos (`N:M`) entre Pedidos e Produtos (guarda id, id_pedido, id_produto, quantidade e preco_unitario no momento da venda).

### 🔑 Fase 2: Autenticação e Autorização (Middlewares)
Aplicação de regras de acesso e controle granular nas rotas da API:
* Criação de rotas de `POST /auth/register` e `POST /auth/login`.
* Uso do pacote `bcrypt` para criptografar e salvar as senhas de forma segura no banco de dados.
* Geração e validação de **JWT (JSON Web Tokens)**.
* Criação de middleware de autorização baseado em perfis (**Roles**), garantindo que apenas usuários do tipo **Admin** possam gerenciar o catálogo (ex: criar novos produtos via `POST /produtos`), enquanto usuários do tipo **Cliente** possam apenas listá-los.

### 🛒 Fase 3: Lógica de Carrinho e Estoque (Regras de Negócio)
Implementação do endpoint crítico de checkout (`POST /pedidos`), onde o fluxo operacional deve ser totalmente seguro:
1. Receber a lista de IDs de produtos e suas respectivas quantidades desejadas.
2. Abrir uma **transação isolada** no banco de dados.
3. Verificar a disponibilidade de estoque real para cada item selecionado.
4. Decrementar o estoque dos produtos e consolidar o registro do Pedido e seus respectivos Itens.

---

## 🛠️ Arquitetura de Pastas Avançada

A fim de suportar a escalabilidade do projeto e separar a responsabilidade de escuta das rotas das regras de negócio e manipulação do banco, adota-se a refatoração para o padrão **Controller**:

```text
src/
├── config/
│   ├── database.js     # Inicialização do TypeORM
│   └── swagger.js      # Configuração do Swagger
├── entities/           # Esquemas (EntitySchema) do banco de dados
│   ├── Produto.js
│   ├── Usuario.js
│   ├── Pedido.js
│   └── ItemPedido.js
├── controllers/        # Intermediários que lidam com req e res (regras de rota)
│   └── produto.controller.js
├── middlewares/        # Filtros (autenticação, logs, validações de acesso)
│   └── auth.middleware.js
├── routes/             # Definição dos caminhos HTTP e Swagger JSDoc
│   ├── produto.routes.js
│   └── auth.routes.js
└── app.js