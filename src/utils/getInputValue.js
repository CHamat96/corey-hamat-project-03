import { useState } from 'react'
function useInputValue(initialValue) {
  const [inputValue, setInputValue] = useState(initialValue)
  
  function handleValueChange(event) {
    setInputValue(event.target.value)
  }

  function clearInput() {
    setInputValue('')
  }

  return [
    inputValue,
    handleValueChange,
    clearInput
  ]
}

export default useInputValue