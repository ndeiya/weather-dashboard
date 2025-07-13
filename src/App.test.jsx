import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App.jsx'
import React from 'react'

describe('Weather Dashboard', () => {
  it('renders the dashboard title', () => {
    render(<App />)
    expect(screen.getByText(/Weather Dashboard/i)).toBeInTheDocument()
  })

  it('shows error for invalid city', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Search city/i)
    fireEvent.change(input, { target: { value: 'NotARealCity' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    await waitFor(() => {
      expect(screen.getByText(/City not found/i)).toBeInTheDocument()
    })
  })
}) 