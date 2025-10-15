
//C:\repository\proj-full-stack-backend\src\config\imagens.ts

// Lista de imagens padrão do sistema (default library)
// Essas imagens serão criadas no banco caso não existam

// =============================
// Biblioteca de Imagens Padrão
// =============================
// Este arquivo contém todos os registros padrão (default) de imagens
// que serão inseridos no banco caso não existam.
// Também serve como referência para atualização local ao descompactar arquivos novos.

export enum ArqTipo {
  DEFAULT = 'default',
  LOGO = 'logo',
  PAINEL = 'painel',
  AVATAR = 'avatar',
  BOTAO = 'botao',
}

export enum ArqAcao {
  VISUALIZA = 'visualiza',
  CADASTRO = 'cadastro',
  INCLUSAO = 'inclusao',
  ALTERACAO = 'alteracao',
  EXCLUSAO = 'exclusao',
  LISTAGEM = 'listagem',
  HELP = 'help',
}

export interface RequiredImagem {
  arqNome: string;
  arqTipo: ArqTipo;
  arqAcao: ArqAcao;
  arqPage?: string | null;
  arqPath: string;
  id_default: number;
  createdBy: number;
  updatedBy: number;
}

// =============================
// 📁 Defaults (id_default = 1)
// =============================

const defaultPath = 'C:/SysBordados/default';

const defaultImagens: RequiredImagem[] = [
  {
    arqNome: 'logo_default.svg',
    arqTipo: ArqTipo.DEFAULT,
    arqAcao: ArqAcao.VISUALIZA,
    arqPage: null,
    arqPath: `${defaultPath}/logo_default.svg`,
    id_default: 1,
    createdBy: 0,
    updatedBy: 0,
  },
  {
    arqNome: 'painel_default.svg',
    arqTipo: ArqTipo.DEFAULT,
    arqAcao: ArqAcao.VISUALIZA,
    arqPage: null,
    arqPath: `${defaultPath}/painel_default.svg`,
    id_default: 1,
    createdBy: 0,
    updatedBy: 0,
  },
  {
    arqNome: 'avatar_default.svg',
    arqTipo: ArqTipo.DEFAULT,
    arqAcao: ArqAcao.VISUALIZA,
    arqPage: null,
    arqPath: `${defaultPath}/avatar_default.svg`,
    id_default: 1,
    createdBy: 0,
    updatedBy: 0,
  },
  {
    arqNome: 'help_default.svg',
    arqTipo: ArqTipo.DEFAULT,
    arqAcao: ArqAcao.VISUALIZA,
    arqPage: null,
    arqPath: `${defaultPath}/help_default.svg`,
    id_default: 1,
    createdBy: 0,
    updatedBy: 0,
  },
  {
    arqNome: 'btn_default.svg',
    arqTipo: ArqTipo.DEFAULT,
    arqAcao: ArqAcao.VISUALIZA,
    arqPage: null,
    arqPath: `${defaultPath}/btn_default.svg`,
    id_default: 1,
    createdBy: 0,
    updatedBy: 0,
  },
];

// =============================
// ✨ Exporta lista consolidada
// =============================

export const requiredImagens: RequiredImagem[] = [
  ...defaultImagens,
  // ... aqui você pode adicionar outras listas, como systablesImagens, pessoasImagens, etc.
];





















// export interface RequiredImagem {
//   arqNome: string;
//   arqTipo: 'default' | 'logo' | 'painel' | 'avatar' | 'botao';
//   arqAcao: 'visualiza' |'cadastro' | 'inclusao' | 'alteracao' | 'exclusao' | 'listagem' | 'help';
//   arqPage?: string | null;
//   arqPath: string;
//   id_default: number;
//   createBy: number;
//   updateBy: number;
// }

// export const requiredImagens: RequiredImagem[] = [
// //////////////// id defaults painel
//     {
//     arqNome: 'logo_default.svg',
//     arqTipo: 'default',
//     arqAcao: 'visualiza',
//     arqPage: null,
//     arqPath: 'C:/SysBordados/default/logo_default.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'painel_default.svg',
//     arqTipo: 'default',
//     arqAcao: 'visualiza',
//     arqPage: null,
//     arqPath: 'C:/SysBordados/default/painel_default.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'avatar_default.svg',
//     arqTipo: 'default',
//     arqAcao: 'visualiza',
//     arqPage: null,
//     arqPath: 'C:/SysBordados/default/avatar_default.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'help_defaul.svg',
//     arqTipo: 'default',
//     arqAcao: 'visualiza',
//     arqPage: null,
//     arqPath: 'C:/SysBordados/default/help_default.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'btn_default.svg',
//     arqTipo: 'default',
//     arqAcao: 'visualiza',
//     arqPage: null,
//     arqPath: 'C:/SysBordados/default/btn_default.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },

//   /////systables///////////////////
//   {
//     arqNome: 'logo_systables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadsystables.svg',
//     id_default: 2,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incsystables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incsystables.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altsystables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excsystables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excsystables.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstsystables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstsystables.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpsystables.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpsystables',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpsystables.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   ////pessoas/////////////////////////////
//   {
//     arqNome: 'logo_pessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadpessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incpessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incpessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altpessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altpessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excpessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excpessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstpessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstpessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstpessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlppessoas.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlppessoas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlppessoas.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   ////empresas///////////////////////////
//   {
//     arqNome: 'logo_empresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadempresas',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incempresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incempresa',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altempresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altempresa',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excempresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excempresa',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstempresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstempresa',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpempresa.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpempresa',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpempresa.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },

