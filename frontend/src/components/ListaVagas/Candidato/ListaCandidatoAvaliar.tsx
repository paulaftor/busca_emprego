import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/stores';
import { saveAvaliacao } from '../../../service/curriculo';
import { useParams } from 'react-router-dom';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  periodo: string;
  salario: number;
  visualizar: number;
  EmpresaId: string;
  Empresa: {
    logo: string;
    nome: string;
  };
  status?: string;
}

interface ListaProps {
  listagem: Vaga[];
  idCurriculo: string;
}

export const ListaAvaliacoes = observer((props: ListaProps) => {

  const { listagem, idCurriculo } = props;
  const { loginStore } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [nota, setNota] = useState<number>(0);
  const [pros, setPros] = useState<string>('');
  const [contras, setContras] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const openModal = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNota(0);
    setPros('');
    setContras('');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const saveEvaluation = async () => {
    if (!selectedVaga) return;

    try {
      const result = await saveAvaliacao(
        idCurriculo,
        selectedVaga.id,
        Number(idCurriculo),
        'Candidato', // Tipo do avaliador
        Number(selectedVaga.id),
        nota,
        pros,
        contras,
        loginStore.token
      );

      console.log('Avaliação salva com sucesso:', result);
      showToast('Avaliação salva com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      showToast('Erro ao salvar avaliação. Tente novamente.');
    }
  };

  return (
    <div>
      {listagem.map((e) => (
        <div
          key={e.id}
          className="container mx-auto max-w-lg bg-white rounded border mt-4"
        >
          <div className="flex px-5 pt-5">
            {e.Empresa.logo == null ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-20 text-background1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            ) : (
              <img className="w-16" src={e.Empresa.logo} />
            )}
            <span className="pt-2 ml-4">
              <h3 className="font-bold">{e.titulo}</h3>
              <h4 className="text-sm">{e.Empresa.nome}</h4>
            </span>
          </div>
          <h3 className="mt-3 mx-6 font-bold text-[#32264D] text-[18px]">Requisitos</h3>
          <div className="mx-2 text-sm text-gray-500 mt-2 px-5 pb-5">
            {e.descricao.length < 250
              ? e.descricao
              : e.descricao.substring(0, 50) + ' ...'}
          </div>

          <hr />
          <div className="bg-stone-50">
            <div className="p-5 mx-2 flex justify-between items-center">
              <p className="text-slate-400">{e.periodo}</p>
              <p className="text-background1 font-bold">
                {e.salario !== null
                  ? 'R$ ' + e.salario?.toString().replace('.', ',')
                  : 'Faixa de salário indisponível'}
              </p>
              <button
                className="bg-background1 text-white py-2.5 px-6 rounded text-sm flex items-center"
                onClick={() => openModal(e)}
              >
                <span className="ml-2">Avaliar</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedVaga && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="font-bold text-lg">Avaliar vaga: {selectedVaga.titulo}</h3>

            <div className="mt-4 flex justify-between">
              <label className="text-sm font-semibold">Nota</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNota(star)}
                    className={`text-xl ${star <= nota ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">Pros</label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">Contras</label>
              <textarea
                value={contras}
                onChange={(e) => setContras(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                rows={3}
              />
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveEvaluation}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      {toastVisible && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 bg-green-500 text-white rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
});
