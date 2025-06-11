export type DeleteAlertProps = {
  type: "delete";
  title: string;
  message: string;
  handleDelete: () => void;
};

export type ErrorAlertProps = {
  type: "error";
  title: string;
  message: string;
};

export type AlertProps = DeleteAlertProps | ErrorAlertProps;
