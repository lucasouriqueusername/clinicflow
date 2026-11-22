
"use strict";

// ClinicFlow - Configuração Supabase

const SUPABASE_URL = "https://ciyufqznlwauhfxggpsr.supabase.co";
const SUPABASE_KEY = "sb_publishable_AWSuEzjHxv13fCS0FiMlOw_Iq_k-jjK";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("message");

    console.log("Cliente Supabase inicializado!");
    message.textContent = "Cliente Supabase inicializado!";
});

async function testarConexao() {
    const { data, error } = await db
        .from("specialties")
        .select("id, name");

    if (error) {
        console.error("Erro na consulta:", error.message);
        return;
    }

    console.log("Especialidades encontradas:", data);
}

testarConexao();

// Login administrativo do ClinicFlow

const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.querySelector(
        'input[type="email"]'
    ).value;

    const password = loginForm.querySelector(
        'input[type="password"]'
    ).value;

    message.textContent = "Verificando acesso...";

    const { data, error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        message.textContent = "E-mail ou senha inválidos.";
        console.error("Falha na autenticação:", error.message);
        return;
    }

    const { data: admin, error: adminError } = await db
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (adminError || !admin) {
        await db.auth.signOut();
        message.textContent = "Usuário sem autorização administrativa.";
        return;
    }

    message.textContent = "Login realizado com sucesso!";
document.querySelector(".login-card").hidden = true;

const dashboard = document.getElementById("dashboard");
dashboard.hidden = false;
await carregarDashboard();
await carregarPacientes();
await carregarAgendamentos();
await carregarPacientesSelect();
await carregarMedicosSelect();
    console.log("Administrador autenticado!");
});

async function carregarDashboard() {
    const tabelas = [
        ["patients", "total-patients"],
        ["appointments", "total-appointments"],
        ["specialties", "total-specialties"]
    ];

    for (const [tabela, elementoId] of tabelas) {
        const elemento = document.getElementById(elementoId);

        if (!elemento) continue;

        const { count, error } = await db
            .from(tabela)
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error(`Erro em ${tabela}:`, error.message);
            elemento.textContent = "Erro";
            continue;
        }

        elemento.textContent = count;
    }
}

async function carregarPacientes() {
    const lista = document.getElementById("patients-list");

    lista.textContent = "Carregando pacientes...";

    const { data, error } = await db
        .from("patients")
        .select("id, name")
        .order("name", { ascending: true });

    if (error) {
        console.error("Erro ao buscar pacientes:", error.message);
        lista.textContent = "Erro ao carregar pacientes.";
        return;
    }

    lista.replaceChildren();

    if (data.length === 0) {
        lista.textContent = "Nenhum paciente cadastrado.";
        return;
    }

    for (const paciente of data) {
        const paragrafo = document.createElement("p");
        paragrafo.textContent = paciente.name;
        lista.appendChild(paragrafo);
    }
}

async function carregarAgendamentos() {
    const lista = document.getElementById("appointments-list");

    lista.textContent = "Carregando agendamentos...";

    const { data, error } = await db
        .from("appointments")
        .select(`
            id,
            start_at,
            status,
            patients(name),
            doctors(name)
        `)
        .order("start_at", { ascending: true });

    if (error) {
        console.error("Erro nos agendamentos:", error.message);
        lista.textContent = "Erro ao carregar agendamentos.";
        return;
    }

    lista.replaceChildren();

    if (data.length === 0) {
        lista.textContent = "Nenhum agendamento cadastrado.";
        return;
    }

    
const tabela = document.createElement("table");
tabela.style.width = "100%";
tabela.style.borderCollapse = "collapse";

const cabecalho = document.createElement("thead");
const linhaCabecalho = document.createElement("tr");

for (const titulo of ["Paciente", "Médico", "Data", "Status"]) {
  const th = document.createElement("th");
  th.textContent = titulo;
  th.style.padding = "12px";
  th.style.textAlign = "left";
  th.style.borderBottom = "2px solid #ddd";
  linhaCabecalho.appendChild(th);
}

cabecalho.appendChild(linhaCabecalho);
tabela.appendChild(cabecalho);

const corpo = document.createElement("tbody");

for (const agendamento of data) {
  const linha = document.createElement("tr");

  const dataFormatada = new Date(
    agendamento.start_at
  ).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
  });

  const valores = [
    agendamento.patients?.name ?? "Não encontrado",
    agendamento.doctors?.name ?? "Não encontrado",
    dataFormatada,
    {
      confirmed: "Confirmado",
      pending: "Pendente",
      cancelled: "Cancelado",
      completed: "Concluído",
      no_show: "Não compareceu"
    }[agendamento.status] ?? agendamento.status
  ];

  for (const valor of valores) {
    const td = document.createElement("td");
    td.textContent = valor;
    td.style.padding = "12px";
    td.style.borderBottom = "1px solid #ddd";
    linha.appendChild(td);
  }

  corpo.appendChild(linha);
}

