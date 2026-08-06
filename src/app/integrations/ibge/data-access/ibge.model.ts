
export interface IMunicipio {
  id: number;
  nome: string;
  microrregiao: IMicrorregiao;
}

export interface IMicrorregiao {
  id: number;
  nome: string;
  mesorregiao: IMesorregiao;
}

export interface IMesorregiao {
  id: number;
  nome: string;
  UF: IEstado;
}

export interface IEstado {
  id: number;
  sigla: string;
  nome: string;
  regiao: IRegiao;
}

export interface IRegiao {
  id: number;
  sigla: string;
  nome: string;
}

  