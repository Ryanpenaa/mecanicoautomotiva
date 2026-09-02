// ============================================================
// CONFIGURAÇÃO CENTRAL DA OFERTA
// Edite tudo por aqui: textos, preços, links, bônus, instrutor.
// ============================================================

export const CHECKOUT = {
  BASIC_CHECKOUT_URL: "https://pay.cakto.com.br/339576x_1048069",
  PRO_CHECKOUT_URL: "https://pay.cakto.com.br/n4bjvfn",
  // Upsell exibido ao clicar no Plano Básico: Profissional com desconto.
  UPSELL_PRO_CHECKOUT_URL: "https://pay.cakto.com.br/r92su3a",
};

export const UPSELL = {
  ativo: true,
  badge: "OFERTA ESPECIAL",
  headline: "Espere! Só mais 1 minuto",
  subheadline:
    "Antes de finalizar pelo Plano Básico, que tal levar a formação completa com desconto?",
  precoOriginal: "R$27,90",
  precoOferta: "R$18,90",
  economia: "R$9,00",
  vantagem: "Por apenas R$8,90 a mais que o Básico, você leva certificado, materiais de apoio, guias e os 10 bônus.",
  ctaAceitar: "QUERO O PROFISSIONAL POR R$18,90",
  ctaRecusar: "Não, quero só o Básico por R$10,00",
};

export const PRODUTO = {
  nome: "Formação Mecânico Automotivo",
  totalAulas: "80+",
  headline:
    "Aprenda Mecânica Automotiva do Zero e Desenvolva uma Habilidade Para a Vida",
  subheadline:
    "Mais de 80 aulas em vídeo, organizadas passo a passo, para você começar mesmo sem nenhuma experiência anterior.",
  ctaPrincipal: "QUERO COMEÇAR AGORA",
  microtexto: "Acesso imediato • Compra segura • Garantia de 7 dias",
};

export const DESTAQUES_HERO = [
  "80+ AULAS EM VÍDEO",
  "ACESSO VITALÍCIO",
  "ACESSO IMEDIATO",
  "CERTIFICADO NO PLANO PROFISSIONAL",
];

export const BENEFICIOS = [
  {
    icone: "video",
    titulo: "80+ aulas em vídeo",
    texto: "Um acervo completo de aulas para assistir na ordem que preferir.",
  },
  {
    icone: "list",
    titulo: "Conteúdo organizado",
    texto: "Trilha estruturada do básico ao avançado, sem aulas soltas.",
  },
  {
    icone: "wrench",
    titulo: "Aulas práticas",
    texto: "Foco em demonstrações e procedimentos aplicados ao dia a dia.",
  },
  {
    icone: "infinity",
    titulo: "Acesso vitalício",
    texto: "Estude no seu tempo e volte às aulas sempre que precisar.",
  },
  {
    icone: "devices",
    titulo: "Celular ou computador",
    texto: "Plataforma online: estude do celular, tablet ou notebook.",
  },
  {
    icone: "badge",
    titulo: "Certificado no Plano Profissional",
    texto: "Certificado profissionalizante disponível no plano completo.",
  },
];

export const PARA_QUEM = [
  "Quem nunca trabalhou com mecânica",
  "Quem quer aprender uma nova habilidade",
  "Pessoas interessadas em trabalhar na área automotiva",
  "Auxiliares e ajudantes de oficina",
  "Quem deseja ampliar seus conhecimentos sobre carros",
  "Quem quer entender melhor a manutenção do próprio veículo",
];

export const JORNADA = [
  {
    numero: "01",
    titulo: "FUNDAMENTOS",
    texto: "Entenda os princípios básicos da mecânica automotiva.",
  },
  {
    numero: "02",
    titulo: "SISTEMAS",
    texto: "Conheça os principais sistemas e componentes do veículo.",
  },
  {
    numero: "03",
    titulo: "MANUTENÇÃO",
    texto: "Aprenda conceitos e procedimentos relacionados à manutenção.",
  },
  {
    numero: "04",
    titulo: "DIAGNÓSTICO",
    texto:
      "Desenvolva conhecimentos para identificar problemas e compreender processos de diagnóstico.",
  },
  {
    numero: "05",
    titulo: "APLICAÇÃO",
    texto: "Transforme o conhecimento estudado em uma habilidade prática.",
  },
];

// Materiais do Plano Profissional. Edite/renomeie conforme o que for confirmado.
export const MATERIAIS = [
  "Aulas em vídeo",
  "Materiais de apoio",
  "Apostilas",
  "Guias",
  "Checklists",
  "Materiais complementares",
];

// BÔNUS — preencher com os nomes e descrições reais quando definidos.
export const BONUS: { titulo: string; descricao: string }[] = [
  { titulo: "[Bônus 1 — a definir]", descricao: "[Descrição do bônus]" },
  { titulo: "[Bônus 2 — a definir]", descricao: "[Descrição do bônus]" },
  { titulo: "[Bônus 3 — a definir]", descricao: "[Descrição do bônus]" },
];

