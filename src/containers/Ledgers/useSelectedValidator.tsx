import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export interface SelectedValidatorContextType {
  selectedValidator?: string
  setSelectedValidator: Dispatch<SetStateAction<string | undefined>>
}

export const SelectedValidatorContext =
  createContext<SelectedValidatorContextType>({
    selectedValidator: undefined,
    setSelectedValidator: (validator: SetStateAction<string | undefined>) =>
      validator,
  })

export const SelectedValidatorProvider: FC = ({ children }) => {
  const [selectedValidator, setSelectedValidator] = useState<string>()

  return (
    <SelectedValidatorContext.Provider
      value={{ selectedValidator, setSelectedValidator }}
    >
      {children}
    </SelectedValidatorContext.Provider>
  )
}

export const useSelectedValidator = (): SelectedValidatorContextType =>
  useContext(SelectedValidatorContext)
