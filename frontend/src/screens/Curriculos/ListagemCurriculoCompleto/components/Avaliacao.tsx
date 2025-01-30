import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert } from "@mui/material"
import { useState } from "react"
import { useStore } from "../../../../hooks/stores"
import { BaseButton } from "./BaseButton"
import { saveAvaliacao } from "../../../../service/curriculo"  // Adapte para o caminho correto da sua função
import { useParams } from "react-router-dom"

type Props = {
    idVaga?: string,
    idCandidato?: string,
    setOpenModalAvaliacao: (OpenModalAvaliacao: boolean) => void
}

export const AvaliacaoModal = ({ idVaga, idCandidato, setOpenModalAvaliacao }: Props) => {
    const { loginStore, snackbarStore } = useStore()
    const [nota, setNota] = useState<number>(0)
    const [pros, setPros] = useState<string>('')
    const [contras, setContras] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const saveEvaluation = async () => {
        if (nota > 0 && pros && contras && idVaga && idCandidato) {
            try {
                setLoading(true)
                const result = await saveAvaliacao(
                    idVaga,
                    idCandidato,
                    Number(idVaga),
                    'Empresa',
                    Number(idCandidato),
                    nota,
                    pros,
                    contras,
                    loginStore.token
                )
                snackbarStore.setOpenSnackbar(true)
                snackbarStore.setSeverity('success')
                snackbarStore.setMessage('Avaliação enviada com sucesso')
                setOpenModalAvaliacao(false)
            } catch (error) {
                snackbarStore.setOpenSnackbar(true)
                snackbarStore.setSeverity('error')
                snackbarStore.setMessage('Erro ao enviar avaliação. Tente novamente.')
            }
        } else {
            snackbarStore.setSeverity('error')
            snackbarStore.setMessage('Preencha todos os campos')
            snackbarStore.setOpenSnackbar(true)
        }
    }


    return (
        <FormControl sx={{ width: "100%", mt: 2 }}>
            <Box mt={4}>
                <Typography className="text-gray-500 text-sm">Nota</Typography>
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
            </Box>

            <Box mt={4}>
                <Typography className="text-gray-500 text-sm">Prós</Typography>
                <textarea
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={3}
                />
            </Box>

            <Box mt={4}>
                <Typography className="text-gray-500 text-sm">Contras</Typography>
                <textarea
                    value={contras}
                    onChange={(e) => setContras(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={3}
                />
            </Box>

            <Box display="flex" justifyContent="space-between" mt={4}>
                <BaseButton
                    backgroundColor="#FFF"
                    extraStyle={{ border: 1, borderColor: '#4766AC', color: '#4766AC' }}
                    children={
                        <Box onClick={() => setOpenModalAvaliacao(false)} component="span">
                            <Typography>Cancelar</Typography>
                        </Box>
                    }
                />

                <BaseButton
                    backgroundColor="#5E80BB"
                    extraStyle={{ color: '#FFF', ':hover': { backgroundColor: '#4766AC' } }}
                    children={
                        <Box onClick={saveEvaluation} component="span">
                            {loading ? (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <CircularProgress color="inherit" size={16} />
                                    <Typography marginLeft={1}>Alterando...</Typography>
                                </Box>
                            ) : (
                                <Typography>Salvar Avaliação</Typography>
                            )}
                        </Box>
                    }
                />
            </Box>


        </FormControl>
    )
}
