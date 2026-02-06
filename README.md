## 📋 Sobre o Projeto

O **PresençaQR** é um sistema desenvolvido para a UFAL (Universidade Federal de Alagoas) que permite o registro de presença de alunos em aulas através da leitura de QR Codes. O sistema oferece uma solução moderna e eficiente para substituir listas de presença tradicionais.

### Principais Funcionalidades

- 🔐 **Autenticação de usuários** (Alunos, Professores e Administradores)
- 📱 **Geração de QR Codes** para registro de presença
- 📷 **Leitura de QR Codes** via câmera do dispositivo
- 📊 **Relatórios de presença** detalhados
- 👥 **Gestão de cursos e turmas**
- 📝 **Controle de matrículas**
- 📍 **Validação por geolocalização** (distância do local da aula)

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

```
PresencaQR/
├── backend/          # API REST em FastAPI (Python)
└── frontend/         # Aplicação Web em React + Vite
```

## 🚀 Tecnologias Utilizadas

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **FastAPI** | Framework web moderno e de alta performance |
| **SQLAlchemy** | ORM para mapeamento objeto-relacional |
| **PostgreSQL** | Banco de dados relacional |
| **Pydantic** | Validação de dados e serialização |
| **PyJWT** | Autenticação via JSON Web Tokens |
| **Alembic** | Migrações de banco de dados |
| **WeasyPrint** | Geração de relatórios em PDF |
| **Geopy** | Cálculos de distância geográfica |

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca para construção de interfaces |
| **Vite** | Build tool e dev server |
| **React Router** | Roteamento da aplicação |
| **Bootstrap 5** | Framework CSS |
| **Axios** | Cliente HTTP |
| **react-qr-scanner** | Leitura de QR Codes |
| **qrcode.react** | Geração de QR Codes |

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Python 3.11+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (opcional, para o banco de dados)
- [PostgreSQL 16](https://www.postgresql.org/) (se não usar Docker)

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/PresencaQR.git
cd PresencaQR
```

### 2. Configuração do Backend

```bash
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows

# Instale as dependências
pip install -r requirements.txt
```

#### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Banco de dados
POSTGRES_DB=presencaqr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_aqui
DATABASE_URI=postgresql://postgres:sua_senha_aqui@localhost:5432/presencaqr

# JWT
SECRET_KEY=sua_chave_secreta_muito_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

#### Iniciando o Banco de Dados com Docker

```bash
docker-compose up -d
```

#### Executando as Migrações

```bash
alembic upgrade head
```

#### Iniciando o Servidor

```bash
uvicorn main:app
```

O backend estará disponível em: `http://localhost:8000`

### 3. Configuração do Frontend

```bash
cd frontend/qrcode-p3

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📚 Estrutura do Backend

```
backend/
├── main.py                 # Ponto de entrada da aplicação
├── requirements.txt        # Dependências Python
├── docker-compose.yaml     # Configuração do Docker
└── app/
    ├── api/                # Endpoints da API
    │   ├── attendance/     # Gestão de presenças
    │   ├── auth/           # Autenticação
    │   ├── class_session/  # Sessões de aula
    │   ├── course/         # Cursos/Disciplinas
    │   ├── enrollment/     # Matrículas
    │   ├── qrcode/         # Geração de QR Codes
    │   ├── student/        # Alunos
    │   ├── teacher/        # Professores
    │   └── users/          # Usuários
    ├── core/
    │   ├── security.py     # Funções de segurança
    │   ├── models/         # Modelos do banco de dados
    │   └── utils/          # Utilitários
    └── infra/
        ├── config.py       # Configurações
        └── db/             # Conexão com banco
```

## 📚 Estrutura do Frontend

```
frontend/qrcode-p3/
├── src/
│   ├── api.js              # Configuração do Axios
│   ├── App.jsx             # Componente principal
│   ├── AuthContext.jsx     # Contexto de autenticação
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── CardOption.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ScanFeedback/
│   └── pages/              # Páginas da aplicação
│       ├── LoginPage/
│       ├── StudentHomepage/
│       ├── TeacherHomepage/
│       ├── AdminHomepage/
│       ├── QrGenerator/
│       ├── QrReader/
│       └── ...
```

## 🔗 Endpoints da API

A documentação interativa da API está disponível em:
- **Swagger UI**: `http://localhost:8000/docs`

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/v1/api/auth/login` | Autenticação de usuário |
| POST | `/v1/api/auth/register` | Registro de novo usuário |
| GET | `/v1/api/courses` | Lista cursos |
| POST | `/v1/api/qrcode/generate` | Gera QR Code para aula |
| POST | `/v1/api/attendance` | Registra presença |
| GET | `/v1/api/attendance/history` | Histórico de presenças |

## 👥 Tipos de Usuário

O sistema possui três tipos de usuário:

1. **Aluno (Student)**: Pode ler QR Codes para registrar presença e visualizar seu histórico
2. **Professor (Teacher)**: Pode gerar QR Codes, gerenciar turmas e visualizar relatórios
3. **Administrador (Admin)**: Acesso completo ao sistema, gestão de usuários e cursos


## 🚢 Deploy

### Frontend
O frontend está configurado para deploy na **Vercel**.

### Backend
O backend pode ser hospedado em qualquer servidor que suporte Python/FastAPI (Railway, Render, AWS, etc.).