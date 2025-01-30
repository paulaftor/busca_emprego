/* eslint-disable no-lone-blocks */
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useState } from "react"
import { useStore } from "../../../../hooks/stores"
import { BaseButton } from "./BaseButton"

type Props = {
    idCandidato?: string,
    idVaga?: string,
    setOpenModal: (openModal: boolean) => void
}

export const UpdateStatusModal = ({ idVaga, idCandidato, setOpenModal}: Props) => {
  const {vagaStore, loginStore, snackbarStore} = useStore()

  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  return (
           <FormControl sx={{ width: "100%", mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>

          <Select
           labelId="demo-simple-select-label"
           id="demo-simple-select"
           value={status}
           label="Status"
           onChange={(event) => setStatus(event.target.value)}
         >
           <MenuItem value="Análise">Análise</MenuItem>
           <MenuItem value="Em andamento">Em andamento</MenuItem>
           <MenuItem value="Entrevistas">Entrevistas</MenuItem>
           <MenuItem value="Concluída">Concluída</MenuItem>
           <MenuItem value="Rejeitada">Rejeitada</MenuItem>
         </Select>

         <Box display="flex" flexDirection="row" justifyContent="space-between">

      <BaseButton
        backgroundColor="#FFF"
        extraStyle={ {border: 1, borderColor: '#4766AC',   color: '#4766AC',}}
         children={
           <Box onClick={() =>
            setOpenModal(false)
          }
            component="span">
                <Typography>Cancelar</Typography>

          </Box>
         }
      />

         <BaseButton
          backgroundColor="#5E80BB"
          extraStyle={ {color: '#FFF',  ':hover': {
            backgroundColor: '#4766AC',
          },}}
         children={
           <Box onClick={async () => {
            setLoading(true)
            await vagaStore.handleUpdateStatus(loginStore.token, status, idVaga, idCandidato);
            setLoading(false)
            setOpenModal(false)
            snackbarStore.setOpenSnackbar(true);
            snackbarStore.setSeverity('success');
            snackbarStore.setMessage('Status atualizado com sucesso e notificação enviada');
          }
          }
            component="span">
             {loading ? (
                <Box display="flex" flexDirection="row" alignItems="center">
                  <CircularProgress color="inherit" size={16} />
                  <Typography marginLeft={1} >Alterando...</Typography>
                </Box>
              ) : (
                <Typography>Alterar status</Typography>
              )}
          </Box>
         }
      />

         </Box>



         </FormControl>
    )
}