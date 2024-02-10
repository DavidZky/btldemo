// API Path
const api = {
  base: {
    get: "/reports/{0}",
    put: "/reports",
  },
  toc: "/reports/toc/{0}",
  tocOrder: "/reports/tocOrder",
  body: "/reports/body/{0}",
  excel: "/reports/excel/{0}",
  word: "/reports/word/{0}",
  status: "/reports/status",
  duplication: "/reports/duplication",
  section: {
    content: "/reports/section/content/image/{0}",
    add: "/reports/sections",
    title: "/reports/sections/title",
    delete: "/reports/sections/{0}",
  },
  subsection: {
    content: "/reports/subsection/content/image/{0}",
    add: "/reports/subsections",
    title: "/reports/subsections/title",
    delete: "/reports/subsections/{0}",
  },
  contents: {
    paragraph: {
      add: "/reports/paragraphs",
      update: "/reports/paragraphs",
      delete: {
        chapter: "/reports/chapter/paragraphs/{0}",
        section: "/reports/section/paragraphs/{0}",
        subsection: "/reports/subsection/paragraphs/{0}",
      },
    },
    figure: {
      add: "/reports/figures",
      update: "/reports/figures",
      delete: {
        chapter: "/reports/chapter/figures/{0}",
        section: "/reports/section/figures/{0}",
        subsection: "/reports/subsection/figures/{0}",
      },
    },
    table: {
      add: "/reports/tables",
      update: "/reports/tables",
      delete: {
        chapter: "/reports/chapter/tables/{0}",
        section: "/reports/section/tables/{0}",
        subsection: "/reports/subsection/tables/{0}",
      },
    },
    common: {
      source_download: {
        section: "/reports/section/content/source?content_source={0}",
        subsection: "/reports/subsection/content/source?content_source={0}",
      },
    },
  },
  review: {
    list: "/reports/reviews/{0}",
    add: {
      section: "/reports/reviews/section",
      subsection: "/reports/reviews/subsection",
    },
    comment: "/reports/reviews/comment",
    status: "/reports/reviews/status",
    reviewers: "/reports/reviewers/{0}",
    download: "/reports/reviews/output/{0}",
  },
  editPassword: {
    valid: "/reports/editPassword",
    has: "/reports/editPassword/has/{0}",
  },
  tag: {
    add: "/reports/tags",
    master: "/reports/tags/{0}",
    similar: {
      section: "/reports/tags/similar/section?{0}",
      subsection: "/reports/tags/similar/subsection?{0}",
      replace: "/reports/tags/similar/replace",
    },
  },
} as const;

// テーブル
// ステータス
const REVIEW_STATUS = {
  NOT_STARTED: 1,
  DURING: 2,
  WORKING: 3,
  DONE: 8,
  DELETED: 9,
} as const;
const reviewStatusItems = [
  { value: REVIEW_STATUS.NOT_STARTED, text: "未着手", color: "error" },
  { value: REVIEW_STATUS.DURING, text: "対応中", color: "secondary" },
  { value: REVIEW_STATUS.WORKING, text: "対応済", color: "secondary" },
  { value: REVIEW_STATUS.DONE, text: "完了", color: "warning" },
  { value: REVIEW_STATUS.DELETED, text: "削除", color: "error" },
];

// 設計報告書のコンテンツタイプ
const reportContentType = {
  text: 0,
  image: 1,
  grid: 2,
  none: 9, // 節・項にコンテンツが一つも登録されていない
};

// 追加要素ニュー
const REPORT_CONTENT_TYPE = {
  PARAGRAPHS: 0,
  FIGURES: 1,
  TABLES: 2,
};
const addContentsMenu = [
  { id: REPORT_CONTENT_TYPE.PARAGRAPHS, text: "文章", icon: "mdi-text-long", iconColor: "black", action: "text" },
  { id: REPORT_CONTENT_TYPE.FIGURES, text: "図", icon: "mdi-pencil-ruler", iconColor: "primary", action: "image" },
  { id: REPORT_CONTENT_TYPE.TABLES, text: "表", icon: "mdi-grid", iconColor: "green", action: "grid" },
];

// 編集画面・グローバルメニュー
const REPORT_EDITOR_MENU = {
  PREVIEW: 0,
  EXCEL: 1,
  WORD: 2,
} as const;

const toolMenu = {
  editor: [
    { id: REPORT_EDITOR_MENU.PREVIEW, text: "プレビュー" },
    { id: REPORT_EDITOR_MENU.EXCEL, text: "Excel出力" },
    { id: REPORT_EDITOR_MENU.WORD, text: "Word出力" },
  ],
  reviewer: [
    { id: REPORT_EDITOR_MENU.PREVIEW, text: "プレビュー" },
    { id: REPORT_EDITOR_MENU.EXCEL, text: "Excel出力" },
    { id: REPORT_EDITOR_MENU.WORD, text: "Word出力" },
  ],
  manager: [
    { id: REPORT_EDITOR_MENU.PREVIEW, text: "プレビュー" },
    { id: REPORT_EDITOR_MENU.EXCEL, text: "Excel出力" },
    { id: REPORT_EDITOR_MENU.WORD, text: "Word出力" },
  ],
  gm: [
    { id: REPORT_EDITOR_MENU.PREVIEW, text: "プレビュー" },
    { id: REPORT_EDITOR_MENU.EXCEL, text: "Excel出力" },
    { id: REPORT_EDITOR_MENU.WORD, text: "Word出力" },
  ],
};
const editPasswordState = [
  { value: false, text: "未設定" },
  { value: true, text: "設定済み" },
];

// 設計報告書基本情報ヘッダー
const baseInfoItem = {
  name: "設計報告書名",
  author_name: "クリエイター",
  business_name: "業務名",
  structure_name: "構造物名",
  structure_type: "構造区分",
  department: "主管部署",
  chapter_number: "章番号",
  report_types: "報告書種別",
  status: "ステータス",
  created_at: "作成日時",
  update_name: "エディター",
  updated_at: "更新日時",
  password_for_edit: "編集パスワード",
  reviewer: "レビュアー",
};

// コンテンツクラス
const CONTENT_CLASS = {
  SECTION: 0,
  SUBSECTION: 1,
};

// アップロード可能画像拡張子
const UPLOAD_IMAGE_EXTENTION = [".jpeg", ".jpg", ".png"];
// アップロード可能Excel拡張子
const UPLOAD_SOURCE_EXTENTION = [".xlsx", ".xls", ".xlsm"];
// アップロード可能CAD拡張子
const UPLOAD_CAD_EXTENTION = [".dwg", ".dxf"];

export {
  REPORT_CONTENT_TYPE,
  REPORT_EDITOR_MENU,
  REVIEW_STATUS,
  CONTENT_CLASS,
  UPLOAD_IMAGE_EXTENTION,
  UPLOAD_SOURCE_EXTENTION,
  UPLOAD_CAD_EXTENTION,
  api,
  reviewStatusItems,
  addContentsMenu,
  reportContentType,
  toolMenu,
  baseInfoItem,
  editPasswordState,
};
