interface Snackbar {
  isShow: boolean;
  contained: boolean;
  minWidth: string;
  color: string;
  timeout: number;
  closeOnContentClick: boolean;
  icon: string;
  iconSize: string;
  text: string;
}

export type { Snackbar };
