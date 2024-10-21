// カレンダーリストのアイテム（カレンダーの基本情報）
export interface CalendarListEntry {
  id: string // カレンダーID
  summary: string // カレンダーの名前
  description?: string // カレンダーの説明
  timeZone: string // カレンダーのタイムゾーン
  // 必要に応じて他のフィールドを追加
}

// カレンダーのイベント
export interface CalendarEvent {
  id: string // イベントID
  summary: string // イベントのタイトル
  description?: string // イベントの説明
  start: {
    date?: string
    dateTime?: string // 開始日時（ISO 8601形式）
    timeZone?: string // イベントのタイムゾーン（オプション）
  }
  end: {
    date?: string
    dateTime?: string // 終了日時（ISO 8601形式）
    timeZone?: string // イベントのタイムゾーン（オプション）
  }
  // 必要に応じて他のフィールドを追加
}

// 複数のカレンダーから取得したイベントをまとめたレスポンス
export interface CalendarData {
  calendarId: string // カレンダーID
  calendarName: string // カレンダー名
  events: CalendarEvent[] // カレンダー内のイベントのリスト
}

export interface FormattedCalendarData {
  id: string
  summary: string
  start?: string
  end?: string
  calendarId: string
  calendarName: string
}

// カレンダー取得APIのレスポンス
export interface GetCalendarResponse {
  calendars: CalendarData[] // 取得したカレンダーのデータ
}
