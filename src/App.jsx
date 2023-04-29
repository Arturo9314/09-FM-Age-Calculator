import './App.css'
import React, { useState } from 'react'
import { differenceInCalendarDays, differenceInYears, differenceInMonths, addMonths, addYears, getYear, getMonth, getDate } from 'date-fns'
import { ReactComponent as ArrowIcon } from './assets/images/icon-arrow.svg'

function App () {
  const normalColor = 'var(--smoke-grey)'
  const errorColor = 'var(--ligth)'

  const [ageCalculator, setAgeCalculator] = useState({
    day: NaN,
    month: NaN,
    year: NaN
  })

  const [timeElapsed, setTimeElapsed] = useState({
    elapsedYears: 0,
    elapsedMonths: 0,
    elapsedDays: 0
  })

  const [errorMessage, setErrorMessage] = useState({
    errorDay: '',
    errorMonth: '',
    errorYear: ''
  })

  const notEmpty = () => {
    const { day, month, year } = ageCalculator
    return day && month && year
  }

  const dayColor = (str) => {
    const dayElement = document.querySelectorAll('.hasError-day')
    const dayInput = document.getElementById('bd-day')
    dayInput.style.borderColor = str
    dayElement.forEach(e => {
      e.style.color = str
    })
  }
  const monthColor = (str) => {
    const monthElement = document.querySelectorAll('.hasError-month')
    const monthInput = document.getElementById('bd-month')
    monthInput.style.borderColor = str
    monthElement.forEach(e => {
      e.style.color = str
    })
  }
  const yearColor = (str) => {
    const yearElement = document.querySelectorAll('.hasError-year')
    const yearInput = document.getElementById('bd-year')
    yearInput.style.borderColor = str
    yearElement.forEach(e => {
      e.style.color = str
    })
  }

  const redMessages = (condition, type, text) => {
    if (condition) {
      setTimeElapsed({
        elapsedDays: 0,
        elapsedMonths: 0,
        elapsedYears: 0
      })
      dayColor(normalColor)
      monthColor(normalColor)
      yearColor(normalColor)
      if (type === 'all') {
        setErrorMessage({
          errorDay: text,
          errorMonth: text,
          errorYear: text
        })
        dayColor(errorColor)
        monthColor(errorColor)
        yearColor(errorColor)
      } else if (type === 'year') {
        setErrorMessage({
          errorDay: '',
          errorMonth: '',
          errorYear: text
        })
        yearColor(errorColor)
      } else if (type === 'month') {
        setErrorMessage({
          errorDay: '',
          errorMonth: text,
          errorYear: ''
        })
        monthColor(errorColor)
      } else if (type === 'day') {
        setErrorMessage({
          errorDay: text,
          errorMonth: '',
          errorYear: ''
        })
        dayColor(errorColor)
      }
    } else {
      setErrorMessage({
        errorDay: '',
        errorMonth: '',
        errorYear: ''
      })
      dayColor(normalColor)
      monthColor(normalColor)
      yearColor(normalColor)
    }
  }

  const calculateElapsedTime = (dateInput, today) => {
    const yearsElapsed = differenceInYears(today, dateInput)
    const monthsElapsedInYear = differenceInMonths(today, addYears(dateInput, yearsElapsed))
    const monthsElapsed = differenceInMonths(today, dateInput)
    const daysElapsedInMonth = differenceInCalendarDays(today, addMonths(dateInput, monthsElapsed))
    return { yearsElapsed, monthsElapsedInYear, daysElapsedInMonth }
  }

  const valDate = (date) => {
    const dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])/

    // Matching the date through regular expression
    if (date.match(dateformat)) {
      const operator = date.split('/')
      // Extract the string into month, date and year
      let datepart = []
      if (operator.length > 1) {
        datepart = date.split('/')
      }
      const day = parseInt(datepart[0])
      const month = parseInt(datepart[1])
      const year = parseInt(datepart[2])

      // Create a list of days of a month
      const ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (month > 12 || month < 1) {
        redMessages(true, 'month', 'Must be a valid month')
        return false
      } else if (month === 1 || month > 2) {
        if (day > ListofDays[month - 1]) {
          // to check if the date is out of range
          redMessages(true, 'day', 'Must be a valid day')
          return false
        }
      } else if (month === 2) {
        let leapYear = false
        if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true
        if ((leapYear === false) && (day >= 29)) {
          redMessages(true, 'day', 'Must be a valid day')
          return false
        } else if ((leapYear === true) && (day > 29)) {
          redMessages(true, 'day', 'Must be a valid day')
          return false
        }
      }
    } else {
      redMessages(true, 'day', 'Invalid date format!')
      return false
    }
    return 'Valid date'
  }

  const handleSubmit = (e) => {
    redMessages(false, 'all', '')
    e.preventDefault()
    if (notEmpty()) {
      const { year, month, day } = ageCalculator
      const dateInput = new Date(year, month - 1, day)
      const today = new Date()
      const todayYear = getYear(today)
      const todayMonth = getMonth(today) + 1
      const todayDay = getDate(today)
      try {
        if (!valDate(day + '/' + month + '/' + year)) {
          return
        } else {
          if (dateInput > today) {
            redMessages(false, 'all', '')
            if (year > todayYear) {
              redMessages(true, 'year', 'Must be in the past')
            } else if (month > todayMonth) {
              redMessages(true, 'month', 'Must be in the past')
            } else if (day > todayDay) {
              redMessages(true, 'day', 'Must be in the past')
            }
          } else {
            const { yearsElapsed, monthsElapsedInYear, daysElapsedInMonth } = calculateElapsedTime(dateInput, today)
            setTimeElapsed({
              elapsedYears: yearsElapsed,
              elapsedMonths: monthsElapsedInYear,
              elapsedDays: daysElapsedInMonth
            })
            redMessages(false, 'all', '')
          }
        }
      } catch (err) {
        redMessages(true, 'day', err)
      }
    } else {
      const emptyDayOrZero = ageCalculator.day === 0 || isNaN(ageCalculator.day)
      const emptyMonthOrZero = ageCalculator.month === 0 || isNaN(ageCalculator.month)
      const emptyYearOrZero = ageCalculator.year === 0 || isNaN(ageCalculator.year)
      if (emptyDayOrZero && emptyMonthOrZero && emptyYearOrZero) {
        redMessages(true, 'all', 'This fiel is required')
      } else if (emptyDayOrZero || emptyMonthOrZero || emptyYearOrZero) {
        redMessages(true, 'all', 'This fiel is required')
        if (emptyDayOrZero) { redMessages(true, 'day', 'This fiel is required') }
        if (emptyMonthOrZero) { redMessages(true, 'month', 'This fiel is required') }
        if (emptyYearOrZero) { redMessages(true, 'year', 'This fiel is required') }
      }
    }
  }

  const handleChange = (value, name) => {
    const number = parseInt(value)
    if (name === 'day') {
      setAgeCalculator({ ...ageCalculator, day: number })
    } else if (name === 'month') {
      setAgeCalculator({ ...ageCalculator, month: number })
    } else if (name === 'year') {
      setAgeCalculator({ ...ageCalculator, year: number })
    }
  }

  return (
    <section className="App">
      <form onSubmit={handleSubmit} id='bd-inputs'>
        <label className='hasError-day' id='bd-day-label' htmlFor='bd-day'>DAY</label>
        <input placeholder='DD' type='number' id='bd-day' name='bd-day'
          onChange={(e) => handleChange(e.target.value, 'day')}/>
        <p className='hasError-day' id='error-day' >{errorMessage.errorDay && errorMessage.errorDay}</p>

        <label className='hasError-month' id='bd-month-label' htmlFor='bd-month'>MONTH</label>
        <input placeholder='MM' type='number' id='bd-month' name='bd-month'
          onChange={(e) => handleChange(e.target.value, 'month')}/>
        <p className='hasError-month' id='error-month' >{errorMessage.errorMonth && errorMessage.errorMonth}</p>

        <label className='hasError-year' id='bd-year-label' htmlFor='bd-year'>YEAR</label>
        <input placeholder='YYYY' type='number' id='bd-year' name='bd-year'
          onChange={(e) => handleChange(e.target.value, 'year')}/>
        <p className='hasError-year' id='error-year' >{errorMessage.errorYear && errorMessage.errorYear}</p>

        <button type='submit' id='bd-submit'><ArrowIcon/></button>
      </form>
      <article id='time-elapsed'>
        <p><span>{timeElapsed.elapsedYears ? timeElapsed.elapsedYears : '--'}</span>{!timeElapsed.elapsedYears ? ' years' : timeElapsed.elapsedYears > 1 ? ' years' : ' year'}</p>
        <p><span>{timeElapsed.elapsedMonths ? timeElapsed.elapsedMonths : '--' }</span>{!timeElapsed.elapsedMonths ? ' months' : timeElapsed.elapsedMonths > 1 ? ' months' : ' month'}</p>
        <p><span>{timeElapsed.elapsedDays ? timeElapsed.elapsedDays : '--'}</span>{!timeElapsed.elapsedDays ? ' days' : timeElapsed.elapsedDays > 1 ? ' days' : 'day'}</p>
      </article>
    </section>
  )
}

export default App
