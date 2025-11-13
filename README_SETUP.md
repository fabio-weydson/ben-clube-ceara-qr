# Member QR Code Validation - Setup

## Descrição

Aplicação React + TypeScript + Tailwind CSS para validação de membros via QR Code token integrado com Supabase.

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-publica-anon
```

### 3. Configurar Supabase

Execute o seguinte SQL no seu banco Supabase:

```sql
create table public.members (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  cpf_dni varchar(20) unique not null,
  email varchar(120) unique,
  phone varchar(20),
  address text,
  join_date date default current_date,
  expiration_date date,
  status text check (status in ('active', 'inactive', 'pending', 'expired')) default 'pending',
  qr_code_token varchar(100) unique not null,
  last_qr_validation timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS (Row Level Security)
alter table public.members enable row level security;

-- Política para leitura pública (necessário para validação)
create policy "Enable read access for all users" on public.members
  for select using (true);

-- Política para atualização (last_qr_validation)
create policy "Enable update for service role" on public.members
  for update using (true);
```

### 4. Rodar o projeto

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Uso

Acesse a aplicação com o token na URL:

```
http://localhost:3000?token=SEU_TOKEN_AQUI
```

## Estrutura do Projeto

```
src/
├── components/
│   └── MemberValidation.tsx   # Componente principal de validação
├── lib/
│   └── supabase.ts             # Cliente Supabase
├── types/
│   └── member.ts               # Tipos TypeScript
├── App.tsx                     # Componente raiz
└── index.css                   # Estilos Tailwind
```

## Funcionalidades

- ✅ Validação de membro via QR Code token
- ✅ Exibição de dados do membro (nome, CPF/DNI, email, telefone, datas)
- ✅ Indicadores visuais de status (Ativo, Inativo, Pendente, Expirado)
- ✅ Atualização automática de `last_qr_validation`
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Tema azul dominante
- ✅ Estados de loading e erro

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `build/`.