tabela.appendChild(corpo);
lista.appendChild(tabela);

}

const patientForm = document.getElementById("patient-form");

patientForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("patient-name").value.trim();
    const phone = document.getElementById("patient-phone").value.replace(/\D/g, "");

    if (!name || phone.length !== 11) {
        alert("Informe um nome e um celular com DDD (11 dígitos).");
        return;
    }

    const { error } = await db
        .from("patients")
        .insert({
            name: name,
            phone: "+55" + phone,
            whatsapp_opt_in: false
        });

    if (error) {
        console.error("Erro ao cadastrar paciente:", error.message);
        alert("Não foi possível cadastrar: " + error.message);
        return;
    }

    alert("Paciente cadastrado com sucesso!");

    patientForm.reset();

    await carregarDashboard();
    await carregarPacientes();
});

async function carregarPacientesSelect() {
    const select = document.getElementById("appointment-patient");

    select.innerHTML =
        '<option value="">Selecione um paciente</option>';

    const { data, error } = await db
        .from("patients")
        .select("id, name")
        .order("name");

    if (error) {
        console.error("Erro ao carregar pacientes:", error.message);
        return;
    }

    for (const paciente of data) {
        const option = document.createElement("option");

        option.value = paciente.id;
        option.textContent = paciente.name;

        select.appendChild(option);
    }
}

async function carregarMedicosSelect() {
    const select = document.getElementById("appointment-doctor");

    select.innerHTML =
        '<option value="">Selecione um médico</option>';

    const { data, error } = await db
        .from("doctors")
        .select("id, name")
        .order("name");

    if (error) {
        console.error("Erro ao carregar médicos:", error.message);
        return;
    }

    for (const medico of data) {
        const option = document.createElement("option");

        option.value = medico.id;
        option.textContent = medico.name;

        select.appendChild(option);
    }
}




const appointmentForm = document.getElementById("appointment-form");

appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mensagem = document.getElementById("appointment-message");
    const botao = appointmentForm.querySelector('button[type="submit"]');

    const patientId = Number(document.getElementById("appointment-patient").value);
    const doctorId = Number(document.getElementById("appointment-doctor").value);
    const data = document.getElementById("appointment-date").value;
    const horario = document.getElementById("appointment-time").value;

    if (!patientId || !doctorId || !data || !horario) {
        mensagem.textContent = "Preencha todos os campos.";
        return;
    }

if (!horarioPermitido(data, horario)) {
    mensagem.textContent =
        "Horário indisponível! Escolha um dia útil, das 08:00 às 11:30 ou das 13:00 às 17:30, em intervalos de 30 minutos.";
    return;
}

    const inicio = new Date(`${data}T${horario}:00`);

    if (Number.isNaN(inicio.getTime())) {
        mensagem.textContent = "Data ou horário inválido.";
        return;
    }

    const fim = new Date(inicio.getTime() + 30 * 60 * 1000);

    botao.disabled = true;
    mensagem.textContent = "Salvando agendamento...";

    try {
        const { error } = await db
            .from("appointments")
            .insert({
                patient_id: patientId,
                doctor_id: doctorId,
                start_at: inicio.toISOString(),
                end_at: fim.toISOString(),
                status: "confirmed"
            });

        if (error) {
            console.error("Erro ao cadastrar agendamento:", error);

            if (error.code === "23P01") {
                mensagem.textContent = "Este médico já possui uma consulta nesse horário.";
            } else {
                mensagem.textContent = "Erro ao cadastrar: " + error.message;
            }
            return;
        }

        mensagem.textContent = "Agendamento cadastrado com sucesso!";
        appointmentForm.reset();

        await carregarDashboard();
        await carregarAgendamentos();

    } catch (erro) {
        console.error("Erro inesperado:", erro);
        mensagem.textContent = "Não foi possível concluir o agendamento.";
    } finally {
        botao.disabled = false;
    }
});

function horarioPermitido(data, hora) {
    const diaSemana = new Date(`${data}T12:00:00`).getDay();

    // Bloqueia sábados e domingos
    if (diaSemana === 0 || diaSemana === 6) {
        return false;
    }

    const [horas, minutos] = hora.split(":").map(Number);
    const totalMinutos = horas * 60 + minutos;

    const manha = totalMinutos >= 480 && totalMinutos <= 690;
    const tarde = totalMinutos >= 780 && totalMinutos <= 1050;

    const intervaloValido = minutos === 0 || minutos === 30;

    return (manha || tarde) && intervaloValido;
}

