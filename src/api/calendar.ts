/**
 * カレンダー情報取得
 */

import axios from 'axios'
import {
  CalendarData,
  GetCalendarResponse,
  CalendarEvent,
  FormattedCalendarData
} from '@/types/calendar'
import { clearAccessToken, getCookie, TOKEN_KEY } from '@/auth/google' // クッキーからトークン取得関数をインポート

// Google Calendar API の URL
const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars'

// モックデータ
const mockCalendarData: GetCalendarResponse = {
  calendars: [
    {
      calendarId: 'mock-calendar-1',
      calendarName: 'Mock Calendar 1',
      events: [
        {
          id: 'event-1',
          summary: 'Sample Event 1',
          start: { dateTime: '2024-10-01T09:00:00Z' },
          end: { dateTime: '2024-10-01T10:00:00Z' }
        },
        {
          id: 'event-2',
          summary: 'Sample Event 2',
          start: { dateTime: '2024-10-05T12:00:00Z' },
          end: { dateTime: '2024-10-05T13:00:00Z' }
        }
      ]
    }
  ]
}

// Google Calendar API からデータを取得する関数
export const fetchGoogleCalendarData = async (
  accessToken: string,
  calendarIds: string[]
): Promise<CalendarData[]> => {
  const calendarDataPromises = calendarIds.map(async (calendarId) => {
    try {
      const response = await axios.get(`${GOOGLE_CALENDAR_API_URL}/${calendarId}/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}` // 取得したトークンを使用
        }
      })

      // APIレスポンスからイベントデータを抽出し、型に適合させる
      const events: CalendarEvent[] = response.data.items.map((item: any) => ({
        id: item.id,
        summary: item.summary,
        start: { dateTime: item.start.dateTime, date: item.start.date },
        end: { dateTime: item.end.dateTime, date: item.end.date }
      }))

      return {
        calendarId,
        calendarName: response.data.summary,
        events
      }
    } catch (error) {
      console.error(`Error fetching calendar data for calendarId: ${calendarId}`, error)
      throw new Error(`Failed to fetch data for calendarId: ${calendarId}`)
    }
  })

  return Promise.all(calendarDataPromises)
}

// カレンダー取得API
export const getCalendar = async (calendarIds: string[]): Promise<GetCalendarResponse> => {
  const isDev = import.meta.env.VITE_ENV === 'development'

  if (isDev) {
    // 開発環境ではモックデータを使用
    return mockCalendarData
  } else {
    // 本番環境ではGoogle Calendar APIからデータを取得
    try {
      const accessToken = getCookie(TOKEN_KEY)
      if (!accessToken) {
        throw new Error('アクセストークンがありません。') // トークンがない場合はエラーをスロー
      }
      const calendars = await fetchGoogleCalendarData(accessToken, calendarIds)
      return { calendars }
    } catch (error) {
      clearAccessToken()
      console.error('Error fetching Google Calendar data', error)
      throw new Error('Failed to fetch calendar data')
    }
  }
}

export const transformCalendarData = (data: CalendarData[]): FormattedCalendarData[] => {
  const transformedEvents = data.flatMap((calendar) =>
    calendar.events.map((event) => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime ? event.start.dateTime : event.start.date,
      end: event.end.dateTime ? event.end.dateTime : event.end.date,
      calendarId: calendar.calendarId,
      calendarName: calendar.calendarName
    }))
  )
  return transformedEvents
}
