import { makeAutoObservable, toJS } from 'mobx';
import { ItensList } from '../types/curriculo';
import { createCurriculo, getListCandidacy, getListAvaliacoes } from '../service';
import { SnackbarStore } from './snackbar';
export interface CurriculoStoreType {
  nomeEmpresa: string;
  setNomeEmpresa: (
    nomeEmpresa: string
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  inicio: string;
  setInicio: (
    inicio: string
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  fim: string;
  setFim: (fim: string) => void | React.Dispatch<React.SetStateAction<string>>;

  cargo: string;
  setCargo: (
    fim: string
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  experiencias: Array<ItensList>;
  setExperiencias: (experiencias: Array<ItensList>) => void;

  clearStatesCurriculo: () => void;
  handleSaveExperience: () => void;
  createExperience: () => void;

  handleCreateCurriculo: (
    token: string,
    id: string,
    createExperiencias: any,
    createIdiomas: any,
    createCursos: any
  ) => void;

  handleListCandidacy: (idCurriculo: string, token: string) => void
  handleListAvaliacoes: (idCurriculo: string, token: string) => void
}

export class CurriculoStore implements CurriculoStoreType {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  nomeEmpresa: string = '';
  setNomeEmpresa(nomeEmpresa: string) {
    this.nomeEmpresa = nomeEmpresa;
  }

    idCurriculo: string = '';
    setIdCurriculo(id: string) {
        this.idCurriculo = id;
    }

  inicio: string = '';
  setInicio(inicio: string) {
    this.inicio = inicio;
  }

  fim: string = '';
  setFim(fim: string) {
    this.fim = fim;
  }

  cargo: string = '';
  setCargo(cargo: string) {
    this.cargo = cargo;
  }

  experiencias: Array<ItensList> = [];
  setExperiencias(experiencias: Array<ItensList>) {
    this.experiencias = experiencias;
  }

  loading: boolean = false;
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  listCandidacy: Array<any> = [];
  setListCandidacy( listCandidacy: Array<any>) {
    this.listCandidacy = listCandidacy;
  }

  listAvaliacoes: Array<any> = [];
  setListAvaliacoes(listAvaliacoes: Array<any>) {
    this.listAvaliacoes = listAvaliacoes;
  }

  clearStatesCurriculo = () => {
    this.setCargo('');
    this.setInicio('');
    this.setFim('');
    this.setNomeEmpresa('');
  };

  handleSaveExperience = () => {
    if (this.cargo && this.fim && this.nomeEmpresa && this.inicio) {
      const item = {
        firstItem: this.nomeEmpresa,
        secondItem: this.cargo,
        thirdItem: this.inicio,
        fourItem: this.fim,
      };
      this.setExperiencias([item, ...this.experiencias]);
      this.clearStatesCurriculo();
    }
  };

  createNewExperience() {
    if (!this.experiencias.length) {
      const experienceItem = {
        firstItem: this.cargo,
        secondItem: this.fim,
        thirdItem: this.inicio,
        fourItem: this.nomeEmpresa,
      };

      this.setExperiencias([experienceItem, ...this.experiencias]);
    }
  }

  createExperience() {
    const newId = Math.floor(Math.random() * 100);

    const experiencias = this.experiencias
      .filter((i) => i.firstItem !== '')
      .map((i, index) => {
        return {
          id: newId,
          empresa: i.firstItem,
          cargo: i.secondItem,
          inicio: i.thirdItem,
          termino: i.fourItem,
          endereco: 'Rua Palmital',
          ramo: 'algum',
        };
      });

    return experiencias;
  }

  async handleCreateCurriculo(
    token: string,
    id: string,
    createExperiencias: any,
    createIdiomas: any,
    createCursos: any
  ) {
    const experiencias = createExperiencias();
    const idiomas = createIdiomas();
    const cursos = createCursos();

    const response = await createCurriculo(
      token,
      id as any,
      experiencias,
      idiomas,
      cursos
    );

    return response;
  }

  async handleListCandidacy(idCurriculo: string,  token: string){
    const response = await getListCandidacy(idCurriculo, token)
    console.log('RESPONSE', response)
    this.setListCandidacy(response)
    return response
  }

  async handleListAvaliacoes(idCurriculo: string, token: string) {
      const response = await getListAvaliacoes(idCurriculo, token);
      console.log('Avaliações:', response);
      this.setListAvaliacoes(response);
      return response;
  }



}
