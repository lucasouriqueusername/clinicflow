
# ClinicFlow — Sistema de Gestão Clínica

Projeto desenvolvido como desafio técnico para uma vaga de Desenvolvedor Web.

O ClinicFlow é uma aplicação demonstrativa de gestão clínica, com cadastro de pacientes, agendamentos de consultas, autenticação administrativa e processamento automatizado de lembretes.

## Tecnologias utilizadas

- HTML5, CSS3 e JavaScript
- Supabase — autenticação e banco de dados PostgreSQL
- Make — automação de processos
- GitHub Pages — hospedagem das páginas
- WhatsApp Cloud API — integração experimental

## Demonstrações

### Sistema 01 — Gestão de pacientes e agendamentos

https://lucasouriqueusername.github.io/clinicflow/admin.html

Funcionalidades implementadas:

- Autenticação de usuários administrativos
- Cadastro de pacientes
- Listagem de pacientes
- Cadastro de agendamentos
- Listagem de consultas
- Associação entre pacientes, médicos e especialidades
- Persistência dos dados no Supabase

Os cadastros e a autenticação foram testados na versão publicada.

O acesso para avaliação utiliza uma conta demonstrativa separada. As credenciais são fornecidas pelo canal de candidatura.

### Sistema 02 — Lembretes de consultas

https://lucasouriqueusername.github.io/clinicflow/lembretes.html

O sistema registra lembretes associados aos agendamentos, com previsão de processamento 24 horas antes da consulta.

Arquitetura implementada:

1. O agendamento é registrado no Supabase.
2. Um lembrete é gerado no banco de dados.
3. O Make consulta e processa os registros elegíveis.
4. O processamento simulado atualiza o status do lembrete no Supabase.

Testes realizados:

- Geração de lembrete vinculada ao agendamento
- Execução do cenário no Make
- Requisição HTTP com resposta 204
- Atualização do status para `sent`
- Registro de processamento simulado

A página pública apresenta uma demonstração visual independente. O botão de simulação não executa o cenário Make nem altera o banco de dados.

O status `sent` representa o processamento simulado e não comprova entrega de mensagem ao paciente.

### Fluxo WhatsApp — Protótipo conversacional

https://lucasouriqueusername.github.io/clinicflow/whatsapp.html

Protótipo interativo desenvolvido em JavaScript, com:

- Menu inicial de atendimento
- Consulta de especialidades
- Seleção de médico
- Informações sobre horários de atendimento
- Demonstração de continuidade do agendamento

O protótipo executa no navegador. Não consulta o banco de dados, não cria agendamentos e não envia mensagens pelo WhatsApp.

A integração com a WhatsApp Cloud API foi investigada utilizando o ambiente de testes da Meta. O envio real não foi validado devido à restrição identificada pelo código de erro 130497.

## Arquitetura

Painel administrativo
→ Supabase Auth
→ Banco de dados PostgreSQL

Agendamentos
→ Geração de lembretes
→ Supabase
→ Make
→ Processamento simulado

Protótipo WhatsApp
→ JavaScript no navegador
→ Respostas demonstrativas

## Regras de negócio

- Clínica multiespecialidades
- Um médico por especialidade na demonstração
- Consultas de 30 minutos
- Atendimento de segunda a sexta-feira
- Horário: 08h às 12h e 13h às 18h
- Lembretes programados para 24 horas antes

## Segurança e dados

- Autenticação administrativa pelo Supabase Auth
- Row Level Security habilitada nas tabelas públicas do projeto
- Verificação de autorização administrativa pela tabela `admin_users`
- Dados fictícios utilizados para demonstração

A habilitação de RLS não substitui uma auditoria completa das políticas de acesso.

## Como avaliar

1. Acesse o Sistema 01.
2. Entre com as credenciais de demonstração fornecidas na candidatura.
3. Consulte os pacientes e agendamentos existentes.
4. Cadastre um paciente fictício.
5. Crie um agendamento de teste.
6. Acesse o Sistema 02 para conhecer a arquitetura dos lembretes.
7. Acesse o protótipo WhatsApp para experimentar o fluxo conversacional.

## Limitações conhecidas

- O envio real de mensagens pela WhatsApp Cloud API não foi concluído.
- A interface de lembretes é uma demonstração independente da automação Make.
- O protótipo conversacional não possui integração com o Supabase.
- O projeto é uma prova de conceito, não um sistema pronto para utilização com dados médicos reais.

## Objetivo

Demonstrar desenvolvimento web, autenticação, modelagem de dados, integração entre serviços, automação de processos e capacidade de implementação e testes de uma aplicação funcional.
