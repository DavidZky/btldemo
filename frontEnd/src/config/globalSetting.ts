// アップロードファイルの上限
// Message : ファイル容量が大きすぎます 上限10Mb
const MAX_UPLOAD_FILE_SIZE = 10485760;

// TextFieldの最大文字数
const MAX_TEXT_LENGTH = 255;

// Varcharの最大文字数
const MAX_VARCHAR_LENGTH = 65535;

const EXCLUDE_ACCEPT_ALL_OPTION = true;

const ROLE = {
  Editor: 1,
  Reviewer: 2,
  Manager: 3,
  GM: 4,
} as const;

export { MAX_UPLOAD_FILE_SIZE, MAX_TEXT_LENGTH, MAX_VARCHAR_LENGTH, EXCLUDE_ACCEPT_ALL_OPTION, ROLE };