//   ////consumidores/////////////////////////////////
//   {
//     arqNome: 'logo_consumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incconsumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altconsumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excconsumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstconsumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpconsumidores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpconsumidores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpconsumidores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ////clientes//////////////////////////
//   {
//     arqNome: 'logo_clientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incclientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altclientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excclientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstclientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpclientes.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpclientes',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpclientes.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ///fornecedores///////////////////////////////
//   {
//     arqNome: 'logo_fornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incfornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altfornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excfornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstfornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpfornecedores.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpfornecedores',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpfornecedores.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ///////funcionarios//////////////////////
//   {
//     arqNome: 'logo_funcionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incfuncionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altfuncionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excfuncionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstfuncionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpfuncionarios.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpfuncionarios',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpfuncionarios.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   /////imagens///////////////////////////////
//   {
//     arqNome: 'logo_imagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incimagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altimagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excimagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstimagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpimagens.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpimagens',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpimagens.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   ////estados//////////////////////////////
//     {
//     arqNome: 'logo_estados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_estados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ///cidades///////////////////////
//   {
//     arqNome: 'logo_cidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadcidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_inccidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'inccidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_inccidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altcidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altcidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altcidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_exccidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'exccidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_exccidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstcidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstcidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstcidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpcidades.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpcidades',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpcidades.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },  
// ///cadastros/////////////////////////
//   {
//     arqNome: 'logo_cadastros.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadcadastros',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_cadastros.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpestados.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpestados',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpestados.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ////emails/////////////////////////////////  
//   {
//     arqNome: 'logo_emails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cademails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_emails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incemails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incemails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incemails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altemails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altemails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altemails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excemails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excemails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excemails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstemails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstemails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstemails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpemails.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpemails',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpemails.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   ////fones////////////////////////////////////
//   {
//     arqNome: 'logo_fones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'cadfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_fones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incfones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incfones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altfones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altfones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excfones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excfones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstfones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstfones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpfones.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpfones',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpfones.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   //////docs////////////////////////////////////////
//   {
//     arqNome: 'logo_docs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'cadastro',
//     arqPage: 'caddocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_docs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_incdocs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'inclusao',
//     arqPage: 'incdocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_incdocs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_altdocs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'alteracao',
//     arqPage: 'altdocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_altdocs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_excdocs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'exclusao',
//     arqPage: 'excdocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_excdocs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_lstdocs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'listagem',
//     arqPage: 'lstdocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_lstdocs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'logo_hlpdocs.svg',
//     arqTipo: 'logo',
//     arqAcao: 'help',
//     arqPage: 'hlpdocs',
//     arqPath: 'C:/SysBordados/logo/cadastro/logo_hlpdocs.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
// ///////////////////////////////////////////////////////////////////////
//   {
//     arqNome: 'btn_incluir.svg',
//     arqTipo: 'botao',
//     arqAcao: 'inclusao',
//     arqPage: 'cadastro_cliente',
//     arqPath: 'C:/SysBordados/botao/inclusao/btn_incluir.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'btn_alterar.svg',
//     arqTipo: 'botao',
//     arqAcao: 'inclusao',
//     arqPage: 'cadastro_cliente',
//     arqPath: 'C:/SysBordados/botao/inclusao/btn_incluir.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   },
//   {
//     arqNome: 'btn_excluir.svg',
//     arqTipo: 'botao',
//     arqAcao: 'exclusao',
//     arqPage: 'cadastro_cliente',
//     arqPath: 'C:/SysBordados/botao/exclusao/btn_excluir.svg',
//     id_default: 1,
//     createBy: 0,
//     updateBy: 0
//   }

// ];





// export const requiredImagens1: string[] = [








//   'dlogo00.sgv',
//   'dvatar00.sgv',
//   'fvatar01.sgv',
//   'fvatar02.sgv',
//   'fvatar03.sgv',
//   'fvatar04.sgv',
//   'fvatar05.sgv',
//   'fvatar06.sgv',
//   'fvatar07.sgv',
//   'fvatar08.sgv',
//   'fvatar09.sgv',
//   'fvatar10.sgv',
//   'fvatar11.sgv',
//   'fvatar12.sgv',
//   'fvatar13.sgv',
//   'fvatar14.sgv',
//   'fvatar15.sgv',
//   'fvatar16.sgv',
//   'fvatar17.sgv',
//   'fvatar18.sgv',
//   'fvatar19.sgv',
//   'fvatar20.sgv',
//   'fvatar21.sgv',
//   'mvatar01.sgv',
//   'mvatar02.sgv',
//   'mvatar03.sgv',
//   'mvatar04.sgv',
//   'mvatar05.sgv',
//   'mvatar06.sgv',
//   'mvatar07.sgv',
//   'mvatar08.sgv',
//   'mvatar09.sgv',
//   'mvatar10.sgv',
//   'mvatar11.sgv',
//   'mvatar12.sgv',
//   'mvatar13.sgv',
//   'mvatar14.sgv',
//   'mvatar15.sgv',
//   'mvatar16.sgv',
//   'mvatar17.sgv',
//   'mvatar18.sgv',
//   'mvatar19.sgv',
//   'mvatar20.sgv',
//   'mvatar21.sgv'
// ];

// export const requiredLogo = [
//   'dlogo00'
// ];














