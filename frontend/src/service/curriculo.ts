import { api } from './baseURL';

export const createCurriculo = async (
  token: string,
  idCandidato: string,
  experiences: Array<any>,
  idiomas: Array<any>,
  cursos: Array<any>
) => {
  const response = await api.post(
    `/usuario/curriculo/${idCandidato}`,
    {
      experiencias: experiences,
      idiomas: idiomas,
      cursos: cursos,
    },
    {
      headers: {
        'authorization-token': token,
      },
    }
  );


  return { ok: response.data.ok, message: response.data.message };
};

export const getCurriculosVaga = async (idVaga: string, token: string) => {
  const response = await api.get(
    `usuario/empresa/vaga/curriculos/${idVaga}`,
    {
      headers: {
        'authorization-token': token,
      },
    }
    );
  return response.data.curriculos;
};

export const getCurriculo = async(idCurriculo: string, token: string) => {
  const response = await api.get(
    `usuario/empresa/curriculo/${idCurriculo}`,
    {
      headers: {
        'authorization-token': token,
      },
    }
    );
  return response.data.curriculo;
}

export const getListCandidacy = async(idCurriculo: string, token: string) => {
  const response = await api.get(
    `usuario/candidatura/vagas/${idCurriculo}`,
    {
      headers: {
        'authorization-token': token,
      },
    }
    );
  return response.data;
}

export const getListAvaliacoes = async (idCurriculo: string, token: string) => {
    const response = await api.get(
        `/usuario/candidatura/vagas/avaliar/${idCurriculo}`,
        {
            headers: {
                'authorization-token': token,
            },
        }
        );
    return response.data;
};


export const saveAvaliacao = async (
    idCurriculo: string,
    idVaga: string,
    avaliadorId: number,
    avaliadorTipo: string,
    avaliadoId: number,
    nota: number,
    pros: string,
    contras: string,
    token: string
    ) => {
    const body = {
        avaliador_id: avaliadorId,
        avaliador_tipo: avaliadorTipo,
        avaliado_id: avaliadoId,
        nota: nota,
        pros: pros,
        contras: contras,
    };

    const response = await api.post(
        `/usuario/avaliar/${idCurriculo}/${idVaga}`,
    body,
    {
        headers: {
            'authorization-token': token,
        },
    }
    );

    return response.data;
};


export const saveDenuncia = async (
    idCurriculo: string,
    idVaga: string,
    denuncianteId: number,
    denuncianteTipo: string,
    denunciadoId: number,
    tipoDenuncia: number,
    token: string
    ) => {
        const body = {
        denunciante_id: denuncianteId,
        denunciante_tipo: denuncianteTipo,
        denunciado_id: denunciadoId,
        tipo_denuncia: tipoDenuncia,
    };

    const response = await api.post(
        `/usuario/denunciar/${idCurriculo}/${idVaga}`,
    body,
    {
        headers: {
            'authorization-token': token,
        },
    }
    );

    return response.data;
};