export const MOTIVOS = [
  "Cuidar melhor do próprio veículo",
  "Compreender problemas mecânicos com mais clareza",
  "Desenvolver uma nova habilidade prática",
  "Buscar oportunidades na área automotiva",
  "Futuramente utilizar o conhecimento em serviços, conforme experiência e prática",
];

export const PLANOS = {
  basico: {
    titulo: "Plano Básico",
    subtitulo: "Para quem quer começar",
    precoAncora: "", // opcional: ex. "R$47,00"
    preco: "R$10,00",
    itens: [
      "80+ aulas em vídeo",
      "Conteúdo 100% online",
      "Acesso imediato",
      "Acesso vitalício",
    ],
    naoInclui: ["Certificado", "Materiais complementares", "Bônus"],
    cta: "COMEÇAR PELO BÁSICO",
    url: CHECKOUT.BASIC_CHECKOUT_URL,
  },
  profissional: {
    badge: "MAIS VENDIDO",
    titulo: "Plano Profissional",
    subtitulo: "Formação completa + materiais",
    precoAncora: "", // opcional: ex. "R$97,00"
    preco: "R$27,90",
    itens: [
      "80+ aulas em vídeo",
      "Certificado profissionalizante",
      "Acesso vitalício",
      "Acesso imediato",
      "Materiais de apoio",
      "Bônus exclusivos",
      "Guias complementares",
    ],
    cta: "QUERO O PLANO PROFISSIONAL",
    url: CHECKOUT.PRO_CHECKOUT_URL,
    diferenca: "R$17,90",
    recomendacao:
      "Nossa recomendação para quem quer aproveitar a formação completa.",
  },
};

export const GARANTIA = {
  titulo: "7 DIAS DE GARANTIA",
  texto:
    "Você pode avaliar o conteúdo dentro do período de garantia e solicitar reembolso conforme as condições da compra.",
};

import instrutorFoto from "@/assets/opt/instrutor.webp";

export const INSTRUTOR = {
  titulo: "Conheça seu Instrutor",
  nome: "João Emanuel",
  foto: instrutorFoto,
  bio: "Profissional da área automotiva com 16 anos de experiência no mercado, João Emanuel reúne conhecimento prático em mecânica, manutenção e diagnóstico de veículos.",
  experiencia:
    "Nesta formação, ele compartilha esse conhecimento de forma simples, direta e passo a passo, pensando especialmente em quem está começando do zero.",
  selos: ["16 anos de experiência", "Conteúdo prático", "Ensino direto"],
};

// DEPOIMENTOS — inserir apenas provas reais.
export const DEPOIMENTOS: { nome: string; texto: string; foto?: string }[] = [];

export const FAQ = [
  {
    p: "Preciso ter experiência para começar?",
    r: "Não. A formação foi pensada para quem está começando do zero, com aulas organizadas em uma sequência progressiva.",
  },
  {
    p: "Como recebo o acesso?",
    r: "O acesso é liberado imediatamente após a confirmação da compra, de forma 100% online.",
  },
  {
    p: "Posso assistir pelo celular?",
    r: "Sim. As aulas podem ser assistidas pelo celular, tablet ou computador.",
  },
  {
    p: "Por quanto tempo tenho acesso?",
    r: "O acesso é vitalício: você pode rever as aulas sempre que precisar.",
  },
  {
    p: "O curso possui certificado?",
    r: "O certificado profissionalizante está incluído no Plano Profissional.",
  },
  {
    p: "Qual a diferença entre o Básico e o Profissional?",
    r: "O Básico dá acesso às 80+ aulas em vídeo, com acesso imediato e vitalício. O Profissional inclui tudo isso e ainda certificado profissionalizante, materiais de apoio, guias complementares e bônus exclusivos.",
  },
  {
    p: "Como funciona a garantia de 7 dias?",
    r: "Você pode avaliar o conteúdo dentro do período de garantia e solicitar reembolso conforme as condições da compra.",
  },
];

export const CTA_FINAL = {
  headline: "Comece hoje a desenvolver uma nova habilidade",
  subheadline:
    "Acesse a Formação Mecânico Automotivo e comece suas primeiras aulas.",
  cta: "QUERO COMEÇAR AGORA",
  microtexto: "Acesso imediato • Acesso vitalício • Garantia de 7 dias",
};

export const VIDEO_DEMO = {
  driveId: "1kSXal8z-oqUNp_nJumUQBsx0JmnXvDdb",
  titulo: "Como adquirir",
  subheadline: "Veja como ter acesso ao Curso",
  descricao:
    "Assista ao vídeo rápido e veja o passo a passo para acessar a plataforma e começar a estudar.",
};
