import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert } from "@mui/material"
import { useState } from "react"
import { useStore } from "../../../../hooks/stores"
import { BaseButton } from "./BaseButton"
import { saveDenuncia } from "../../../../service/curriculo"  // Adapte para o caminho correto da sua função
import { useParams } from "react-router-dom"

type Props = {
    idVaga?: string,
    idCandidato?: string,
    setOpenModalDenuncia: (OpenModalDenuncia: boolean) => void
}


export const DenunciaModal = ({ idVaga, idCandidato, setOpenModalDenuncia }: Props) => {
    const { loginStore, snackbarStore } = useStore()
    const [titulo, setTitulo] = useState<string>('')
    const [conteudo, setConteudo] = useState<string>('')
    const [loading, setLoading] = useState(false)


    const handleSubmitDenuncia = async () => {
      if (titulo && conteudo && idVaga && idCandidato) {
        try {
          const body = {
            denunciante_id: Number(idVaga),
            denunciante_tipo: 'Empresa',
            denunciado_id: Number(idCandidato),
            titulo,
            conteudo
          };
          console.log('Requisição para salvar denúncia:', body);

          await saveDenuncia(
            idVaga,
            idCandidato,
            Number(idVaga),
            'Empresa',
            Number(idCandidato),
            titulo,
            conteudo,
            loginStore.token
          );

         snackbarStore.setSeverity('success');
         snackbarStore.setMessage('Denúncia realizada com sucesso');
         snackbarStore.setOpenSnackbar(true);
         setOpenModalDenuncia(false);
        } catch (error) {
          snackbarStore.setSeverity('error');
          snackbarStore.setMessage('Erro ao enviar denúncia. Tente novamente.');
          snackbarStore.setOpenSnackbar(true);

        }
      } else {
        snackbarStore.setSeverity('error');
        snackbarStore.setMessage('Preencha todos os campos');
        snackbarStore.setOpenSnackbar(true);

      }
    };


    return (
        <FormControl sx={{ width: "100%", mt: 2 }}>

            <Box mt={4}>
                <Typography className="text-gray-500 text-sm">Título</Typography>
                <textarea
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={1}
                />
            </Box>

            <Box mt={4}>
                <Typography className="text-gray-500 text-sm">Contéudo da denúncia</Typography>
                <textarea
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={3}
                />
            </Box>

            <Box display="flex" justifyContent="space-between" mt={4}>
                <BaseButton
                    backgroundColor="#FFF"
                    extraStyle={{ border: 1, borderColor: '#4766AC', color: '#4766AC' }}
                    children={
                        <Box onClick={() => setOpenModalDenuncia(false)} component="span">
                            <Typography>Cancelar</Typography>
                        </Box>
                    }
                />

                <BaseButton
                    backgroundColor="#5E80BB"
                    extraStyle={{ color: '#FFF', ':hover': { backgroundColor: '#4766AC' } }}
                    children={
                        <Box onClick={handleSubmitDenuncia} component="span">
                            {loading ? (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <CircularProgress color="inherit" size={16} />
                                    <Typography marginLeft={1}>Alterando...</Typography>
                                </Box>
                            ) : (
                                <Typography>Denunciar</Typography>
                            )}
                        </Box>
                    }
                />
            </Box>


        </FormControl>
    )
}
