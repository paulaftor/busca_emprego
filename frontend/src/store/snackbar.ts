import { makeAutoObservable } from 'mobx';

type SeverityType = 'success' | 'info' | 'warning' | 'error';
type SuccessMessage =
  | ''
  | 'Currículo salvo com sucesso'
  | 'Candidato cadastrado com sucesso'
  | 'Erro ao cadastrar o candidato'
  | 'Empresa cadastrada com sucesso'
  | 'Campo(s) em branco'
  | 'Falha ao cadastrar a empresa'
  | 'Email copiado para a área de transferência'
  | 'Status atualizado com sucesso e notificação enviada'
  | 'Denúncia enviada com sucesso!'
  | 'Ocorreu um erro ao copiar o email';
type ErrorMessage = 'Ops, algo deu errado :(' | 'Erro ao enviar denúncia. Tente novamente.' | 'Por favor, selecione uma opção de denúncia.';


export interface SnackbarStoreType {
  openSnackbar: boolean;
  setOpenSnackbar: (
    openSnackbar: boolean
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  severity: SeverityType;
  setSeverity: (
    severity: SeverityType
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  message: SuccessMessage | ErrorMessage;
  setMessage: (
    message: SuccessMessage | ErrorMessage
  ) => void | React.Dispatch<React.SetStateAction<string>>;

  showSnackBar: (responseStatus: string) => void;
}

export class SnackbarStore implements SnackbarStoreType {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  severity: SeverityType = 'info';
  setSeverity(severity: SeverityType) {
    this.severity = severity;
  }

  openSnackbar: boolean = false;
  setOpenSnackbar(openSnackbar: boolean) {
    this.openSnackbar = openSnackbar;
  }

  message: SuccessMessage | ErrorMessage = '';
  setMessage(message: SuccessMessage | ErrorMessage) {
    this.message = message;
  }

  showSnackBar(responseStatus: string) {
    if (responseStatus === 'OK') {
      this.setOpenSnackbar(true);
      this.setSeverity('success');
    } else {
      this.setOpenSnackbar(true);
      this.setSeverity('error');
    }
  }
}
