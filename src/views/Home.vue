<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { fetchGoogleCalendarData } from '@/api/calendar.ts'

/**
 * ref
 */
const data = ref()

// 今日の日付を取得
const today: Dayjs = dayjs()
const currentYear: number = today.year()
const currentMonth: number = today.month()

// 月の初日と末日を取得
const firstDayOfMonth: Dayjs = dayjs().startOf('month')
const lastDayOfMonth: Dayjs = dayjs().endOf('month')

// 月の全ての日付を配列に格納
const daysInMonth: Dayjs[] = []
for (let i = 1; i <= lastDayOfMonth.date(); i++) {
  daysInMonth.push(dayjs(new Date(currentYear, currentMonth, i)))
}

// 曜日を表示するためのラベル
const weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// 月の初日の曜日（カレンダーの開始位置を決める）
const startDayOfWeek: number = firstDayOfMonth.day()

onBeforeMount(() => {
  const calendarIds = [
    '2f0f4675fcfb7472fdd2677a437fea09f08c69e1bdc02daecc8731b45f670709@group.calendar.google.com', // 配信（他の配信者枠）
    '529082a19355668b7b9fef09923eb4cc5f7ac8111b87f4260569d760f8e35f21@group.calendar.google.com', // 配信（メン限）
    '4e7400408d537a5c93893695e5ddb0a6f122d3d82083f7c97b2b9c14d1f40345@group.calendar.google.com', // 配信
    '535e2af5af07fa862de15e01be55507fd808434a86f957f56fdba8f64e890dae@group.calendar.google.com', // 記念日
    '5ecb58a789b91ea7b4d82b0b3e2070bd9b9b5fd5868a8c5bff3331c34ebee94c@group.calendar.google.com', // グッズ
    'ea9c8449e4740ca765a18c3e9b677861f6a0eca0d95d5ddeb1c965ffc85a8fe7@group.calendar.google.com' // イベント
  ]
  fetchGoogleCalendarData(calendarIds).then((res) => {
    data.value = res
    console.log(res)
  })
})
</script>

<template>
  <div class="background">
    <div class="header">
      <div class="month-year-area">
        <div class="month-year">
          <div class="month">{{ currentMonth + 1 }}</div>
          <div class="year">{{ currentYear }}</div>
        </div>
        <div class="copy-right-area">
          <div class="copy-right">
            <div>Schedule of Yuuhi Sendou</div>
            <div>Created By <span class="japanese">てんとうむしの楽園</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="weekdays">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        :class="['week', index === 0 ? 'sunday' : '', index === 6 ? 'saturday' : '']"
      >
        {{ day }}
      </div>
    </div>

    <div class="days">
      <div v-for="n in startDayOfWeek" :key="'empty-' + n" class="day empty"></div>

      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        :class="['day', day.day() === 0 ? 'sunday' : '', day.day() === 6 ? 'saturday' : '']"
      >
        <span class="date">{{ day.date() }}</span>
      </div>
    </div>

    <div class="footer">
      <div class="title">今月の主な予定</div>
      <div class="content">
        <div>
          <span>today</span>
          <span class="description">WORLDS決勝</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background {
  box-sizing: border-box;
  background-color: #ffffff;
  // height: 1267px;
  width: 440px;
  min-width: 400px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 20vh;
    padding: 8px 10px;
    background-color: #c59785;
    margin-bottom: 4px;
    color: #ffffff;

    .month-year-area {
      position: absolute;
      width: calc(100% - 20px);
      left: 8px;
      bottom: 10px;
      display: flex;
      gap: 4px;

      .month-year {
        position: relative;
        .month {
          font-size: 48px;
          line-height: 40px;
        }
        .year {
          font-size: 32px;
          line-height: 28px;
        }
      }

      .copy-right-area {
        position: relative;
        width: 100%;

        .copy-right {
          position: absolute;
          left: 0;
          bottom: 0;
          font-size: 7px;
          font-weight: bold;
          .japanese {
            font-family: 'YakuHanJP';
            font-size: 7px;
          }
        }
      }
    }
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    width: 100%;
    font-size: 6px;
    font-family: 'Barlow Condensed';
    font-weight: bold;

    .week {
      font-weight: bold;
      text-align: center;
      background-color: #ffeac9;
    }

    .saturday {
      background-color: #fd9b72;
      color: #ffffff;
    }

    .sunday {
      background-color: #c59785;
      color: #ffffff;
    }
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    width: 100%;
    font-size: 7px;
    font-family: 'Barlow Condensed';
    font-weight: bold;
    margin-top: 4px;

    .day {
      position: relative; /* 親要素を相対配置 */
      height: 56px;
      text-align: center;
      background-color: #ffeac9;
    }

    .saturday {
      background-color: #fd9b72;
      color: #ffffff;
    }

    .sunday {
      background-color: #c59785;
      color: #ffffff;
    }

    .empty {
      background-color: transparent;
    }

    .date {
      position: absolute; /* 子要素を絶対配置 */
      top: 4px;
      right: 6px;
    }
  }

  .footer {
    box-sizing: border-box;
    height: 100px;
    background-color: #ffeac9;
    width: 100%;
    margin-top: 4px;
    padding: 6px 10px;
    .title {
      font-family: 'YakuHanJP';
      font-weight: bold;
      font-size: 10px;
    }

    .content {
      font-size: 7px;
      font-weight: bold;
      .description {
        margin-left: 2px;
        font-family: 'Barlow Condensed', 'YakuHanJP';
        font-size: 7px;
      }
    }
  }
}
</style>
